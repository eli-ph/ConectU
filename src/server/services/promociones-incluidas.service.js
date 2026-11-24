/** Reglas empresariales de activación. El trigger SQLite consume el cupo en la misma transacción. */
import { ErrorDeNegocio } from '@/server/services/auth.service';
import {
  transaccionPromocion, empresaAprobadaDeUsuario, suscripcionVigente,
  planGratuito, ofertasParaPromocion, ofertaDeEmpresa,
  tarifaPromocion, existePromocionActiva, insertarPromocionIncluida,
  promocionesDeEmpresa,
} from '@/server/repositories/promociones-incluidas.repository';

function error(mensaje, estado=400) { throw new ErrorDeNegocio(mensaje,estado); }

function empresaDe(usuario) {
  if (!usuario || usuario.rol !== 'empresa') error('Debes iniciar sesión como empresa.',401);
  const empresa=empresaAprobadaDeUsuario(usuario.id);
  if (!empresa) error('Tu empresa debe estar aprobada para activar promociones.',403);
  return empresa;
}

function numeroId(valor) {
  const id=Number(valor);
  if (!Number.isSafeInteger(id) || id<=0 || id>2147483647) error('Selecciona una oferta válida.');
  return id;
}

function resultadoEmpresa(empresaId) {
  const s=suscripcionVigente(empresaId);
  const gratis=planGratuito() || {plan:'Gratuito',promociones_incluidas:0,dias_promocion_incluida:7};
  const datos=s||{...gratis,promociones_usadas:0};
  const total=datos.promociones_incluidas||0;
  const usados=datos.promociones_usadas||0;
  return {
    plan:datos.plan,
    suscripcionId:s?.id??null,
    incluidas:total,
    usadas:usados,
    disponibles:Math.max(0,total-usados),
    dias:datos.dias_promocion_incluida||7,
    ofertas:ofertasParaPromocion(empresaId,datos.dias_promocion_incluida||7),
    promociones:promocionesDeEmpresa(empresaId),
  };
}

export function consultarPromocionesIncluidas(usuario) {
  const empresa=empresaDe(usuario);
  return resultadoEmpresa(empresa.id);
}

export function activarPromocionIncluida(usuario, idOferta) {
  const empresa=empresaDe(usuario);
  const id=numeroId(idOferta);
  try {
    return transaccionPromocion(() => {
      // La transacción IMMEDIATE evita consumo simultáneo de la última activación.
      const s=suscripcionVigente(empresa.id);
      if (!s || s.promociones_usadas>=s.promociones_incluidas)
        error('No tienes promociones incluidas disponibles en tu plan actual.',409);
      const oferta=ofertaDeEmpresa(empresa.id,id);
      if (!oferta) error('No encontramos esa oferta en tu empresa.',404);
      if (oferta.estado!=='publicada') error('La oferta debe estar publicada.',409);
      // Mismo criterio UTC que el trigger de la base existente.
      const habilitada=ofertasParaPromocion(empresa.id,s.dias_promocion_incluida).find(o=>o.id===id);
      if (!habilitada?.elegible) error(habilitada?.motivo||'La oferta no admite promociones en este momento.',409);
      if (existePromocionActiva(id)) error('La oferta ya tiene una promoción activa.',409);
      const tarifa=tarifaPromocion(s.dias_promocion_incluida);
      if (!tarifa) error('La tarifa de promoción incluida no está configurada.',409);
      const promocionId=insertarPromocionIncluida(id,tarifa.id,s.dias_promocion_incluida);
      return { promocionId, ...resultadoEmpresa(empresa.id) };
    });
  } catch (e) {
    // El trigger es la última barrera de seguridad, no se expone su error interno a la UI.
    if (e?.code?.startsWith('SQLITE_CONSTRAINT'))
      error('No fue posible activar la promoción. Comprueba el plan y la vigencia de la oferta.',409);
    throw e;
  }
}
