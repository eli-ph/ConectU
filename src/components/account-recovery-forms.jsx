"use client";

import { useRef, useState } from "react";
import { ArrowRight, CircleCheck, Eye, EyeOff, Mail, RefreshCcw, ShieldCheck } from "lucide-react";
import { PasswordStrength } from "@/components/password-strength";
import { checkPassword } from "@/lib/password-policy";

function Feedback({ children }) {
  if (!children) return null;
  return (
    <p role="status" aria-live="polite" className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
      {children}
    </p>
  );
}

export function VerificationCodeForm({ correo, devMode = false }) {
  const [digits, setDigits] = useState(Array(6).fill(""));
  const [feedback, setFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inputs = useRef([]);

  function updateAt(index, value) {
    const filtered = value.replace(/\D/g, "");
    if (!filtered) {
      setDigits((previous) => previous.map((digit, i) => (i === index ? "" : digit)));
      return;
    }
    const values = filtered.slice(0, 6 - index).split("");
    setDigits((previous) => {
      const next = [...previous];
      values.forEach((digit, i) => { next[index + i] = digit; });
      return next;
    });
    inputs.current[Math.min(index + values.length, 5)]?.focus();
    setFeedback("");
  }

  function handlePaste(event, index) {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    event.preventDefault();
    updateAt(index, pasted);
  }

  function handleKeyDown(event, index) {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (event.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  }

  async function post(url, data) {
    const response = await fetch(url, {method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    return response.json();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (digits.some((value) => !value)) {
      setFeedback("Introduce los seis dígitos del código.");
      return;
    }
    setSubmitting(true); setFeedback("");
    try {
      const result = await post("/api/auth/correo/verificar",{codigo:digits.join("")});
      if (result.ok) {
        window.location.assign(result.redirect || "/ingresar");
        return;
      }
      setFeedback(result.message || "Código no válido.");
    } catch { setFeedback("No fue posible conectar con el servidor."); }
    finally { setSubmitting(false); }
  }

  async function resend() {
    setSubmitting(true); setFeedback("");
    try {
      const result = await post("/api/auth/correo/reenviar",{});
      setFeedback(result.message || "No fue posible reenviar el código.");
    } catch { setFeedback("No fue posible conectar con el servidor."); }
    finally { setSubmitting(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-7" aria-busy={submitting}>
      <div className="mb-6 rounded-xl border border-slate-200 bg-[#eff2fc] px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Correo institucional</p>
        <p className="mt-1 break-all text-sm font-semibold text-brand-navy">{correo}</p>
      </div>
      <label className="block text-center text-xs font-bold uppercase tracking-[0.1em] text-brand-navy" htmlFor="verification-digit-0">
        Código de 6 dígitos
      </label>
      <div className="mt-4 flex justify-center gap-1.5 sm:gap-3" role="group" aria-label="Introduce el código de verificación de seis dígitos">
        {digits.map((digit, index) => (
          <input key={index} ref={element => { inputs.current[index] = element; }} id={`verification-digit-${index}`}
            type="text" inputMode="numeric" pattern="[0-9]*" autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={index === 0 ? 6 : 1} value={digit} onChange={e => updateAt(index,e.target.value)}
            onPaste={e => handlePaste(e,index)} onKeyDown={e => handleKeyDown(e,index)}
            aria-label={`Dígito ${index+1} de 6`}
            className="h-12 w-full min-w-0 max-w-12 flex-1 rounded-lg border border-slate-300 bg-[#f6f7fc] text-center text-xl font-bold text-brand-navy outline-none transition focus:border-brand-navy focus:bg-white focus:ring-2 focus:ring-brand-navy/15 sm:h-14" />
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-slate-500">El código expira después de 10 minutos y admite hasta 5 intentos.</p>
      {devMode && <p className="mt-2 text-center text-xs font-semibold text-amber-700">Modo de desarrollo: consulta el código en la terminal donde ejecutas Next.js. No se envió un correo real.</p>}
      <button disabled={submitting} type="submit" className="ui-button-primary mt-7 min-h-12 w-full gap-2 rounded-xl text-base disabled:opacity-60">
        <CircleCheck size={19} aria-hidden="true" /> Verificar código
      </button>
      <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm text-slate-600">
        <span>¿No recibiste el código?</span>
        <button disabled={submitting} type="button" onClick={resend} className="inline-flex items-center gap-1.5 font-semibold text-brand-gold-dark hover:underline disabled:opacity-60">
          <RefreshCcw size={15} aria-hidden="true" /> Reenviar código
        </button>
      </div>
      <Feedback>{feedback}</Feedback>
    </form>
  );
}

export function RecoveryRequestForm() {
  const [email, setEmail] = useState("");
  const [feedback, setFeedback] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setFeedback("El envío del enlace todavía no está disponible.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <label htmlFor="recovery-email" className="mb-2 block text-sm font-semibold text-brand-navy">Correo electrónico institucional o corporativo</label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={19} aria-hidden="true" />
        <input
          id="recovery-email"
          name="correo"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => { setEmail(event.target.value); setFeedback(""); }}
          placeholder="tu-correo@dominio.com"
          className="ui-control h-12 bg-[#f4f5fd]"
          style={{ paddingLeft: "2.8rem" }}
        />
      </div>
      <button type="submit" className="ui-button-primary mt-5 min-h-12 w-full gap-2 rounded-xl text-base shadow-sm">
        Enviar enlace de recuperación <ArrowRight size={19} aria-hidden="true" />
      </button>
      <Feedback>{feedback}</Feedback>
    </form>
  );
}

function PasswordField({ id, label, value, onChange, visible, onToggle }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-xs font-bold uppercase tracking-[0.05em] text-brand-navy">{label}</label>
      <div className="relative">
        <input
          id={id}
          name={id}
          required
          minLength={8}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="ui-control h-12 bg-[#f4f5fd]"
          style={{ paddingRight: "3rem" }}
        />
        <button
          type="button"
          aria-label={visible ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={onToggle}
          className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-[#e4e9f7] hover:text-brand-navy"
        >
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

export function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleConfirm, setVisibleConfirm] = useState(false);
  const [feedback, setFeedback] = useState("");

  const strength = checkPassword(password);
  const matches = confirmation.length > 0 && password === confirmation;
  const ready = strength.valid && matches;

  function handleSubmit(event) {
    event.preventDefault();
    if (!ready) {
      setFeedback("Comprueba los requisitos y que ambas contraseñas coincidan.");
      return;
    }
    setFeedback("El cambio de contraseña estará disponible al habilitar la recuperación de cuentas.");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <PasswordField id="new-password" label="Nueva contraseña" value={password} onChange={(value) => { setPassword(value); setFeedback(""); }} visible={visiblePassword} onToggle={() => setVisiblePassword(!visiblePassword)} />
        <PasswordField id="confirm-password" label="Confirmar contraseña" value={confirmation} onChange={(value) => { setConfirmation(value); setFeedback(""); }} visible={visibleConfirm} onToggle={() => setVisibleConfirm(!visibleConfirm)} />
      </div>
      <div className="mt-6">
        <PasswordStrength password={password} />
        {confirmation && <p className={`mt-3 text-xs ${matches ? "text-emerald-700" : "text-rose-700"}`} aria-live="polite">
          {matches ? "Las contraseñas coinciden." : "Las contraseñas no coinciden."}
        </p>}
      </div>
      <button type="submit" disabled={!ready} className="ui-button-primary mt-7 min-h-12 w-full gap-2 rounded-xl text-base disabled:bg-slate-400 disabled:text-white">
        <ShieldCheck size={19} aria-hidden="true" /> Restablecer contraseña
      </button>
      <Feedback>{feedback}</Feedback>
    </form>
  );
}
