import Link from "next/link";
import {
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileSearch,
  GraduationCap,
  Handshake,
  Search,
  Send,
  ShieldCheck,
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
          <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl" />
          <div className="container-page relative flex min-h-[500px] flex-col items-center justify-center py-16 text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 text-xs font-medium text-slate-200">
              <Sparkles size={14} className="text-brand-gold" /> Un puente entre talento universitario y organizaciones
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.35rem]">
              Despega tu carrera profesional desde la <span className="text-[#e8c464]">universidad</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300">
              Encuentra prácticas, servicio social, becariados y oportunidades de empleo inicial en un catálogo pensado para estudiantes activos.
            </p>
            <form action="/ofertas" className="mt-8 grid w-full max-w-4xl gap-2 rounded-xl bg-white p-2.5 text-left shadow-2xl md:grid-cols-[1fr_0.75fr_auto]">
              <label className="relative border-slate-200 md:border-r">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <span className="sr-only">Rol o competencia</span>
                <input name="q" className="h-12 w-full rounded-lg bg-transparent pl-10 pr-4 text-sm text-slate-900 outline-none" placeholder="Puesto, competencia o empresa" />
              </label>
              <label>
                <span className="sr-only">Especialidad</span>
                <select name="axis" className="select-chevron h-12 w-full rounded-lg border-0 bg-slate-50 px-4 text-sm text-slate-700 outline-none"><option>Todos los ejes de acción</option><option>Ciencia y tecnología</option><option>Industria y energía</option></select>
              </label>
              <button className="h-12 rounded-lg bg-brand-navy px-6 text-sm font-bold text-white transition hover:bg-brand-navy-light">Explorar ofertas</button>
            </form>
            <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-400">
              <span>Búsquedas sugeridas</span><span>Prácticas profesionales</span><span>Servicio social</span><span>Becariado</span><span>Desarrollo web</span>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white">
          <div className="container-page grid gap-3 py-4 sm:grid-cols-3">
            <TrustStat value="4" label="tipos de oportunidad" />
            <TrustStat value="1" label="CV vigente por estudiante" />
            <TrustStat value="$0" label="para estudiantes" />
          </div>
        </section>

        <section className="bg-page py-20">
          <div className="container-page">
            <div className="grid gap-7 lg:grid-cols-[1fr_0.9fr] lg:items-end">
              <div><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6a1c]">Un proceso claro</p><h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em] text-brand-navy sm:text-4xl">Vinculación ágil en tres sencillos pasos</h2></div>
              <p className="max-w-xl text-sm leading-6 text-slate-600 lg:justify-self-end">Organiza tu perfil, consulta oportunidades relacionadas con tus intereses y revisa el avance de cada postulación desde un mismo espacio.</p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <StepCard icon={FileSearch} title="Buscar" text="Filtra el catálogo por tipo, eje de acción, modalidad y habilidades." />
              <StepCard icon={Send} title="Postularte" text="Utiliza la información de tu perfil y tu único CV vigente." />
              <StepCard icon={BarChart3} title="Dar seguimiento" text="Consulta cambios de estado y actividad reciente desde tu panel." />
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container-page grid gap-8 overflow-hidden rounded-2xl bg-brand-navy-dark px-7 py-9 text-white shadow-xl lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-11">
            <div><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200"><Building2 size={14} /> Para empresas e instituciones</span><h2 className="mt-5 max-w-xl text-3xl font-bold leading-tight tracking-[-0.04em]">Encuentra el talento técnico joven que tu equipo necesita</h2><p className="mt-4 max-w-xl text-sm leading-6 text-slate-300">Publica oportunidades después de la aprobación administrativa y gestiona candidaturas desde un panel empresarial compartido.</p><div className="mt-7 flex flex-wrap gap-3"><Link href="/registro" className="rounded-lg bg-brand-gold px-5 py-3 text-sm font-bold text-brand-navy-dark">Registrar empresa</Link><Link href="/planes" className="rounded-lg border border-white/25 px-5 py-3 text-sm font-semibold text-white">Conocer planes</Link></div></div>
            <div className="rounded-xl border border-white/10 bg-white/[0.07] p-5"><p className="text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold">Panel empresarial</p><div className="mt-4 space-y-3"><CompanyMetric icon={BriefcaseBusiness} label="Ofertas activas" value="Capacidad según el plan" /><CompanyMetric icon={UsersRound} label="Postulaciones" value="Gestión por ciclo" /><CompanyMetric icon={BarChart3} label="Estadísticas" value="Disponibles en todos los planes" /></div></div>
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="container-page text-center"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6a1c]">Quiénes somos</p><h2 className="mx-auto mt-3 max-w-3xl text-3xl font-bold tracking-[-0.04em] text-brand-navy sm:text-4xl">Impulsando la alianza entre comunidad universitaria y empresas</h2><p className="mx-auto mt-4 max-w-3xl text-sm leading-6 text-slate-600">La plataforma facilita el encuentro y la gestión de oportunidades. El reconocimiento académico o institucional depende de los requisitos aplicables a cada caso.</p><div className="mt-10 grid gap-4 text-left md:grid-cols-3"><Pillar icon={ShieldCheck} title="Empresas revisadas" text="La publicación se habilita después de la aprobación administrativa." /><Pillar icon={Handshake} title="Vinculación transparente" text="Los estados, ciclos y plazas conservan un seguimiento claro." /><Pillar icon={GraduationCap} title="Acceso estudiantil gratuito" text="Consultar ofertas y postularse no tiene costo para estudiantes." /></div></div>
        </section>

        <section className="border-t border-slate-200 bg-page py-20">
          <div className="container-page text-center"><p className="text-xs font-bold uppercase tracking-[0.14em] text-[#8a6a1c]">Historias de la comunidad</p><h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-brand-navy">Experiencias que podrán compartirse aquí</h2><p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-600">Las historias reales se incorporarán cuando exista contenido autorizado para publicación.</p><div className="mt-10 grid gap-4 text-left md:grid-cols-3">{["Estudiante", "Empresa", "Programa universitario"].map((type) => <article key={type} className="rounded-xl border border-slate-200 bg-white p-6"><div className="flex gap-1 text-brand-gold">★★★★★</div><p className="mt-5 text-sm leading-6 text-slate-500">Espacio reservado para una experiencia real y verificable de la comunidad.</p><div className="mt-6 border-t border-slate-100 pt-4"><p className="font-semibold text-brand-navy">Contenido pendiente</p><p className="text-xs text-slate-500">{type}</p></div></article>)}</div><div className="mt-12 rounded-2xl bg-[#f0efff] px-6 py-10"><h2 className="text-2xl font-bold text-brand-navy">¿Listo para dar el siguiente paso profesional?</h2><p className="mt-2 text-sm text-slate-600">Crea tu perfil para explorar y dar seguimiento a tus oportunidades.</p><div className="mt-6 flex flex-wrap justify-center gap-3"><Link href="/registro" className="rounded-lg bg-brand-navy px-5 py-3 text-sm font-semibold text-white">Crear cuenta</Link><Link href="/ofertas" className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-brand-navy">Ver ofertas</Link></div></div></div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}

