"use client";

import { Building2, ContactRound, FileText, MapPin, ShieldCheck } from "lucide-react";
import { Modal } from "@/components/dashboard-ui";

const states = {
  Pendiente: "border-amber-200 bg-amber-50 text-amber-800",
  Aprobada: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Rechazada: "border-rose-200 bg-rose-50 text-rose-700",
  Suspendida: "border-slate-200 bg-slate-100 text-slate-700",
};

function shown(value) {
  if (value === null || value === undefined || value === "") return "—";
  return String(value);
}

function DataField({ label, value, wide = false }) {
  return (
    <div className={`min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3.5 ${wide ? "sm:col-span-2" : ""}`}>
      <dt className="text-xs font-medium text-slate-500">{label}</dt>
      <dd className="mt-1.5 break-words text-sm font-semibold leading-6 text-brand-navy">
        {shown(value)}
      </dd>
    </div>
  );
}

function Section({ icon: Icon, title, description, children }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-[#f8fafc]">
      <div className="flex items-start gap-3 border-b border-slate-200 px-4 py-4 sm:px-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e9eefb] text-brand-navy">
          <Icon size={19} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h3 className="text-base font-bold text-brand-navy">{title}</h3>
          {description && <p className="mt-0.5 text-xs leading-5 text-slate-500">{description}</p>}
        </div>
      </div>
      <dl className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">{children}</dl>
    </section>
  );
}

// Modal exclusivo de Gestión de empresas. El dashboard conserva
// CompanyExpedientModal y su propio flujo de revisión.
export function CompanyDetailModal({ company, onClose }) {
  const status = company?.state;
  return (
    <Modal
      open={Boolean(company)}
      onClose={onClose}
      title="Información de la empresa"
      description="Consulta los datos del registro empresarial"
      size="xl"
      footer={
        <button
          type="button"
          onClick={onClose}
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light"
        >
          Cerrar
        </button>
      }
    >
      <div className="space-y-5 sm:space-y-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-start sm:p-5">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-[#e9eefb] text-brand-navy">
            <Building2 size={28} strokeWidth={1.8} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="break-words text-xl font-bold tracking-tight text-brand-navy">{shown(company?.nombre_comercial ?? company?.name)}</h3>
              {status && (
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${states[status] || states.Suspendida}`}>
                  {status}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm text-slate-500">{shown(company?.sector)} · {shown(company?.location ?? company?.ubicacion)}</p>
            {company?.descripcion && <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-6 text-slate-600">{company.descripcion}</p>}
          </div>
        </div>

        <Section icon={FileText} title="Datos fiscales y corporativos" description="Información proporcionada al registrar la organización">
          <DataField label="Razón social" value={company?.razon_social} wide />
          <DataField label="Nombre comercial" value={company?.nombre_comercial ?? company?.name} />
          <DataField label="RFC" value={company?.rfc} />
          <DataField label="Tipo de contribuyente" value={company?.tipo_contribuyente} />
          <DataField label="Sector o rama" value={company?.sector} />
          <DataField label="Tamaño de la organización" value={company?.tamano} />
          <DataField label="Sitio web" value={company?.sitio_web} />
          <DataField label="Descripción de la organización" value={company?.descripcion} wide />
        </Section>

        <div className="grid gap-5 lg:grid-cols-2">
          <Section icon={MapPin} title="Ubicación" description="Localización registrada por la empresa">
            <DataField label="Estado" value={company?.estado ?? company?.estado_ubicacion} />
            <DataField label="Ciudad o alcaldía" value={company?.ciudad} />
            <DataField label="Ubicación general" value={company?.location ?? company?.ubicacion} wide />
          </Section>

          <Section icon={ContactRound} title="Contacto responsable" description="Información de la cuenta empresarial">
            <DataField label="Nombre de contacto" value={company?.contacto} />
            <DataField label="Cargo" value={company?.cargo} />
            <DataField label="Teléfono" value={company?.telefono} />
            <DataField label="Correo empresarial" value={company?.correo} />
          </Section>
        </div>

        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-[#f4f6fb] px-4 py-3.5">
          <ShieldCheck size={19} className="mt-0.5 shrink-0 text-brand-navy" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-brand-navy">Estado administrativo: {shown(status)}</p>
            <p className="mt-1 text-xs leading-5 text-slate-600">
              El estado determina qué operaciones puede realizar la empresa. Los cambios se gestionarán con autorización del servidor.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
