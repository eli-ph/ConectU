import Link from "next/link";
import {
  ArrowUpRight,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  GraduationCap,
  Search,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main>
        <section className="grid-texture relative overflow-hidden bg-brand-navy-dark text-white">
          <div className="pointer-events-none absolute -right-20 -top-32 h-[420px] w-[420px] rounded-full bg-brand-gold/15 blur-3xl" />
          <div className="container-page relative grid min-h-[660px] items-center gap-12 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:py-24">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-sm text-slate-200">
                <Sparkles size={15} className="text-brand-gold" /> Oportunidades para comenzar tu trayectoria profesional
              </div>
              <h1 className="max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem]">
                Talento universitario que conecta con <span className="text-[#e7c46e]">oportunidades reales</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Explora empleos de nivel inicial, becariados, prácticas profesionales y servicio social desde una sola plataforma.
              </p>
              <form action="/ofertas" className="mt-9 flex max-w-2xl flex-col gap-2 rounded-xl bg-white p-2 shadow-2xl sm:flex-row">
                <label className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={19} />
                  <span className="sr-only">Buscar oportunidades</span>
                  <input name="q" className="h-12 w-full rounded-lg bg-transparent pl-11 pr-4 text-sm text-slate-900 outline-none" placeholder="Puesto, habilidad o empresa" />
                </label>
                <button className="h-12 rounded-lg bg-brand-gold px-6 text-sm font-bold text-brand-navy-dark transition hover:bg-[#d7ad4e]">Buscar oportunidades</button>
              </form>
              <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm text-slate-300">
                <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-brand-gold" /> Registro estudiantil gratuito</span>
                <span className="flex items-center gap-2"><CheckCircle2 size={17} className="text-brand-gold" /> Distintos ejes de acción</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px]">
              <div className="absolute -left-5 top-16 h-24 w-24 rounded-2xl border border-white/10 bg-white/5" />
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#102642] p-4 shadow-2xl sm:p-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div><p className="text-xs text-slate-400">Vista del estudiante</p><p className="text-sm font-semibold">Oportunidades recomendadas</p></div>
                  <span className="rounded-full bg-brand-gold-soft px-2.5 py-1 text-xs font-semibold text-[#765600]">Demostración</span>
                </div>
                <div className="mt-4 space-y-3">
                  <PreviewOffer icon={BriefcaseBusiness} type="Prácticas" title="Análisis de datos" detail="Remota · Tecnología" />
                  <PreviewOffer icon={Building2} type="Becariado" title="Desarrollo de producto" detail="Híbrida · Ciudad de México" />
                  <PreviewOffer icon={GraduationCap} type="Servicio social" title="Automatización de procesos" detail="Presencial · Ingeniería" />
                </div>
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {[['4', 'Tipos de oferta'], ['1', 'Perfil y CV'], ['0', 'Costo estudiante']].map(([value, label]) => (
                    <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-3"><p className="text-xl font-bold text-brand-gold">{value}</p><p className="mt-1 text-[0.7rem] leading-4 text-slate-400">{label}</p></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="container-page grid gap-5 py-8 sm:grid-cols-3">
            <TrustPoint icon={GraduationCap} title="Enfocada en estudiantes" text="Perfil académico, habilidades y un CV vigente." />
            <TrustPoint icon={Building2} title="Empresas verificadas" text="Revisión administrativa antes de publicar ofertas." />
            <TrustPoint icon={UsersRound} title="Seguimiento claro" text="Consulta el estado de cada postulación desde tu cuenta." />
          </div>
        </section>

        <section className="bg-page py-20">
          <div className="container-page">
            <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.12em] text-brand-gold">Una plataforma, cuatro caminos</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-brand-navy sm:text-4xl">Encuentra la oportunidad adecuada para tu etapa</h2><p className="mt-4 text-lg text-slate-600">Filtra por tipo de oferta, modalidad, eje de acción y habilidades.</p></div>
            <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <PathCard title="Empleo inicial" text="Vacantes para comenzar tu experiencia profesional." />
              <PathCard title="Becariado" text="Aprendizaje práctico mientras continúas tus estudios." />
              <PathCard title="Prácticas" text="Participación en proyectos y equipos de trabajo." />
              <PathCard title="Servicio social" text="Oportunidades con requisitos específicos de programa." />
            </div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container-page grid items-center gap-12 rounded-2xl bg-brand-gold-soft px-6 py-10 sm:px-10 lg:grid-cols-[1fr_auto] lg:px-14">
            <div><p className="text-sm font-bold uppercase tracking-[0.12em] text-[#765600]">Para organizaciones</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.035em] text-brand-navy">Conecta tus oportunidades con talento universitario</h2><p className="mt-4 max-w-2xl text-slate-600">Registra tu empresa, completa el proceso de revisión y administra ofertas y postulaciones desde un mismo panel.</p></div>
            <Link href="/planes" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-navy px-6 py-3.5 text-sm font-semibold text-white hover:bg-brand-navy-light">Conocer planes <ArrowUpRight size={17} /></Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}

function PreviewOffer({ icon: Icon, type, title, detail }) {
  return <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.07] p-3.5"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-gold/15 text-brand-gold"><Icon size={19} /></span><span className="min-w-0 flex-1"><span className="block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-brand-gold">{type}</span><span className="block truncate text-sm font-semibold text-white">{title}</span><span className="block truncate text-xs text-slate-400">{detail}</span></span></div>;
}

function TrustPoint({ icon: Icon, title, text }) {
  return <div className="flex gap-4 p-2"><span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-navy/7 text-brand-navy"><Icon size={21} /></span><span><span className="block font-semibold text-brand-navy">{title}</span><span className="block text-sm leading-6 text-slate-500">{text}</span></span></div>;
}

function PathCard({ title, text }) {
  return <article className="group rounded-xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-gold/50 hover:shadow-lg"><div className="mb-6 h-1.5 w-10 rounded-full bg-brand-gold transition-all group-hover:w-16" /><h3 className="text-lg font-semibold text-brand-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p><Link href="/ofertas" className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-navy">Explorar <ArrowUpRight size={16} /></Link></article>;
}
