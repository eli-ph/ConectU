import { getDatabase } from "@/server/db/sqlite";

export function listarEmpresasAdministracion() {
  return getDatabase().prepare(`
    SELECT e.id, e.usuario_id, e.nombre_comercial, e.razon_social, e.rfc,
           e.tipo_contribuyente, e.sector, e.tamano, e.descripcion, e.sitio_web,
           e.contacto_nombre, e.contacto_cargo, e.telefono, e.ciudad, e.entidad,
           e.estado_verificacion, e.motivo_rechazo, e.fecha_solicitud,
           u.email, u.activo
      FROM EMPRESAS e JOIN USUARIOS u ON u.id = e.usuario_id
     ORDER BY CASE e.estado_verificacion WHEN 'pendiente' THEN 0 ELSE 1 END,
              e.fecha_solicitud DESC, e.id DESC LIMIT 200
  `).all();
}

export function registrarDecisionEmpresarial(adminId, empresaId, estado, motivo) {
  const db = getDatabase();
  return db.transaction(() => {
    const empresa = db.prepare("SELECT usuario_id, estado_verificacion FROM EMPRESAS WHERE id = ?").get(empresaId);
    if (!empresa) return { error: "Empresa no encontrada.", status: 404 };
    if (empresa.estado_verificacion === estado) return { error: "La empresa ya tiene ese estado.", status: 409 };
    const transiciones = {
      pendiente: ["aprobada", "rechazada"],
      aprobada: ["suspendida"],
      rechazada: ["pendiente"],
      suspendida: ["pendiente"],
    };
    if (!transiciones[empresa.estado_verificacion]?.includes(estado)) {
      return { error: "La transición entre estados no está permitida.", status: 409 };
    }

    // Aprobar una empresa registra la fecha; suspender/rechazar NO elimina los datos.
    db.prepare(`UPDATE EMPRESAS
      SET estado_verificacion = ?, motivo_rechazo = ?, revisado_por = ?,
          fecha_aprobacion = CASE WHEN ? = 'aprobada' THEN CURRENT_TIMESTAMP ELSE fecha_aprobacion END
      WHERE id = ?`).run(estado, motivo || null, adminId, estado, empresaId);

    if (estado === "aprobada") {
      const existing = db.prepare("SELECT id FROM SUSCRIPCIONES WHERE empresa_id = ? AND estado = 'activa'").get(empresaId);
      if (!existing) {
        const gratuito = db.prepare("SELECT id FROM CATALOGO_PLANES WHERE lower(nombre) = 'gratuito' AND activo = 1").get();
        if (!gratuito) throw new Error("No existe el plan gratuito. Ejecuta la preparación de catálogos.");
        db.prepare(`INSERT INTO SUSCRIPCIONES (empresa_id, plan_id, fecha_inicio, estado)
          VALUES (?, ?, datetime('now'), 'activa')`).run(empresaId, gratuito.id);
      }
    }
    const messages = {
      aprobada: "Tu empresa fue aprobada. Ya puedes gestionar oportunidades en ConectU.",
      rechazada: "La solicitud de tu empresa fue rechazada. Consulta el motivo en tu cuenta.",
      suspendida: "Tu empresa fue suspendida. No puedes realizar operaciones comerciales.",
      pendiente: "Tu empresa volvió a estar en revisión administrativa.",
    };
    db.prepare(`INSERT INTO NOTIFICACIONES(usuario_id, tipo, titulo, mensaje)
      VALUES (?, 'revision_empresa', 'Estado de tu empresa actualizado', ?)`).run(
      empresa.usuario_id, messages[estado] + (motivo ? ` Motivo: ${motivo}` : "")
    );
    return { ok: true, estado };
  })();
}
