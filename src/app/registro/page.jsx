import Link from "next/link";
import { ArrowRight, BadgeCheck, Building2, Check, CircleCheck, GraduationCap, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";

export const metadata = { title: "Crear cuenta" };

const choices = [
  {
    href: "/registro/estudiante",
    icon: GraduationCap,
    title: "Soy estudiante de la UNAM",
    description: "Encuentra oportunidades de empleo inicial, prácticas profesionales, becariado y servicio social.",
    badge: "Acceso gratuito",
    notice: "El registro, la búsqueda de ofertas y las postulaciones son completamente gratuitos para estudiantes. No se cobran comisiones por postularse.",
    details: ["Registro con correo institucional UNAM", "Un CV vigente en tu perfil", "Seguimiento de tus postulaciones"],
    action: "Crear cuenta de estudiante",
  },
  {
    href: "/registro/empresa",
    icon: Building2,
    title: "Represento a una empresa",
    description: "Publica oportunidades, gestiona candidatos y consulta el avance de tus procesos de selección.",
    badge: "Aprobación requerida",
    notice: "Puedes registrar tu empresa y consultar su cuenta mientras se revisa. Para publicar ofertas o contratar planes y promociones se requiere aprobación administrativa.",
    details: ["Una cuenta de acceso por empresa", "Revisión administrativa de la empresa", "Planes y promociones empresariales"],
    action: "Registrar mi empresa",
  },
];

export default function RegisterPage() {
  return (
    <AuthShell selection>
      <div className="mx-auto max-w-[1240px]">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#edf0ff] px-4 py-1.5 text-xs font-bold text-brand-navy">
            <ShieldCheck size={15} className="text-brand-gold-dark" /> Elige el tipo de cuenta
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-brand-navy sm:text-4xl lg:text-[3rem]">Crea tu cuenta en ConectU</h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">Selecciona cómo participarás en nuestra plataforma de vinculación universitaria.</p>
        </div>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2 xl:gap-8">
          {choices.map((choice, index) => (
            <RegisterOption key={choice.href} {...choice} emphasized={index === 0} />
          ))}
        </div>

        <p className="mt-9 text-center text-sm text-slate-600">
          ¿Ya tienes una cuenta? <Link href="/ingresar" className="font-bold text-brand-navy underline decoration-brand-gold underline-offset-4 hover:text-brand-navy-light">Iniciar sesión</Link>
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-center text-xs leading-5 text-slate-500">ConectU es una plataforma independiente y no es un sitio oficial de la UNAM.</p>
      </div>
    </AuthShell>
  );
}

function RegisterOption({ href, icon: Icon, title, description, badge, notice, details, action, emphasized }) {
  return (
    <article className="group flex min-w-0 flex-col rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(20,43,73,0.055)] transition duration-200 hover:-translate-y-0.5 hover:border-brand-gold/70 hover:shadow-card sm:p-8 xl:p-9">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <span className={`grid h-16 w-16 place-items-center rounded-3xl ${emphasized ? "bg-brand-gold-soft text-brand-navy" : "bg-[#edf0ff] text-brand-navy"}`}>
          <Icon size={30} strokeWidth={1.9} aria-hidden="true" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#edf0ff] px-3.5 py-1.5 text-[0.74rem] font-bold text-brand-navy">
          {emphasized ? <BadgeCheck size={14} className="text-brand-gold-dark" /> : <ShieldCheck size={14} />}
          {badge}
        </span>
      </div>
      <h2 className="mt-7 text-[1.9rem] font-bold leading-tight tracking-[-0.03em] text-brand-navy">{title}</h2>
      <p className="mt-4 max-w-[34rem] text-base leading-8 text-slate-600">{description}</p>
      <div className={`mt-6 flex items-start gap-3 rounded-2xl px-5 py-5 text-[1rem] leading-8 ${emphasized ? "bg-[#fff5dd] text-[#654a10]" : "bg-[#edf0ff] text-brand-navy"}`}>
        {emphasized
          ? <CircleCheck size={20} className="mt-1 shrink-0" aria-hidden="true" />
          : <ShieldCheck size={20} className="mt-1 shrink-0" aria-hidden="true" />}
        <p>{notice}</p>
      </div>
      <ul className="mt-7 space-y-4 text-base text-slate-700">
        {details.map((item) => <li key={item} className="flex items-start gap-3"><Check size={18} className="mt-1 shrink-0 text-brand-gold-dark" aria-hidden="true" /><span>{item}</span></li>)}
      </ul>
      <Link href={href} className={`mt-auto inline-flex min-h-14 items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-base font-bold transition focus-visible:outline-offset-4 ${emphasized ? "mt-10 bg-brand-navy text-white hover:bg-brand-navy-light" : "mt-10 bg-[#edf0ff] text-brand-navy hover:bg-[#e1e7fb]"}`}>
        {action}<ArrowRight size={18} aria-hidden="true" />
      </Link>
    </article>
  );
}
