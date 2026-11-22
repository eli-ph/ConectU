import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Building2,
  Clock3,
  CreditCard,
  GraduationCap,
  ShieldCheck,
  UserPlus,
  UsersRound,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { PendingCompaniesPreview } from "@/components/admin/pending-companies-preview";

export const metadata = { title: "Resumen administrativo" };

// Estructura visual preparada para recibir los indicadores del servicio administrativo.
// No sustituir los guiones por números inventados.
const metrics = [
  { label: "Empresas pendientes", detail: "En espera de revisión", icon: Clock3 },
  { label: "Empresas aprobadas", detail: "Con registro autorizado", icon: BadgeCheck },
  { label: "Empresas registradas", detail: "Total de cuentas de empresa", icon: Building2 },
  { label: "Planes activos", detail: "Suscripciones de pago vigentes", icon: CreditCard },
  { label: "Ofertas activas", detail: "Publicadas y vigentes", icon: BriefcaseBusiness },
  { label: "Estudiantes activos", detail: "Con postulación en 30 días", icon: UsersRound },
  { label: "Estudiantes registrados", detail: "Cuentas estudiantiles", icon: GraduationCap },
];

const pendingCompanyPreview = [
  {
    name: "Empresa demostrativa",
    initial: "ED",
    sector: "Tecnología",
    location: "Ciudad de México",
    state: "Pendiente",
  },
];

export default function AdminDashboard() {
  return (
    <DashboardShell
      role="admin"
      title="Panel de control y supervisión"
      eyebrow="Administración de ConectU"
    >
      <div className="flex flex-col gap-5 sm:gap-7">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0 max-w-3xl">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#fff0c4] px-3 py-1 text-xs font-bold text-[#775716]">
                <ShieldCheck size={14} aria-hidden="true" /> Panel administrador
              </span>
              <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500">
                Gestión de la plataforma
              </span>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
              Consulta los indicadores generales, revisa las solicitudes empresariales y da seguimiento
              a la actividad de ConectU desde un solo lugar.
            </p>
          </div>
          <Link
            href="/admin/administradores/nuevo"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 py-3 text-sm font-bold text-white shadow-soft transition hover:bg-brand-navy-light focus-visible:outline-offset-4 sm:w-fit"
          >
            <UserPlus size={18} aria-hidden="true" /> Registrar administrador
          </Link>
        </div>

        <section aria-labelledby="indicadores-titulo">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 id="indicadores-titulo" className="text-lg font-bold tracking-tight text-brand-navy sm:text-xl">
              Indicadores generales
            </h2>
            <span className="text-xs font-medium text-slate-500">Resumen de la plataforma</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
            {metrics.map((metric) => <AdminMetric key={metric.label} {...metric} />)}
          </div>
        </section>

        <section aria-labelledby="empresas-pendientes-titulo" className="overflow-hidden rounded-[22px] border border-slate-200 bg-white shadow-card">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 px-5 py-5 sm:px-7 sm:py-6 xl:flex-row xl:items-center">
            <div className="flex min-w-0 items-start gap-3 sm:items-center sm:gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-navy text-brand-gold">
                <Building2 size={22} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 id="empresas-pendientes-titulo" className="text-base font-bold text-brand-navy sm:text-lg">
                  Empresas pendientes de aprobación
                </h2>
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  Solicitudes que requieren revisión administrativa antes de publicar ofertas.
                </p>
              </div>
            </div>
            <Link href="/admin/empresas" className="inline-flex min-h-10 w-fit shrink-0 items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-brand-navy transition hover:bg-slate-50">
              Ver todas las empresas <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="border-b border-slate-100 bg-[#f7f8fc] px-5 py-3 text-xs text-slate-500 sm:px-7">
            Ejemplo de la estructura del listado
          </div>

          <PendingCompaniesPreview companies={pendingCompanyPreview} />
          <div className="flex flex-col justify-between gap-3 bg-[#f6f7fd] px-5 py-4 text-xs text-slate-600 sm:flex-row sm:items-center sm:px-7">
            <span>Solicitudes pendientes de aprobación</span>
            <Link href="/admin/empresas" className="inline-flex items-center gap-1 font-bold text-brand-navy hover:text-brand-navy-light">
              Ir a gestión de empresas <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

function AdminMetric({ label, detail, icon: Icon }) {
  return (
    <article className="relative min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-soft transition-shadow hover:shadow-card">
      <div className="flex min-h-10 items-start justify-between gap-2">
        <h3 className="text-xs font-bold leading-5 text-slate-600">{label}</h3>
        <Icon size={18} className="shrink-0 text-brand-navy" aria-hidden="true" />
      </div>
      <p className="mt-2 text-3xl font-extrabold tracking-tight text-brand-navy" aria-label={`${label}: pendiente de datos`}>—</p>
      <p className="mt-2 min-h-9 text-xs leading-[1.4] text-slate-500">{detail}</p>
    </article>
  );
}
