"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  Briefcase,
  Building2,
  Check,
  Code2,
  Compass,
  Cpu,
  Eye,
  FileText,
  Filter,
  MapPin,
  Radio,
  Search,
  ShieldCheck,
  TrendingUp,
  Truck,
  Users,
  Wrench,
  X,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { Modal } from "@/components/dashboard-ui";

const initialApplications = [
  {
    id: "1",
    code: "#ENG-9042",
    title: "Ingeniería trainee de software",
    badgeNote: "Bolsa Prioritaria",
    company: "Empresa tecnológica demostrativa",
    companySub: "Sede CDMX · Hub Tech",
    type: "Empleo",
    mode: "Híbrida",
    locationDetail: "Ciudad de México (Corredor Tecnológico)",
    vacancies: "3 plazas abiertas",
    stipend: "$14,500 MXN / mes neto",
    stipendExtra: "+ Seguro facultativo y prestaciones",
    companyDescription:
      "Empresa especializada en desarrollo de soluciones tecnológicas y sistemas escalables con vinculación directa institucional. Ofrece acompañamiento técnico, plan de crecimiento y proyectos de alto impacto.",
    techStack: "JavaScript / TypeScript, React, Next.js, Node.js, SQL, Git.",
    universityValidation:
      "Convocatoria alineada con programas de vinculación académica vigentes.",
    date: "12 oct 2026",
    time: "14:32 hrs CST",
    priority: "Alta Institucional",
    status: "En revisión",
    tone: "amber",
    icon: Cpu,
    currentStep: 3,
    totalSteps: 4,
    timeline: [
      {
        step: 1,
        title: "Postulación enviada",
        detail: "Solicitud registrada con expediente y CV vigente.",
        date: "12 Oct · 14:32 hrs",
        state: "done",
      },
      {
        step: 2,
        title: "Recepción y validación en empresa",
        detail: "Expediente revisado por el equipo de Talento y Vinculación.",
        date: "13 Oct · 09:15 hrs",
        state: "done",
      },
      {
        step: 3,
        title: "En revisión técnica",
        detail: "Evaluación del perfil por el equipo responsable. Tiempo estimado: 3 a 5 días hábiles.",
        date: "15 Oct · 11:00 hrs",
        state: "current",
      },
      {
        step: 4,
        title: "Resolución final",
        detail: "Dictamen de avance o asignación de plaza.",
        date: "Pendiente",
        state: "pending",
      },
    ],
  },
  {
    id: "2",
    code: "#ENG-8821",
    title: "Practicante de análisis de datos",
    badgeNote: "Analítica y Datos",
    company: "Organización demostrativa",
    companySub: "Centro Operativo",
    type: "Prácticas",
    mode: "Remota",
    locationDetail: "Modalidad remota · México",
    vacancies: "2 plazas abiertas",
    stipend: "$11,000 MXN / mes",
    stipendExtra: "+ Apoyo para conectividad",
    companyDescription:
      "Organización enfocada en inteligencia operativa y toma de decisiones basada en datos. Brinda mentoría continua y participación en tableros y automatización de reportes.",
    techStack: "Python, SQL, Excel avanzado, Power BI, Git.",
    universityValidation:
      "Convocatoria acreditada para prácticas profesionales.",
    date: "8 oct 2026",
    time: "10:20 hrs CST",
    priority: "Alta Institucional",
    status: "Aceptada",
    tone: "green",
    icon: Wrench,
    currentStep: 4,
    totalSteps: 4,
    timeline: [
      {
        step: 1,
        title: "Postulación enviada",
        detail: "Solicitud registrada con CV vigente.",
        date: "08 Oct · 10:20 hrs",
        state: "done",
      },
      {
        step: 2,
        title: "Recepción y validación en empresa",
        detail: "Perfil validado por el área de selección.",
        date: "09 Oct · 16:00 hrs",
        state: "done",
      },
      {
        step: 3,
        title: "Evaluación completada",
        detail: "Entrevista y revisión de perfil concluidas satisfactoriamente.",
        date: "10 Oct · 12:45 hrs",
        state: "done",
      },
      {
        step: 4,
        title: "Aceptada",
        detail: "Oferta lista para formalización de convenio.",
        date: "11 Oct · 09:00 hrs",
        state: "current",
      },
    ],
  },
  {
    id: "3",
    code: "#ENG-9104",
    title: "Desarrollo frontend inicial",
    badgeNote: "Interfaces Web",
    company: "Estudio digital demostrativo",
    companySub: "Remoto / Híbrido",
    type: "Becariado",
    mode: "Presencial",
    locationDetail: "Ciudad de México · Zona Sur",
    vacancies: "2 plazas abiertas",
    stipend: "$9,500 MXN / mes",
    stipendExtra: "+ Capacitación en diseño y frontend",
    companyDescription:
      "Estudio digital dedicado al diseño y desarrollo de productos web modernos. Ideal para perfiles en formación que buscan construir interfaces limpias y accesibles.",
    techStack: "HTML, CSS / Tailwind CSS, React, JavaScript, Figma.",
    universityValidation:
      "Programa de becariado con seguimiento de vinculación.",
    date: "2 oct 2026",
    time: "17:05 hrs CST",
    priority: "Estándar",
    status: "Enviada",
    tone: "blue",
    icon: Radio,
    currentStep: 1,
    totalSteps: 4,
    timeline: [
      {
        step: 1,
        title: "Postulación enviada",
        detail: "Solicitud registrada con firma y CV vigente.",
        date: "02 Oct · 17:05 hrs",
        state: "current",
      },
      {
        step: 2,
        title: "Recepción y validación en empresa",
        detail: "En espera de revisión inicial por el equipo reclutador.",
        date: "Pendiente",
        state: "pending",
      },
      {
        step: 3,
        title: "Revisión técnica",
        detail: "Evaluación de conocimientos y portafolio.",
        date: "Pendiente",
        state: "pending",
      },
      {
        step: 4,
        title: "Resolución final",
        detail: "Dictamen de la convocatoria.",
        date: "Pendiente",
        state: "pending",
      },
    ],
  },
  {
    id: "4",
    code: "#SOC-1029",
    title: "Servicio social en investigación",
    badgeNote: "Vinculación Académica",
    company: "Centro demostrativo",
    companySub: "Campus Principal",
    type: "Servicio social",
    mode: "Híbrida",
    locationDetail: "Ciudad Universitaria · CDMX",
    vacancies: "4 plazas abiertas",
    stipend: "Liberación de Servicio Social",
    stipendExtra: "+ Constancia institucional al concluir",
    companyDescription:
      "Centro de investigación aplicado enfocado en proyectos interdisciplinarios, documentación técnica y desarrollo de herramientas de apoyo académico.",
    techStack: "Python, documentación técnica, análisis de información, Git.",
    universityValidation:
      "Registro válido para cobertura de horas de Servicio Social.",
    date: "27 sep 2026",
    time: "11:40 hrs CST",
    priority: "Institucional",
    status: "Rechazada",
    tone: "red",
    icon: Truck,
    currentStep: 3,
    totalSteps: 4,
    timeline: [
      {
        step: 1,
        title: "Postulación enviada",
        detail: "Solicitud registrada en el sistema.",
        date: "27 Sep · 11:40 hrs",
        state: "done",
      },
      {
        step: 2,
        title: "Recepción en el centro",
        detail: "Expediente recibido para asignación de cupo.",
        date: "29 Sep · 13:10 hrs",
        state: "done",
      },
      {
        step: 3,
        title: "Rechazada",
        detail: "Cupo completo para el periodo solicitado. Tu historial se conserva.",
        date: "01 Oct · 15:00 hrs",
        state: "current",
      },
      {
        step: 4,
        title: "Cierre de registro",
        detail: "Proceso concluido.",
        date: "01 Oct",
        state: "pending",
      },
    ],
  },
  {
    id: "5",
    code: "#AER-4091",
    title: "Beca de diseño y prototipado",
    badgeNote: "Retirada por el alumno",
    company: "Laboratorio demostrativo",
    companySub: "CDMX",
    type: "Becariado",
    mode: "Remota",
    locationDetail: "Remoto · CDMX",
    vacancies: "1 plaza abierta",
    stipend: "$10,000 MXN / mes",
    stipendExtra: "+ Materiales de prototipado",
    companyDescription:
      "Laboratorio de innovación enfocada en prototipado rápido, pruebas de concepto y diseño de sistemas digitales.",
    techStack: "Prototipado, diseño de interfaces, documentación, Git.",
    universityValidation:
      "Convocatoria de vinculación con seguimiento académico.",
    date: "14 sep 2026",
    time: "09:50 hrs CST",
    priority: "Estándar",
    status: "Retirada",
    tone: "slate",
    icon: Compass,
    currentStep: 2,
    totalSteps: 4,
    timeline: [
      {
        step: 1,
        title: "Postulación enviada",
        detail: "Solicitud registrada con CV vigente.",
        date: "14 Sep · 09:50 hrs",
        state: "done",
      },
      {
        step: 2,
        title: "Retirada",
        detail: "Postulación retirada por decisión del estudiante.",
        date: "16 Sep · 18:10 hrs",
        state: "current",
      },
      {
        step: 3,
        title: "Revisión",
        detail: "No aplica.",
        date: "—",
        state: "pending",
      },
      {
        step: 4,
        title: "Resolución",
        detail: "Concluida.",
        date: "—",
        state: "pending",
      },
    ],
  },
];

