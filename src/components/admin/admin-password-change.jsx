"use client";
import { useState } from "react";
import { LockKeyhole } from "lucide-react";
import { PasswordStrength } from "@/components/password-strength";
import { checkPassword } from "@/lib/password-policy";
export function AdminPasswordChange() {
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [message, setMessage] = useState("");
  const ready = !!current && checkPassword(password).valid && password === confirmation;
  return <form className="space-y-4 p-5" onSubmit={(e) => { e.preventDefault(); setMessage("La contraseña se actualizará al integrar la autenticación del servidor."); }}>
    <div className="grid gap-4 md:grid-cols-3">
      {[{label:"Contraseña actual",value:current,set:setCurrent},{label:"Nueva contraseña",value:password,set:setPassword},{label:"Confirmar contraseña",value:confirmation,set:setConfirmation}].map((field)=><label key={field.label} className="text-sm font-semibold text-slate-700">{field.label}<input type="password" value={field.value} onChange={(e)=>field.set(e.target.value)} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 outline-none focus:border-brand-navy" autoComplete={field.label==="Contraseña actual"?"current-password":"new-password"}/></label>)}
    </div><PasswordStrength password={password}/>
    {confirmation && password!==confirmation && <p className="text-xs font-semibold text-rose-700">Las contraseñas no coinciden.</p>}
    <div className="flex justify-end"><button disabled={!ready} className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"><LockKeyhole size={16}/>Actualizar contraseña</button></div>
    {message && <p role="status" className="text-xs text-slate-600">{message}</p>}
  </form>;
}
