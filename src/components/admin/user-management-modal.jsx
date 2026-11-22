"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Eye, LockKeyhole, ShieldAlert, UserRound, X } from "lucide-react";

const roleNames = { estudiante: "Estudiante", administrador: "Administrador" };
const statusNames = { activo: "Activo", pendiente: "Pendiente", suspendido: "Suspendido" };

function InitialAvatar({ name }) {
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e8ecff] text-sm font-bold text-brand-navy">{initials}</span>;
}

function ModalFrame({ titleId, user, onClose, children, accent = false, width = "max-w-[560px]" }) {
  const closeRef = useRef(null);
  useEffect(() => {
    if (!user) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const handler = (event) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", handler); };
  }, [user, onClose]);

  if (!user) return null;
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center overflow-y-auto bg-brand-navy-dark/55 p-3 backdrop-blur-sm sm:p-6" onMouseDown={(event) => { if (event.currentTarget === event.target) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby={titleId} className={`relative flex max-h-[92dvh] w-full ${width} flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_25px_80px_rgba(0,22,49,.28)]`}>
        {accent && <div className="h-1.5 shrink-0 bg-red-600" aria-hidden="true" />}
        <button ref={closeRef} onClick={onClose} type="button" aria-label="Cerrar modal" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-lg text-slate-500 transition hover:bg-slate-100"><X size={19} /></button>
        {children}
      </section>
    </div>
  );
}

function IdentitySummary({ user }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-[#f1f2fc] p-4">
      <InitialAvatar name={user.name} />
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-bold text-brand-navy">{user.name}</p>
        <p className="mt-0.5 text-xs text-slate-600">{roleNames[user.role]} · {user.identifier || "Identificador no disponible"}</p>
      </div>
      <span className="rounded-lg bg-white px-2.5 py-1 text-[11px] font-semibold text-brand-navy">{statusNames[user.status]}</span>
    </div>
  );
}

function DetailItem({ label, value }) {
  return <div className="min-w-0"><dt className="text-[11px] font-semibold uppercase tracking-[0.04em] text-slate-500">{label}</dt><dd className="mt-1 break-words text-sm font-semibold text-brand-navy">{value || "—"}</dd></div>;
}

export function UserDetailsModal({ user, onClose, onManage }) {
  const titleId = useId();
  return (
    <ModalFrame user={user} titleId={titleId} onClose={onClose}>
      <header className="flex items-start gap-3 border-b border-slate-100 bg-[#f5f6fd] px-5 py-5 pr-14 sm:px-7 sm:pr-14">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-navy text-white"><UserRound size={22} /></span>
        <div><h2 id={titleId} className="text-lg font-bold text-brand-navy">Información del usuario</h2><p className="mt-1 text-xs text-slate-600">Consulta los datos disponibles de su cuenta.</p></div>
      </header>
      {user && (
        <>
          <div className="min-h-0 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
            <IdentitySummary user={user} />
            <dl className="grid gap-5 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
              <DetailItem label="Nombre completo" value={user.name} />
              <DetailItem label="Correo electrónico" value={user.email} />
              <DetailItem label="Rol" value={roleNames[user.role]} />
              <DetailItem label="Estado" value={statusNames[user.status]} />
              <DetailItem label="Identificador" value={user.identifier} />
              <DetailItem label="Fecha de registro" value={user.registeredAt} />
              <DetailItem label="Último acceso" value={user.lastAccess} />
            </dl>
          </div>
          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-[#f7f8fd] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-brand-navy hover:bg-slate-50">Cerrar</button>
            <button type="button" onClick={() => onManage(user)} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white hover:bg-brand-navy-light"><LockKeyhole size={17} /> Gestionar usuario</button>
          </footer>
        </>
      )}
    </ModalFrame>
  );
}

export function UserManagementModal({ user, onClose }) {
  const titleId = useId();
  const [action, setAction] = useState("suspender");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!user) return;
    setAction(user.status === "suspendido" ? "reactivar" : "suspender");
    setReason("");
    setMessage("");
  }, [user]);

  const submitDecision = (event) => {
    event.preventDefault();
    if (reason.trim().length < 10) {
      setMessage("Escribe un motivo de al menos 10 caracteres antes de continuar.");
      return;
    }
    // Las decisiones de administración de cuentas solo pueden confirmarse en servidor.
    setMessage("No se realizaron cambios en la cuenta. La operación debe conectarse al sistema de administración y autorización.");
  };

  return (
    <ModalFrame user={user} titleId={titleId} onClose={onClose} accent>
      <header className="flex items-start gap-4 border-b border-slate-100 px-5 pb-5 pt-6 pr-14 sm:px-7 sm:pr-14">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-red-100 text-red-700"><AlertTriangle size={25} /></span>
        <div className="min-w-0">
          <h2 id={titleId} className="text-lg font-bold text-brand-navy sm:text-xl">Suspender o eliminar usuario</h2>
          <p className="mt-1 text-sm leading-5 text-slate-600">Selecciona una acción y registra el motivo para mantener un historial administrativo.</p>
        </div>
      </header>
      {user && (
        <form onSubmit={submitDecision} className="flex min-h-0 flex-col">
          <div className="min-h-0 space-y-5 overflow-y-auto px-5 py-5 sm:px-7">
            <IdentitySummary user={user} />
            <label className="block text-xs font-bold uppercase tracking-[0.05em] text-slate-600">
              Acción a ejecutar <span className="text-red-600">*</span>
              <select value={action} onChange={(event) => { setAction(event.target.value); setMessage(""); }} className="mt-2 h-12 w-full rounded-lg border border-slate-200 bg-[#f3f4fc] px-3 text-sm font-medium normal-case tracking-normal text-brand-navy outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10">
                <option value="suspender">Suspender temporalmente</option>
                {user.status === "suspendido" && <option value="reactivar">Reactivar cuenta</option>}
                <option value="eliminar">Eliminar cuenta</option>
              </select>
            </label>
            {action === "eliminar" && <p className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-800"><ShieldAlert size={16} className="mt-0.5 shrink-0" /> La eliminación deberá conservar los registros históricos que correspondan, según las reglas de ConectU.</p>}
            <label className="block text-xs font-bold uppercase tracking-[0.05em] text-slate-600">
              Motivo de la acción <span className="text-red-600">*</span>
              <textarea value={reason} onChange={(event) => { setReason(event.target.value); setMessage(""); }} maxLength={1000} rows={4} placeholder="Describe el motivo de la suspensión, reactivación o eliminación de esta cuenta..." className="mt-2 w-full resize-y rounded-lg border border-slate-200 bg-[#f3f4fc] px-4 py-3 text-sm font-normal normal-case leading-6 tracking-normal text-brand-navy outline-none placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10" />
              <span className="mt-1 block text-right text-[11px] font-normal normal-case tracking-normal text-slate-500">{reason.length} / 1000 caracteres</span>
            </label>
            {message && <p role="status" className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-sm leading-5 text-amber-900">{message}</p>}
          </div>
          <footer className="flex shrink-0 flex-col-reverse gap-2 border-t border-slate-100 bg-[#f7f8fd] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
            <button type="button" onClick={onClose} className="min-h-11 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-brand-navy transition hover:bg-slate-50">Cancelar</button>
            <button type="submit" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-700 px-5 text-sm font-bold text-white transition hover:bg-red-800"><CheckCircle2 size={17} aria-hidden="true" /> Confirmar acción</button>
          </footer>
        </form>
      )}
    </ModalFrame>
  );
}
