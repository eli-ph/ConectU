import Link from "next/link";
import { Building2, Info } from "lucide-react";
import { AuthCard, AuthShell } from "@/components/auth-shell";
import { Field, inputClass, primaryButton, textareaClass } from "@/components/dashboard-ui";

export const metadata = { title: "Registro de empresa" };

export default function CompanyRegisterPage() {
  return <AuthShell wide><AuthCard eyebrow="Registro empresarial" title="Registra tu organización" description="Una cuenta por empresa. La información será revisada antes de habilitar la publicación y las compras.">
    <div className="mb-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900"><Info className="mt-0.5 shrink-0" size={19} /><p>Mientras la cuenta esté pendiente podrás consultar el panel y completar el perfil, pero no publicar, reactivar, promover ofertas ni comprar.</p></div>
    <form className="space-y-7">
      <FormSection icon={Building2} title="Datos fiscales y corporativos"><div className="grid gap-4 md:grid-cols-2"><Field label="Razón social"><input className={inputClass} placeholder="Razón social completa" /></Field><Field label="RFC"><input className={inputClass} placeholder="RFC con homoclave" /></Field><Field label="Nombre comercial"><input className={inputClass} placeholder="Nombre visible" /></Field><Field label="Sector"><select className={`${inputClass} select-chevron`} defaultValue=""><option value="" disabled>Selecciona un sector</option><option>Tecnología</option><option>Servicios</option><option>Industria</option></select></Field><Field label="Sitio web"><input className={inputClass} type="url" placeholder="https://" /></Field><Field label="Tamaño de la organización"><select className={`${inputClass} select-chevron`}><option>1 a 10 colaboradores</option><option>11 a 50 colaboradores</option><option>Más de 50 colaboradores</option></select></Field><Field label="Descripción de la organización" className="md:col-span-2"><textarea className={textareaClass} placeholder="Actividad principal y propósito de la organización" /></Field></div></FormSection>
      <FormSection title="Ubicación y persona de contacto"><div className="grid gap-4 md:grid-cols-2"><Field label="Estado"><input className={inputClass} placeholder="Entidad federativa" /></Field><Field label="Ciudad o alcaldía"><input className={inputClass} placeholder="Ciudad" /></Field><Field label="Nombre de contacto"><input className={inputClass} placeholder="Nombre completo" /></Field><Field label="Cargo"><input className={inputClass} placeholder="Cargo dentro de la organización" /></Field><Field label="Correo empresarial"><input className={inputClass} type="email" placeholder="contacto@empresa.com" /></Field><Field label="Teléfono"><input className={inputClass} type="tel" placeholder="10 dígitos" /></Field></div></FormSection>
      <FormSection title="Seguridad"><div className="grid gap-4 md:grid-cols-2"><Field label="Contraseña"><input className={inputClass} type="password" /></Field><Field label="Confirmar contraseña"><input className={inputClass} type="password" /></Field></div></FormSection>
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-600"><input type="checkbox" className="mt-1 h-4 w-4 accent-brand-navy" /><span>Acepto los términos de uso y el aviso de privacidad.</span></label>
      <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row"><p className="text-sm text-slate-500">¿Ya tienes cuenta? <Link href="/ingresar" className="font-semibold text-brand-navy">Inicia sesión</Link></p><Link href="/verificar-correo" className={`${primaryButton} w-full sm:w-auto`}>Enviar registro</Link></div>
    </form>
  </AuthCard></AuthShell>;
}

function FormSection({ icon: Icon, title, children }) { return <fieldset><legend className="mb-4 flex items-center gap-2 font-bold text-brand-navy">{Icon && <Icon size={19} className="text-brand-gold" />}{title}</legend>{children}</fieldset>; }
