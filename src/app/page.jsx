import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  ClipboardCheck,
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

const stats = [
  {
    value: "4",
    title: "Tipos de oportunidades",
    note: "Empleo, becariado, prácticas y servicio social",
  },
  {
    value: "10",
    title: "Ofertas en el plan gratuito",
    note: "Capacidad simultánea para empresas aprobadas",
  },
  {
    value: "$0",
    title: "Acceso para estudiantes",
    note: "Explorar, postularse y dar seguimiento",
  },
];

const steps = [
  {
    number: "01",
    icon: FileSearch,
    title: "Buscar",
    description:
      "Consulta oportunidades y utiliza los filtros por tipo, eje de acción, modalidad y habilidades para encontrar opciones relacionadas con tus intereses.",
    footnote: "Ofertas organizadas en un solo catálogo",
    footIcon: Search,
  },
  {
    number: "02",
    icon: Send,
    title: "Postularte",
    description:
      "Completa tu perfil, carga tu CV vigente y envía tu solicitud a las ofertas que te interesen.",
    footnote: "Tu perfil y CV siempre actualizados",
    footIcon: BookOpenCheck,
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Dar seguimiento",
    description:
      "Revisa el estado de tus postulaciones y recibe avisos cuando haya novedades en tus solicitudes.",
    footnote: "Información desde tu propio panel",
    footIcon: ClipboardCheck,
  },
];

const pillars = [
  {
    icon: ShieldCheck,
    title: "Empresas revisadas",
    text: "Las empresas deben recibir aprobación administrativa antes de publicar oportunidades.",
  },
  {
    icon: Handshake,
    title: "Vinculación transparente",
    text: "Ofertas, ciclos y postulaciones se organizan para dar seguimiento a cada proceso.",
  },
  {
    icon: GraduationCap,
    title: "Acceso estudiantil gratuito",
    text: "El registro, la búsqueda de ofertas y las postulaciones no tienen costo para estudiantes.",
  },
];

const audiences = [
  {
    icon: GraduationCap,
    tag: "Estudiantes",
    title: "Da tus primeros pasos profesionales",
    text: "Encuentra opciones de empleo inicial, becariado, prácticas profesionales y servicio social.",
    href: "/ofertas",
    link: "Explorar oportunidades",
  },
  {
    icon: Building2,
    tag: "Empresas",
    title: "Conecta con talento universitario",
    text: "Una vez aprobada tu empresa, administra ofertas, plazas y candidaturas desde un solo lugar.",
    href: "/registro/empresa",
    link: "Registrar empresa",
  },
  {
    icon: ClipboardCheck,
    tag: "Seguimiento",
    title: "Consulta cada etapa del proceso",
    text: "Los estados de postulación y las notificaciones ayudan a mantener el proceso organizado.",
    href: "/ingresar",
    link: "Acceder a mi cuenta",
  },
];

