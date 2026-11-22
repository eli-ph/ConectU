"use client";

import { useId, useState } from "react";
import { Eye, EyeOff, LockKeyhole } from "lucide-react";

/** Solo controla la interfaz. El envío real se conectará al servidor. */
export function AuthForm({ children, className = "", actionLabel = "este formulario" }) {
  const [feedback, setFeedback] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    if (values.has("confirm_password") && values.get("password") !== values.get("confirm_password")) {
      setFeedback("Las contraseñas no coinciden. Revisa ambos campos.");
      return;
    }
    setFeedback(`La acción «${actionLabel}» estará disponible cuando conectemos la autenticación con el servidor.`);
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      {children}
      {feedback && (
        <p role="status" aria-live="polite" className="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-600">
          {feedback}
        </p>
      )}
    </form>
  );
}

export function PasswordControl({ label = "Contraseña", name, autoComplete = "new-password", hint, placeholder = "Ingresa tu contraseña", required = true }) {
  const id = useId();
  const [visible, setVisible] = useState(false);
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-800">{label}</label>
      <div className="relative">
        <LockKeyhole size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          required={required}
          minLength={8}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="ui-control h-12"
          style={{ paddingLeft: "2.75rem", paddingRight: "3.25rem" }}
        />
        <button
          type="button"
          aria-label={visible ? `Ocultar ${label.toLowerCase()}` : `Mostrar ${label.toLowerCase()}`}
          aria-pressed={visible}
          onClick={() => setVisible((value) => !value)}
          className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-brand-navy"
        >
          {visible ? <EyeOff size={19} /> : <Eye size={19} />}
        </button>
      </div>
      {hint && <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>}
    </div>
  );
}
