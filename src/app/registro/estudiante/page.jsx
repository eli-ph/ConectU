import Link from "next/link";
import { GraduationCap, Info } from "lucide-react";
import { AuthCard, AuthShell } from "@/components/auth-shell";
import { Field, inputClass, primaryButton } from "@/components/dashboard-ui";

export const metadata = { title: "Registro de estudiante" };

export default function StudentRegisterPage() {
  return <AuthShell wide><AuthCard eyebrow="Registro de estudiante" title="Crea tu cuenta estudiantil" description="Usa tu correo institucional vigente. El acceso estudiantil no tiene costo.">
    <div className="mb-6 flex gap-3 rounded-xl bg-[#eeefff] p-4 text-sm leading-6 text-brand-navy"><Info className="mt-0.5 shrink-0" size={19} /><p>La plataforma valida dominios institucionales configurados. Necesitarás conservar una matrícula activa para utilizar las funciones estudiantiles.</p></div>
    <form className="space-y-7">
      <FormSection icon={GraduationCap} title="Datos personales y académicos"><div className="grid gap-4 md:grid-cols-2"><Field label="Nombre completo"><input className={inputClass} placeholder="Nombre y apellidos" /></Field><Field label="Número de cuenta"><input className={inputClass} placeholder="9 dígitos" inputMode="numeric" /></Field><Field label="Correo institucional"><input className={inputClass} type="email" placeholder="nombre@comunidad.unam.mx" /></Field><Field label="Facultad o escuela"><select className={`${inputClass} select-chevron`} defaultValue=""><option value="" disabled>Selecciona una opción</option><option>Facultad demostrativa</option></select></Field><Field label="Carrera"><select className={`${inputClass} select-chevron`} defaultValue=""><option value="" disabled>Selecciona una carrera</option><option>Programa académico demostrativo</option></select></Field><Field label="Semestre"><select className={`${inputClass} select-chevron`} defaultValue=""><option value="" disabled>Selecciona</option><option>1</option><option>5</option><option>9</option></select></Field><Field label="Promedio"><input className={inputClass} placeholder="0.00" inputMode="decimal" /></Field><Field label="Ubicación"><input className={inputClass} placeholder="Ciudad, estado" /></Field></div></FormSection>
      <FormSection title="Seguridad de la cuenta"><div className="grid gap-4 md:grid-cols-2"><Field label="Contraseña" hint="Mínimo 8 caracteres, con mayúscula, minúscula y número."><input className={inputClass} type="password" /></Field><Field label="Confirmar contraseña"><input className={inputClass} type="password" /></Field></div></FormSection>
      <label className="flex items-start gap-3 text-sm leading-6 text-slate-600"><input type="checkbox" className="mt-1 h-4 w-4 accent-brand-navy" /><span>Acepto los términos de uso y el aviso de privacidad de la plataforma.</span></label>
      <div className="flex flex-col-reverse items-center justify-between gap-4 border-t border-slate-100 pt-6 sm:flex-row"><p className="text-sm text-slate-500">¿Ya tienes cuenta? <Link href="/ingresar" className="font-semibold text-brand-navy">Inicia sesión</Link></p><Link href="/verificar-correo" className={`${primaryButton} w-full sm:w-auto`}>Crear cuenta</Link></div>
    </form>
  </AuthCard></AuthShell>;
}

function FormSection({ icon: Icon, title, children }) { return <fieldset><legend className="mb-4 flex items-center gap-2 font-bold text-brand-navy">{Icon && <Icon size={19} className="text-brand-gold" />}{title}</legend>{children}</fieldset>; }
