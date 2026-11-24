import { CalendarDays, LockKeyhole, Mail, ShieldCheck, UserRound } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { AdminPasswordChange } from "@/components/admin/admin-password-change";
import { Panel, Field, inputClass, Status } from "@/components/dashboard-ui";
import { exigirRol } from "@/server/auth/session";

export const metadata = { title: "Mi cuenta" };

function fechaRegistro(value) {
  if (!value) return "No disponible";
  const iso = value.includes("T") ? value : `${value.replace(" ", "T")}Z`;
  const parsed = new Date(iso);
  return Number.isNaN(parsed.getTime())
    ? "No disponible"
    : new Intl.DateTimeFormat("es-MX", {
        day: "2-digit", month: "long", year: "numeric", timeZone: "America/Mexico_City",
      }).format(parsed);
}

export default async function AdminAccountPage() {
  // El layout exige el rol, y la consulta de sesión devuelve la identidad REAL.
  const user = await exigirRol("admin");
  const nombreCompleto = `${user.nombre} ${user.apellidos}`.trim();
  const initials = [user.nombre, user.apellidos]
    .filter(Boolean).map((part) => part.trim()[0]?.toUpperCase()).join("");

  return (
    <DashboardShell role="admin" title="Mi cuenta" eyebrow="Perfil administrativo" hidePageHeader>
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-brand-gold-dark">PERFIL ADMINISTRATIVO</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-3xl">Mi cuenta</h1>
          <p className="mt-1 text-sm leading-6 text-slate-500">
            Consulta tus datos de acceso y la seguridad de tu cuenta administrativa.
          </p>
        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm leading-6 text-brand-navy">
          Esta información procede de tu cuenta en SQLite. Puedes actualizar tu contraseña desde el apartado de seguridad.
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.55fr_0.8fr]">
          <Panel title="Datos de la cuenta" description="Información registrada al crear el usuario administrador.">
            <div className="grid gap-4 p-5 md:grid-cols-2 sm:p-6">
              <Field label="Nombre">
                <input className={inputClass} type="text" value={user.nombre} readOnly />
              </Field>
              <Field label="Apellidos">
                <input className={inputClass} type="text" value={user.apellidos} readOnly />
              </Field>
              <Field label="Correo electrónico" className="md:col-span-2">
                <div className="relative">
                  <Mail size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input className={`${inputClass} pl-10`} type="email" value={user.email} readOnly />
                </div>
              </Field>
              <Field label="Fecha de registro" className="md:col-span-2">
                <div className="relative">
                  <CalendarDays size={17} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                  <input className={`${inputClass} pl-10`} type="text" value={fechaRegistro(user.created_at)} readOnly />
                </div>
              </Field>
            </div>
          </Panel>

          <Panel>
            <div className="flex h-full flex-col items-center justify-center p-6 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-brand-navy font-bold text-brand-gold ring-4 ring-brand-gold/10">
                {initials || <UserRound size={28} aria-hidden="true" />}
              </span>
              <h2 className="mt-4 break-words text-lg font-bold text-brand-navy">{nombreCompleto}</h2>
              <p className="mt-1 text-sm text-slate-500">Administrador</p>
              <div className="mt-4 flex items-center gap-2">
                <ShieldCheck size={17} className="text-emerald-700" aria-hidden="true" />
                <Status tone={user.activo === 1 ? "green" : "red"}>
                  {user.activo === 1 ? "Cuenta activa" : "Cuenta inactiva"}
                </Status>
              </div>
            </div>
          </Panel>

          <Panel className="lg:col-span-2" title="Seguridad de la cuenta" description="Las contraseñas nunca se muestran ni pueden recuperarse desde la base de datos.">
            <AdminPasswordChange />
          </Panel>
        </div>
      </div>
    </DashboardShell>
  );
}
