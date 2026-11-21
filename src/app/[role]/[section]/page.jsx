import { BookOpenText, Construction } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

const pages = {
  estudiante: {
    postulaciones: ["Mis postulaciones", "Consulta el estado y el detalle de tus solicitudes."],
    cuenta: ["Mi perfil y CV", "Administra tus datos académicos y tu único CV vigente."],
  },
  empresa: {
    ofertas: ["Mis ofertas", "Crea, publica y administra los ciclos de tus oportunidades."],
    plan: ["Plan y promociones", "Consulta tu capacidad y administra las promociones disponibles."],
    compras: ["Historial de compras", "Revisa los movimientos empresariales confirmados."],
    estadisticas: ["Estadísticas", "Consulta el desempeño general de tus ofertas."],
    cuenta: ["Mi cuenta empresarial", "Administra los datos y la seguridad de la cuenta."],
  },
  admin: {
    empresas: ["Gestión de empresas", "Revisa expedientes y estados de aprobación."],
    ofertas: ["Moderación de ofertas", "Consulta las ofertas activas que requieren supervisión."],
    usuarios: ["Administración de usuarios", "Consulta y administra las cuentas de la plataforma."],
    compras: ["Consulta de compras", "Revisa las operaciones comerciales registradas."],
    catalogos: ["Mantenimiento de catálogos", "Administra facultades, carreras, ejes y habilidades."],
    cuenta: ["Mi cuenta y seguridad", "Administra tu sesión administrativa."],
  },
};

export function generateStaticParams() {
  return Object.entries(pages).flatMap(([role, sections]) =>
    Object.keys(sections).map((section) => ({ role, section })),
  );
}

export default async function ModulePage({ params }) {
  const { role, section } = await params;
  const [title, description] = pages[role]?.[section] || ["Módulo", "Contenido del módulo."];

  return (
    <DashboardShell role={role} title={title} eyebrow="Estructura inicial">
      <section className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm sm:px-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-brand-gold-soft text-[#765600]"><Construction size={25} /></span>
        <h2 className="mt-5 text-xl font-bold text-brand-navy">Módulo preparado para implementación</h2>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">{description}</p>
        <div className="mx-auto mt-7 flex max-w-lg items-start gap-3 rounded-xl bg-slate-50 p-4 text-left">
          <BookOpenText className="mt-0.5 shrink-0 text-brand-navy" size={19} />
          <p className="text-sm leading-6 text-slate-600">La navegación y el layout ya están estandarizados. Los formularios, datos y reglas del módulo se conectarán durante su etapa funcional.</p>
        </div>
      </section>
    </DashboardShell>
  );
}