function TrustStat({ value, label }) { return <div className="flex items-center justify-center gap-3 px-4 py-2 text-center"><span className="text-2xl font-bold tracking-[-0.04em] text-brand-navy">{value}</span><span className="max-w-28 text-xs leading-4 text-slate-500">{label}</span></div>; }
function StepCard({ icon: Icon, title, text }) { return <article className="rounded-xl border border-slate-200 bg-white p-6"><span className="grid h-10 w-10 place-items-center rounded-lg bg-[#eef0ff] text-brand-navy"><Icon size={19} /></span><h3 className="mt-7 text-lg font-bold text-brand-navy">{title}</h3><p className="mt-3 text-sm leading-6 text-slate-600">{text}</p><div className="mt-7 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-medium text-slate-500"><CheckCircle2 size={15} className="text-brand-gold" /> Flujo integrado en la plataforma</div></article>; }
function CompanyMetric({ icon: Icon, label, value }) { return <div className="flex items-center gap-3 rounded-lg bg-white p-3 text-brand-navy"><span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-navy text-brand-gold"><Icon size={17} /></span><span><span className="block text-sm font-semibold">{label}</span><span className="block text-xs text-slate-500">{value}</span></span></div>; }
function Pillar({ icon: Icon, title, text }) { return <article className="rounded-xl bg-page p-6"><span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-navy text-brand-gold"><Icon size={19} /></span><h3 className="mt-5 font-bold text-brand-navy">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{text}</p></article>; }
