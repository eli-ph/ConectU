import Link from "next/link";
import { KeyRound } from "lucide-react";
import { AuthCard, AuthShell } from "@/components/auth-shell";
import { Field, inputClass, primaryButton } from "@/components/dashboard-ui";

export const metadata = { title: "Recuperar contraseña" };
export default function RecoverPage() { return <AuthShell><AuthCard title="¿Olvidaste tu contraseña?" description="Ingresa el correo de tu cuenta y te enviaremos instrucciones para restablecerla."><span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-brand-navy text-brand-gold"><KeyRound size={24} /></span><form className="mt-6"><Field label="Correo electrónico"><input className={inputClass} type="email" placeholder="nombre@correo.com" /></Field><Link href="/restablecer-contrasena" className={`${primaryButton} mt-5 w-full`}>Enviar instrucciones</Link></form><p className="mt-6 text-center text-sm"><Link href="/ingresar" className="font-semibold text-brand-navy">Volver a iniciar sesión</Link></p></AuthCard></AuthShell>; }
