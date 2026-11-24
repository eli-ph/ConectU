"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, BookOpen, GraduationCap, LockKeyhole } from "lucide-react";
import { AuthCard, AuthShell } from "@/components/auth-shell";
import { AuthForm, PasswordControl } from "@/components/auth-interactions";
import { PasswordStrength } from "@/components/password-strength";
import { AuthSectionTitle } from "@/components/auth-section-title";
import { SEMESTER_NUMBERS } from "@/lib/student-options";
import { nombreVisibleCarrera } from "@/lib/career-name";
import { Field, inputClass } from "@/components/dashboard-ui";


async function enviarRegistro(formData) {
  const data = Object.fromEntries(formData.entries());
  const response = await fetch("/api/auth/estudiante/registro", {
    method: "POST", headers: {"Content-Type":"application/json"}, body: JSON.stringify(data),
  });
  return response.json();
}

export default function StudentRegisterForm({ faculties, careers }) {
  const [password, setPassword] = useState("");
  const [facultadId, setFacultadId] = useState("");
  const matchingCareers = careers.filter((c) => String(c.facultad_id) === facultadId);
  return (
    <AuthShell wide>
      <AuthCard
        eyebrow="Registro de estudiantes · UNAM"
        title="Crea tu cuenta estudiantil"
        description="Completa tus datos académicos y utiliza tu correo institucional para acceder a las oportunidades de ConectU."
      >
        <AuthForm actionLabel="crear cuenta estudiantil" submitAction={enviarRegistro} className="space-y-9">
          <section>
            <AuthSectionTitle icon={GraduationCap} title="1. Datos personales y académicos" tone="gold" />
            <div className="grid gap-x-5 gap-y-5 sm:grid-cols-2">
              <Field label="Nombre completo" className="sm:col-span-2"><input className={inputClass} name="nombre" autoComplete="name" required placeholder="Nombre y apellidos" /></Field>
              <Field label="Número de cuenta UNAM"><input className={inputClass} name="numero_cuenta" required inputMode="numeric" pattern="[0-9]{9}" maxLength={9} placeholder="9 dígitos" /></Field>
              <Field label="Correo institucional UNAM"><input className={inputClass} name="correo" required type="email" autoComplete="email" placeholder="usuario@comunidad.unam.mx" /></Field>
              <Field label="Facultad o escuela"><select className={`${inputClass} select-chevron`} name="facultad_id" value={facultadId} onChange={(e) => setFacultadId(e.target.value)} required><option value="" disabled>Selecciona una facultad</option>{faculties.map((f) => <option key={f.id} value={f.id}>{f.nombre}</option>)}</select></Field>
              <Field label="Carrera"><select key={facultadId} className={`${inputClass} select-chevron`} name="carrera_id" defaultValue="" required disabled={!facultadId}><option value="" disabled>Selecciona una carrera</option>{matchingCareers.map((c) => <option key={c.id} value={c.id}>{nombreVisibleCarrera(c.nombre)}</option>)}</select></Field>
              <Field label="Semestre"><select className={`${inputClass} select-chevron`} name="semestre" defaultValue="" required><option value="" disabled>Selecciona tu semestre</option>{SEMESTER_NUMBERS.map((semester) => <option value={semester} key={semester}>{semester}</option>)}</select></Field>
              <Field label="Promedio general"><input className={inputClass} name="promedio" type="number" min="0" max="10" step="0.01" required placeholder="Ej. 9.25" /></Field>
              <Field label="Ubicación" className="sm:col-span-2"><input className={inputClass} name="ubicacion" required placeholder="Ciudad o alcaldía, estado" autoComplete="address-level2" /></Field>
            </div>
          </section>

          <section>
            <AuthSectionTitle icon={LockKeyhole} title="2. Seguridad de la cuenta" tone="gold" />
            <div className="grid gap-5 sm:grid-cols-2">
              <PasswordControl name="password" hint="Mínimo 8 caracteres." value={password} onChange={setPassword} />
              <PasswordControl label="Confirmar contraseña" name="confirm_password" placeholder="Repite tu contraseña" />
              <div className="sm:col-span-2">
                <PasswordStrength password={password} />
              </div>
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
