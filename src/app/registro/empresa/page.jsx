import Link from "next/link";
import { ArrowRight, Building2, ContactRound, LockKeyhole, ShieldCheck } from "lucide-react";
import { AuthCard, AuthShell } from "@/components/auth-shell";
import { AuthForm, PasswordControl } from "@/components/auth-interactions";
import { Field, inputClass, textareaClass } from "@/components/dashboard-ui";

export const metadata = { title: "Registro de empresa" };

export default function CompanyRegisterPage() {
  return (
    <AuthShell wide>
      <div className="mb-7 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-brand-gold-dark">Portal empresarial · ConectU</p>
        <h1 className="mt-2 text-2xl font-bold tracking-[-0.035em] text-brand-navy sm:text-3xl">Registro de empresa</h1>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">Crea la cuenta de acceso de tu organización para gestionar oportunidades de vinculación universitaria.</p>
      </div>
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#dde3f6] bg-[#f0f2fc] px-4 py-4 text-sm text-brand-navy sm:px-5">
        <ShieldCheck size={20} className="mt-0.5 shrink-0 text-brand-gold-dark" aria-hidden="true" />
        <p className="leading-6"><strong>Aprobación administrativa.</strong> Después del registro podrás consultar tu cuenta. Para publicar ofertas o contratar planes y promociones, la empresa deberá ser aprobada por un administrador.</p>
      </div>
      <AuthCard title="Datos de la organización" description="Los datos de la empresa y de la cuenta de acceso se registran una sola vez.">
        <AuthForm actionLabel="registrar empresa" className="space-y-9">
          <section>
            <SectionTitle icon={Building2} title="1. Datos fiscales y corporativos" />
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Razón social" className="sm:col-span-2"><input className={inputClass} name="razon_social" required placeholder="Nombre fiscal completo" autoComplete="organization" /></Field>
              <Field label="Nombre comercial"><input className={inputClass} name="nombre_comercial" required placeholder="Nombre visible de la empresa" /></Field>
              <Field label="RFC"><input className={inputClass} name="rfc" required minLength={12} maxLength={13} placeholder="RFC con homoclave" autoCapitalize="characters" /></Field>
              <Field label="Tipo de contribuyente"><select className={`${inputClass} select-chevron`} name="tipo_contribuyente" defaultValue="" required><option value="" disabled>Selecciona una opción</option><option value="fisica">Persona física</option><option value="moral">Persona moral</option></select></Field>
              <Field label="Sector o rama"><select className={`${inputClass} select-chevron`} name="sector" defaultValue="" required><option value="" disabled>Selecciona el sector</option><option>Tecnología</option><option>Servicios</option><option>Industria</option><option>Educación</option><option>Otro</option></select></Field>
              <Field label="Tamaño de la organización"><select className={`${inputClass} select-chevron`} name="tamano" defaultValue=""><option value="">Selecciona el tamaño</option><option>1 a 10 colaboradores</option><option>11 a 50 colaboradores</option><option>51 a 250 colaboradores</option><option>Más de 250 colaboradores</option></select></Field>
              <Field label="Sitio web (opcional)"><input className={inputClass} name="sitio_web" type="url" placeholder="https://www.empresa.com" /></Field>
              <Field label="Descripción de la organización" className="sm:col-span-2"><textarea className={textareaClass} name="descripcion" rows={3} placeholder="¿A qué se dedica la empresa?" /></Field>
            </div>
          </section>

          <section>
            <SectionTitle icon={ContactRound} title="2. Ubicación y contacto" />
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Estado"><input className={inputClass} name="estado" required placeholder="Entidad federativa" /></Field>
              <Field label="Ciudad o alcaldía"><input className={inputClass} name="ciudad" required placeholder="Ciudad o alcaldía" /></Field>
              <Field label="Nombre de contacto"><input className={inputClass} name="contacto" required autoComplete="name" placeholder="Nombre y apellidos" /></Field>
              <Field label="Cargo"><input className={inputClass} name="cargo" required placeholder="Cargo en la organización" /></Field>
              <Field label="Teléfono"><input className={inputClass} name="telefono" type="tel" required autoComplete="tel" placeholder="Teléfono de contacto" /></Field>
              <Field label="Correo empresarial"><input className={inputClass} name="correo" type="email" required autoComplete="email" placeholder="contacto@empresa.com" /></Field>
            </div>
          </section>

          <section>
            <SectionTitle icon={LockKeyhole} title="3. Credenciales de la cuenta" />
            <div className="grid gap-5 sm:grid-cols-2">
              <PasswordControl name="password" hint="Mínimo 8 caracteres." />
              <PasswordControl label="Confirmar contraseña" name="confirm_password" placeholder="Repite tu contraseña" />
            </div>
          </section>

          <div className="border-t border-slate-200 pt-6">
            <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-600"><input className="mt-1.5 h-4 w-4 shrink-0 accent-brand-navy" type="checkbox" name="acepta_terminos" required /><span>Acepto los términos de uso y el aviso de privacidad.</span></label>
            <button className="ui-button-primary mt-7 w-full py-3.5 text-base" type="submit">Solicitar registro empresarial <ArrowRight size={18} aria-hidden="true" /></button>
            <p className="mt-5 text-center text-sm text-slate-600">¿Ya tienes una cuenta? <Link href="/ingresar" className="font-bold text-brand-navy hover:underline">Iniciar sesión</Link></p>
          </div>
        </AuthForm>
      </AuthCard>
    </AuthShell>
  );
}

function SectionTitle({ icon: Icon, title }) {
  return <h2 className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-3 text-base font-bold text-brand-navy sm:text-lg"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#edf0ff] text-brand-navy"><Icon size={19} aria-hidden="true" /></span>{title}</h2>;
}
