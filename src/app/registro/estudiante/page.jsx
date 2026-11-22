import Link from "next/link";
import { ArrowRight, BookOpen, GraduationCap, LockKeyhole } from "lucide-react";
import { AuthCard, AuthShell } from "@/components/auth-shell";
import { AuthForm, PasswordControl } from "@/components/auth-interactions";
import { Field, inputClass } from "@/components/dashboard-ui";

export const metadata = { title: "Registro de estudiante" };

const faculties = ["Facultad de Ingeniería", "Facultad de Ciencias", "Facultad de Química", "FES Aragón", "FES Acatlán"];
const careers = ["Ingeniería en Computación", "Ingeniería Eléctrica Electrónica", "Ingeniería Mecánica", "Ingeniería Industrial", "Ciencias de la Computación"];

export default function StudentRegisterPage() {
  return (
    <AuthShell wide>
      <AuthCard
        eyebrow="Registro de estudiantes · UNAM"
        title="Crea tu cuenta estudiantil"
        description="Completa tus datos académicos y utiliza tu correo institucional para acceder a las oportunidades de ConectU."
      >
        <AuthForm actionLabel="crear cuenta estudiantil" className="space-y-9">
          <section>
            <SectionTitle icon={GraduationCap} title="1. Datos personales y académicos" />
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Nombre completo" className="sm:col-span-2"><input className={inputClass} name="nombre" autoComplete="name" required placeholder="Nombre y apellidos" /></Field>
              <Field label="Número de cuenta UNAM"><input className={inputClass} name="numero_cuenta" required inputMode="numeric" pattern="[0-9]{9}" maxLength={9} placeholder="9 dígitos" /></Field>
              <Field label="Correo institucional UNAM"><input className={inputClass} name="correo" required type="email" autoComplete="email" placeholder="usuario@comunidad.unam.mx" /></Field>
              <Field label="Facultad o escuela"><select className={`${inputClass} select-chevron`} name="facultad" defaultValue="" required><option value="" disabled>Selecciona una facultad</option>{faculties.map((f) => <option key={f} value={f}>{f}</option>)}</select></Field>
              <Field label="Carrera"><select className={`${inputClass} select-chevron`} name="carrera" defaultValue="" required><option value="" disabled>Selecciona una carrera</option>{careers.map((c) => <option key={c} value={c}>{c}</option>)}</select></Field>
              <Field label="Semestre"><select className={`${inputClass} select-chevron`} name="semestre" defaultValue="" required><option value="" disabled>Selecciona tu semestre</option>{Array.from({length: 12}, (_,i) => <option value={i+1} key={i+1}>{i+1}</option>)}</select></Field>
              <Field label="Promedio general"><input className={inputClass} name="promedio" type="number" min="0" max="10" step="0.01" required placeholder="Ej. 9.25" /></Field>
              <Field label="Ubicación" className="sm:col-span-2"><input className={inputClass} name="ubicacion" required placeholder="Ciudad o alcaldía, estado" autoComplete="address-level2" /></Field>
            </div>
          </section>

          <section>
            <SectionTitle icon={LockKeyhole} title="2. Seguridad de la cuenta" />
            <div className="grid gap-5 sm:grid-cols-2">
              <PasswordControl name="password" hint="Mínimo 8 caracteres." />
              <PasswordControl label="Confirmar contraseña" name="confirm_password" placeholder="Repite tu contraseña" />
            </div>
          </section>

          <div className="border-t border-slate-200 pt-6">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600">
              <input className="mt-1.5 h-4 w-4 shrink-0 accent-brand-navy" type="checkbox" required name="acepta_terminos" />
              <span>Acepto los términos de uso y el aviso de privacidad de la plataforma.</span>
            </label>
            <button className="ui-button-primary mt-7 w-full justify-center gap-2.5 py-3.5 text-base sm:mx-auto sm:flex sm:max-w-xs" type="submit">
              Crear mi cuenta <ArrowRight size={18} aria-hidden="true" />
            </button>
            <p className="mt-5 text-center text-sm text-slate-600">¿Ya tienes una cuenta? <Link className="font-bold text-brand-navy hover:underline" href="/ingresar">Iniciar sesión</Link></p>
          </div>
        </AuthForm>
      </AuthCard>
      <p className="mt-5 flex justify-center gap-2 text-center text-xs leading-5 text-slate-500"><BookOpen size={15} className="shrink-0" aria-hidden="true" /> El acceso de estudiantes es gratuito.</p>
    </AuthShell>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return (
    <h2 className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-3 text-base font-bold text-brand-navy sm:text-lg">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-gold-soft text-brand-gold-dark"><Icon size={19} aria-hidden="true" /></span>{title}
    </h2>
  );
}