const statusFilters = [
  "Todas",
  "Enviada",
  "En revisión",
  "Aceptada",
  "Rechazada",
  "Retirada",
];

function StatusPill({ status, tone }) {
  const styles = {
    amber: "bg-amber-100/90 text-amber-800 border border-amber-200/80",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200/80",
    blue: "bg-[#eeefff] text-brand-navy border border-indigo-200/70",
    red: "bg-rose-50 text-rose-700 border border-rose-200/80",
    slate: "bg-slate-100 text-slate-600 border border-slate-200/80",
    navy: "bg-[#eeefff] text-brand-navy border border-indigo-200/70",
  };

  const dotColors = {
    amber: "bg-amber-500",
    green: "bg-emerald-600",
    blue: "bg-brand-navy",
    red: "bg-rose-600",
    slate: "bg-slate-400",
    navy: "bg-brand-navy",
  };

  const cls = styles[tone] || styles.slate;
  const dot = dotColors[tone] || dotColors.slate;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${cls}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

export default function StudentApplicationsPage() {
  const [applications, setApplications] = useState(initialApplications);
  const [selected, setSelected] = useState(null);
  const [activeStatus, setActiveStatus] = useState("Todas");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [sortOrder, setSortOrder] = useState("recientes");

  const statusCounts = useMemo(() => {
    const counts = {
      Todas: applications.length,
      Enviada: 0,
      "En revisión": 0,
      Aceptada: 0,
      Rechazada: 0,
      Retirada: 0,
    };
    for (const app of applications) {
      if (counts[app.status] !== undefined) {
        counts[app.status] += 1;
      }
    }
    return counts;
  }, [applications]);

  const filteredApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = applications.filter((item) => {
      const matchesStatus =
        activeStatus === "Todas" || item.status === activeStatus;
      const matchesType =
        selectedType === "Todos" || item.type === selectedType;
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.code.toLowerCase().includes(query) ||
        item.type.toLowerCase().includes(query);
      return matchesStatus && matchesType && matchesSearch;
    });

    if (sortOrder === "antiguas") {
      return [...list].reverse();
    }
    return list;
  }, [applications, activeStatus, searchQuery, selectedType, sortOrder]);

  return (
    <DashboardShell
      role="estudiante"
      title="Mis postulaciones"
      eyebrow="BOLSA UNIVERSITARIA · GESTIÓN DE CARRERAS"
      description="Supervisa el estado y avance de tus solicitudes en convocatorias que aplicaste."
    >
      {/* Barra superior de filtros por estado */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {statusFilters.map((st) => {
            const isSelected = activeStatus === st;
            return (
              <button
                key={st}
                type="button"
                onClick={() => setActiveStatus(st)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  isSelected
                    ? "bg-brand-navy text-white shadow-xs"
                    : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
                }`}
              >
                <span>{st}</span>
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[11px] ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {statusCounts[st]}
                </span>
              </button>
            );
          })}
        </div>

        <p className="text-xs text-slate-500">
          <span className="font-semibold text-slate-700">
            {filteredApplications.length}
          </span>{" "}
          registros visibles
        </p>
      </div>

      {/* Contenedor principal de búsqueda, filtros y tabla */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs">
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_200px_175px]">
          <div className="relative flex items-center">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 text-slate-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por puesto, folio o empresa..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
            />
          </div>

          <div className="relative flex items-center">
            <Filter
              size={14}
              className="pointer-events-none absolute left-3 text-slate-400"
            />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              aria-label="Filtrar por tipo de oferta"
              className="select-chevron w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-8 pr-8 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
            >
              <option value="Todos">Tipo: Todos</option>
              <option value="Empleo">Empleo</option>
              <option value="Prácticas">Prácticas</option>
              <option value="Becariado">Becariado</option>
              <option value="Servicio social">Servicio social</option>
            </select>
          </div>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            aria-label="Ordenar postulaciones"
            className="select-chevron rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 focus:border-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-navy/10"
          >
            <option value="recientes">Más recientes</option>
            <option value="antiguas">Más antiguas</option>
          </select>
        </div>

        {/* Vista de escritorio */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3.5">Puesto / convocatoria</th>
                <th className="px-4 py-3.5">Empresa</th>
                <th className="px-4 py-3.5">Modalidad</th>
                <th className="px-4 py-3.5">Fecha envío</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-4 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No se encontraron postulaciones con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredApplications.map((item) => {
                  const OfferIcon = item.icon || FileText;
                  return (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-slate-50/60"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-slate-200/80 bg-slate-50 text-brand-navy">
                            <OfferIcon size={17} />
                          </span>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900">
                              {item.title}
                            </p>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                              <span>ID: {item.code}</span>
                              <span>·</span>
                              <span className="font-medium text-brand-navy">
                                {item.badgeNote}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="font-semibold text-slate-800">
                          {item.company}
                        </p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.companySub}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-lg bg-[#eeefff] px-2.5 py-1 text-xs font-semibold text-brand-navy">
                          {item.mode}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-500">
                        {item.date}
                      </td>

                      <td className="px-4 py-4">
                        <StatusPill status={item.status} tone={item.tone} />
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelected(item)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-navy px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:opacity-90"
                        >
                          <Eye size={14} />
                          Ver detalle
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Vista móvil */}
        <div className="divide-y divide-slate-100 md:hidden">
          {filteredApplications.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">
              No se encontraron postulaciones con los filtros seleccionados.
            </p>
          ) : (
            filteredApplications.map((item) => {
              const OfferIcon = item.icon || FileText;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelected(item)}
                  className="w-full p-4 text-left transition hover:bg-slate-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-brand-navy">
                        <OfferIcon size={16} />
                      </span>
                      <div>
                        <p className="font-bold text-slate-900">{item.title}</p>
                        <p className="mt-0.5 text-xs text-slate-500">
                          {item.company}
                        </p>
                      </div>
                    </div>
                    <StatusPill status={item.status} tone={item.tone} />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span>{item.type}</span>
                    <span>·</span>
                    <span>{item.mode}</span>
                    <span>·</span>
                    <span>{item.date}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Pie de tabla */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 bg-slate-50/40 px-4 py-3 text-xs text-slate-500">
          <p>
            Mostrando{" "}
            <span className="font-semibold text-slate-700">
              {filteredApplications.length}
            </span>{" "}
            de{" "}
            <span className="font-semibold text-slate-700">
              {applications.length}
            </span>{" "}
            postulaciones registradas
          </p>
          <span className="rounded-md bg-brand-navy px-2.5 py-1 font-semibold text-white">
            1
          </span>
        </div>
      </section>

      {/* Modal estilo prototipo Stitch */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        size="xl"
      >
        {selected && (
          <div className="space-y-5">
            {/* Encabezado superior */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-start gap-3.5">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-navy text-white shadow-xs">
                  <Briefcase size={22} />
                </span>
                <div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-bold text-amber-600">
                      {selected.code}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600">
                      {selected.type}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                      <ShieldCheck size={13} className="text-emerald-600" />
                      Empresa Verificada
                    </span>
                  </div>

                  <h2 className="mt-1.5 text-xl font-bold text-slate-900 sm:text-2xl">
                    {selected.title}
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    <span className="font-bold text-brand-navy">
                      {selected.company}
                    </span>{" "}
                    • {selected.companySub}
                  </p>
                </div>
              </div>
            </div>

            {/* Fila 1: Estado de postulación y Fecha de envío */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Estado de postulación</span>
                  <span>Prioridad</span>
                </div>
                <div className="mt-2.5 flex items-center justify-between gap-2">
                  <StatusPill status={selected.status} tone={selected.tone} />
                  <span className="text-xs font-bold text-amber-600">
                    {selected.priority}
                  </span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-4">
                <div className="flex items-center justify-between gap-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Fecha de envío</span>
                  <span>Hora oficial</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between gap-2">
                  <span className="text-base font-bold text-slate-900">
                    {selected.date}
                  </span>
                  <span className="text-xs text-slate-500">{selected.time}</span>
                </div>
              </div>
            </div>

            {/* Fila 2: 3 tarjetas con íconos dorados */}
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200/90 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Users size={15} className="text-amber-500" />
                  <span>Vacantes disponibles</span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {selected.vacancies}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <MapPin size={15} className="text-amber-500" />
                  <span>Modalidad y ubicación</span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {selected.mode}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {selected.locationDetail}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200/90 bg-white p-4">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                  <Banknote size={15} className="text-amber-500" />
                  <span>Apoyo económico</span>
                </div>
                <p className="mt-2 text-sm font-bold text-slate-900">
                  {selected.stipend}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {selected.stipendExtra}
                </p>
              </div>
            </div>

            {/* Tarjeta Empresa Patrocinadora */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Building2 size={17} className="text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Empresa Patrocinadora: {selected.company}
                  </h3>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                  <ShieldCheck size={12} className="text-emerald-600" />
                  Convenio Marco Vigente
                </span>
              </div>

              <p className="mt-3 text-xs leading-relaxed text-slate-600 sm:text-sm">
                {selected.companyDescription}
              </p>

              <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <Code2 size={14} className="text-amber-500" />
                    <span>Tecnologías y requisitos clave</span>
                  </div>
                  <p className="mt-1.5 text-xs font-semibold text-slate-800">
                    {selected.techStack}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <ShieldCheck size={14} className="text-amber-500" />
                    <span>Validación universitaria</span>
                  </div>
                  <p className="mt-1.5 text-xs text-slate-600">
                    {selected.universityValidation}
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2.5 text-xs text-slate-600">
                <FileText size={15} className="shrink-0 text-slate-400" />
                <span>
                  La empresa consultará únicamente el CV único vigente vinculado a tu perfil institucional.
                </span>
              </div>
            </div>

            {/* Línea de Tiempo de Postulación */}
            <div className="rounded-xl border border-slate-200/90 bg-white p-5">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={17} className="text-amber-500" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Línea de Tiempo de Postulación
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  Paso {selected.currentStep} de {selected.totalSteps}
                </span>
              </div>

              <div className="mt-4 space-y-0">
                {(selected.timeline || []).map((stepItem, index) => {
                  const list = selected.timeline || [];
                  const isLast = index === list.length - 1;
                  const isDone = stepItem.state === "done";
                  const isCurrent = stepItem.state === "current";

                  return (
                    <div key={stepItem.step} className="flex gap-3.5">
                      <div className="flex flex-col items-center">
                        {isDone ? (
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-navy text-white">
                            <Check size={14} />
                          </span>
                        ) : isCurrent ? (
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-amber-400 bg-amber-50">
                            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                          </span>
                        ) : (
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-400">
                            {stepItem.step}
                          </span>
                        )}

                        {!isLast && (
                          <span
                            className={`my-1 w-0.5 flex-1 min-h-6 ${
                              isDone
                                ? "bg-brand-navy/30"
                                : isCurrent
                                ? "bg-amber-300"
                                : "bg-slate-200"
                            }`}
                          />
                        )}
                      </div>

                      <div className={`flex-1 ${isLast ? "pb-1" : "pb-4"}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 sm:text-sm">
                              {stepItem.step}. {stepItem.title}
                            </p>
                            {isCurrent && (
                              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                                Actual
                              </span>
                            )}
                          </div>
                          <span
                            className={`text-xs ${
                              isCurrent
                                ? "font-semibold text-amber-600"
                                : "text-slate-400"
                            }`}
                          >
                            {stepItem.date}
                          </span>
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">
                          {stepItem.detail}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Pie del modal con botón Cerrar azul marino */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-400">
                Convocatoria oficial · Seguimiento institucional
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="inline-flex items-center justify-center rounded-lg bg-brand-navy px-5 py-2 text-xs font-semibold text-white shadow-xs transition hover:opacity-90 sm:text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardShell>
  );
}