export default function HomePage() {
  return (
    <>
      <PublicHeader />
      <main id="contenido-principal">
        {/* La composición sigue Stitch. Los indicadores son reglas del producto, no cifras inventadas. */}
        <section className="relative isolate overflow-hidden bg-brand-navy-dark text-white" aria-labelledby="home-title">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_-20%,rgba(60,106,157,0.32),transparent_58%)]"
          />
          <div className="container-page flex flex-col items-center pb-14 pt-14 text-center sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
            <span className="inline-flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[0.7rem] font-semibold leading-4 text-slate-100 sm:px-4 sm:text-xs">
              <Sparkles size={15} className="shrink-0 text-brand-gold" aria-hidden="true" />
              Un puente entre talento universitario y oportunidades
            </span>

            <h1
              id="home-title"
              className="mt-6 max-w-[900px] text-[clamp(2.15rem,5.4vw,4.25rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-white"
            >
              Despega tu carrera profesional en <span className="text-[#e6bb5b]">ingeniería</span>
            </h1>
            <p className="mt-5 max-w-[720px] text-sm leading-7 text-slate-200 sm:text-base sm:leading-8">
              Explora prácticas profesionales, becariado, servicio social y empleo inicial.
              Conectamos a estudiantes activos de la UNAM con empresas que buscan talento universitario.
            </p>

            <form
              action="/ofertas"
              method="get"
              role="search"
              aria-label="Buscar oportunidades"
              className="mt-9 w-full max-w-[1050px] rounded-[1.25rem] border border-white/20 bg-white p-3 text-left text-slate-900 shadow-[0_24px_65px_rgba(0,0,0,0.23)] sm:mt-11 sm:p-4"
            >
              <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_auto] lg:items-center">
                <label className="relative block min-w-0">
                  <span className="mb-1 block pl-1 text-[0.65rem] font-bold uppercase tracking-[0.09em] text-slate-500">
                    Rol o competencia
                  </span>
                  <Search
                    size={18}
                    className="pointer-events-none absolute bottom-3 left-3.5 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    name="q"
                    type="search"
                    placeholder="Ej. Python, mecatrónica, QA..."
                    className="ui-control h-12 min-w-0 pl-11 text-sm"
                  />
                </label>
                <label className="block min-w-0">
                  <span className="mb-1 block pl-1 text-[0.65rem] font-bold uppercase tracking-[0.09em] text-slate-500">
                    Eje de acción
                  </span>
                  <select name="axis" defaultValue="" className="ui-control select-chevron h-12 min-w-0 pr-10 text-sm">
                    <option value="">Todos los ejes</option>
                    <option value="Ciencia y tecnología">Ciencia y tecnología</option>
                    <option value="Industria y energía">Industria y energía</option>
                    <option value="Salud y biotecnología">Salud y biotecnología</option>
                    <option value="Educación e impacto social">Educación e impacto social</option>
                    <option value="Sustentabilidad y movilidad">Sustentabilidad y movilidad</option>
                  </select>
                </label>
                <button
                  type="submit"
                  className="inline-flex h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white transition-colors hover:bg-brand-navy-light lg:mt-5 lg:w-auto"
                >
                  <Search size={17} aria-hidden="true" /> Explorar ofertas
                </button>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-2 border-t border-slate-100 pt-3.5 text-[0.72rem] sm:gap-x-3 sm:text-xs">
                <span className="font-semibold text-slate-500">Búsquedas sugeridas:</span>
                {['Prácticas profesionales', 'Servicio social', 'Desarrollo web', 'Automatización'].map((query) => (
                  <span key={query} className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-600">
                    {query}
                  </span>
                ))}
              </div>
            </form>

            <div className="mt-5 grid w-full max-w-[1050px] grid-cols-1 gap-3 sm:mt-7 sm:grid-cols-3 sm:gap-4">
              {stats.map((stat) => (
                <article key={stat.title} className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-white/15 bg-[#f7f9fd] px-4 py-5 text-brand-navy shadow-[0_8px_18px_rgba(0,0,0,0.08)] sm:min-h-[128px] sm:py-6">
                  <p className="text-3xl font-extrabold leading-none tracking-[-0.045em] sm:text-4xl">{stat.value}</p>
                  <h2 className="mt-2 text-sm font-bold">{stat.title}</h2>
                  <p className="mt-1 max-w-[240px] text-xs leading-5 text-slate-600">{stat.note}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#f1f2fc] py-16 sm:py-20 lg:py-24" aria-labelledby="steps-title">
          <div className="container-page">
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
              <div>
                <SectionLabel>Un proceso a tu alcance</SectionLabel>
                <h2 id="steps-title" className="ui-heading mt-3 max-w-[550px] text-3xl sm:text-4xl lg:text-[2.65rem]">
                  Vinculación ágil en 3 sencillos pasos
                </h2>
              </div>
              <p className="max-w-xl text-sm leading-7 text-slate-600 lg:justify-self-end">
                Organizamos el proceso de búsqueda y postulación para que puedas concentrarte
                en encontrar oportunidades relacionadas con tus intereses.
              </p>
            </div>
            <div className="mt-9 grid gap-4 md:grid-cols-3 md:gap-5 lg:mt-12">
              {steps.map((step) => (
                <StepCard key={step.number} {...step} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#fbfbff] py-16 sm:py-20 lg:py-24" aria-labelledby="business-title">
          <div className="container-page">
            <div className="grid items-center gap-9 overflow-hidden rounded-[1.5rem] bg-brand-navy-dark px-5 py-8 text-white shadow-[0_18px_42px_rgba(0,22,49,0.15)] sm:px-9 sm:py-10 lg:grid-cols-[1.25fr_0.8fr] lg:gap-14 lg:px-14 lg:py-14">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200">
                  <BriefcaseBusiness size={15} className="text-brand-gold" aria-hidden="true" />
                  Para empresas e instituciones
                </span>
                <h2 id="business-title" className="mt-5 max-w-[680px] text-3xl font-extrabold leading-[1.12] tracking-[-0.04em] sm:text-4xl">
                  Encuentra el talento técnico joven que tu equipo necesita
                </h2>
                <p className="mt-4 max-w-[660px] text-sm leading-7 text-slate-200 sm:text-base">
                  Conecta con estudiantes de ingeniería, administra oportunidades y consulta
                  postulaciones desde un mismo espacio, después de la aprobación de tu empresa.
                </p>
                <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-xs font-medium text-slate-200">
                  <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#e6bb5b]" /> Ofertas y postulaciones</span>
                  <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#e6bb5b]" /> Planes para empresas</span>
                  <span className="inline-flex items-center gap-2"><CheckCircle2 size={16} className="text-[#e6bb5b]" /> Estadísticas disponibles</span>
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Link href="/registro/empresa" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#e6b958] px-6 py-3 text-sm font-bold text-brand-navy-dark transition hover:bg-[#f3cc76]">
                    Registrar empresa <ArrowRight size={17} aria-hidden="true" />
                  </Link>
                  <Link href="/planes" className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
                    Conocer planes empresariales
                  </Link>
                </div>
              </div>
              <div role="group" className="mx-auto w-full max-w-[385px] rounded-[1.25rem] bg-white p-4 text-slate-900 shadow-[0_20px_35px_rgba(0,0,0,0.22)] sm:p-5 lg:justify-self-end" aria-label="Ejemplo ilustrativo de herramientas empresariales">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                  <div>
                    <p className="text-[0.65rem] font-extrabold uppercase tracking-wider text-[#9b721e]">Gestión empresarial</p>
                    <h3 className="mt-1 text-base font-extrabold text-brand-navy">Tu panel, en un solo lugar</h3>
                  </div>
                  <span className="rounded-full bg-[#edf3ff] px-2.5 py-1 text-[0.68rem] font-semibold text-brand-navy">Vista ilustrativa</span>
                </div>
                <div className="mt-4 space-y-2.5">
                  <MiniFeature icon={BriefcaseBusiness} label="Mis ofertas" value="Publicar y administrar" />
                  <MiniFeature icon={UsersRound} label="Candidaturas" value="Seguimiento por ciclo" />
                  <MiniFeature icon={BarChart3} label="Estadísticas" value="Disponibles en todos los planes" />
                </div>
                <p className="mt-4 rounded-lg bg-[#f1f2fc] px-3 py-2.5 text-center text-[0.72rem] font-semibold leading-5 text-brand-navy">
                  La publicación requiere aprobación administrativa
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#fafaff] py-16 sm:py-20 lg:py-24" aria-labelledby="about-title">
          <div className="container-page text-center">
            <SectionLabel>Quiénes somos</SectionLabel>
            <h2 id="about-title" className="ui-heading mx-auto mt-3 max-w-[780px] text-3xl sm:text-4xl lg:text-[2.6rem]">
              Impulsando la alianza estratégica entre academia e industria
            </h2>
            <p className="mx-auto mt-4 max-w-[780px] text-sm leading-7 text-slate-600">
              ConectU busca acercar oportunidades profesionales a estudiantes activos de la UNAM
              y ayudar a las empresas a encontrar talento. Somos una plataforma independiente, no un sitio oficial de la Universidad.
            </p>
            <div className="mt-10 grid gap-4 text-left md:grid-cols-3 md:gap-5">
              {pillars.map((pillar) => (
                <Pillar key={pillar.title} {...pillar} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200/80 bg-[#fafaff] py-16 sm:py-20 lg:py-24" aria-labelledby="audiences-title">
          <div className="container-page">
            <div className="text-center">
              <SectionLabel>Una plataforma para conectar</SectionLabel>
              <h2 id="audiences-title" className="ui-heading mx-auto mt-3 max-w-[760px] text-3xl sm:text-4xl lg:text-[2.6rem]">
                Oportunidades y seguimiento en un mismo espacio
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
                Estas son algunas de las posibilidades que contempla la plataforma.
                Conoce cómo cada perfil podrá aprovechar las herramientas de ConectU.
              </p>
            </div>
            <div className="mt-10 grid gap-4 md:grid-cols-3 md:gap-5">
              {audiences.map((audience) => (
                <AudienceCard key={audience.tag} {...audience} />
              ))}
            </div>

            <div className="mt-12 rounded-[1.5rem] bg-[#f0f1fd] px-5 py-10 text-center sm:px-10 sm:py-12">
              <h3 className="ui-heading mx-auto max-w-2xl text-2xl sm:text-[1.85rem]">
                ¿Listo para dar el siguiente paso profesional?
              </h3>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-600">
                Crea tu perfil, explora oportunidades y consulta tus postulaciones desde tu cuenta.
              </p>
              <div className="mt-7 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link href="/registro/estudiante" className="ui-button-primary min-h-12 px-6">
                  Crear cuenta como estudiante
                </Link>
                <Link href="/ofertas" className="ui-button-secondary min-h-12 px-6">
                  Ver todas las ofertas
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="inline-flex items-center justify-center gap-2 text-[0.7rem] font-extrabold uppercase tracking-[0.14em] text-[#8a661d]">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
      {children}
    </p>
  );
}

function StepCard({ number, icon: Icon, title, description, footnote, footIcon: FootIcon }) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_7px_26px_rgba(20,43,73,0.045)] sm:p-7">
      <div className="flex items-center justify-between">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-[#f0f1fd] text-brand-navy">
          <Icon size={23} aria-hidden="true" />
        </span>
        <span className="text-2xl font-extrabold tracking-tight text-[#c8d2ee]" aria-hidden="true">{number}</span>
      </div>
      <h3 className="mt-8 text-xl font-bold tracking-tight text-brand-navy">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{description}</p>
      <p className="mt-8 flex items-center gap-2 rounded-lg bg-[#f7f8fc] px-3 py-3 text-xs font-medium leading-5 text-slate-600">
        <FootIcon size={15} className="shrink-0 text-brand-gold-dark" aria-hidden="true" />
        {footnote}
      </p>
    </article>
  );
}

function MiniFeature({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-100 bg-[#f8fafc] p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-navy text-[#e6bb5b]">
        <Icon size={18} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-brand-navy">{label}</p>
        <p className="text-xs leading-5 text-slate-500">{value}</p>
      </div>
      <CheckCircle2 size={17} className="shrink-0 text-[#a98228]" aria-hidden="true" />
    </div>
  );
}

function Pillar({ icon: Icon, title, text }) {
  return (
    <article className="min-w-0 rounded-2xl bg-[#f1f3fc] p-6 sm:p-7">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-navy-dark text-[#e6bb5b]">
        <Icon size={22} aria-hidden="true" />
      </span>
      <h3 className="mt-6 text-base font-extrabold text-brand-navy">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
    </article>
  );
}

function AudienceCard({ icon: Icon, tag, title, text, href, link }) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_7px_30px_rgba(20,43,73,0.055)] sm:p-7">
      <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#f1f2fc] text-brand-navy">
        <Icon size={21} aria-hidden="true" />
      </span>
      <p className="mt-5 text-[0.7rem] font-extrabold uppercase tracking-[0.13em] text-[#8a661d]">{tag}</p>
      <h3 className="mt-2 text-lg font-bold tracking-tight text-brand-navy">{title}</h3>
      <p className="mt-3 flex-1 text-sm leading-7 text-slate-600">{text}</p>
      <Link href={href} className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-bold text-brand-navy underline-offset-4 transition hover:underline">
        {link} <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </article>
  );
}
