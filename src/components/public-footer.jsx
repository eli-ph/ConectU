import Link from "next/link";
import { Brand } from "@/components/brand";

export function PublicFooter({ compact = false }) {
  if (compact) {
    return (
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-sm text-slate-500">
        © 2026 Plataforma de Vinculación Universitaria.
      </footer>
    );
  }

  return (
    <footer className="bg-brand-navy-dark text-slate-300">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="max-w-md">
          <Brand light />
          <p className="mt-5 text-sm leading-6 text-slate-300">
            Un punto de encuentro para estudiantes universitarios activos y organizaciones que buscan talento de nivel inicial.
          </p>
          <p className="mt-4 text-xs text-slate-400">Esta plataforma no es un sitio oficial de la UNAM.</p>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Estudiantes</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/ofertas" className="hover:text-white">Explorar ofertas</Link>
            <Link href="/registro" className="hover:text-white">Crear cuenta</Link>
            <Link href="/ingresar" className="hover:text-white">Iniciar sesión</Link>
          </div>
        </div>
        <div>
          <h2 className="text-sm font-semibold text-white">Empresas</h2>
          <div className="mt-4 flex flex-col gap-3 text-sm">
            <Link href="/planes" className="hover:text-white">Planes empresariales</Link>
            <Link href="/registro" className="hover:text-white">Registrar empresa</Link>
            <span>Aviso de privacidad</span>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-slate-400">
        © 2026 Plataforma de Vinculación Universitaria.
      </div>
    </footer>
  );
}
