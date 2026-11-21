import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { AuthCard, AuthShell } from "@/components/auth-shell";
import { Field, inputClass, primaryButton } from "@/components/dashboard-ui";

export const metadata = { title: "Restablecer contraseña" };
export default function ResetPage() { return <AuthShell><AuthCard title="Restablece tu contraseña" description="Crea una contraseña nueva para proteger tu cuenta."><span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-brand-navy text-brand-gold"><ShieldCheck size={24} /></span><form className="mt-6 space-y-4"><Field label="Nueva contraseña" hint="Mínimo 8 caracteres, con mayúscula, minúscula y número."><input className={inputClass} type="password" /></Field><Field label="Confirmar nueva contraseña"><input className={inputClass} type="password" /></Field><Link href="/ingresar" className={`${primaryButton} mt-2 w-full`}>Restablecer contraseña</Link></form><p className="mt-6 text-center text-sm"><Link href="/ingresar" className="font-semibold text-brand-navy">Volver a iniciar sesión</Link></p></AuthCard></AuthShell>; }
