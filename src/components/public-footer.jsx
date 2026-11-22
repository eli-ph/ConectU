import Link from "next/link";
import { Brand } from "@/components/brand";

export function PublicFooter({ compact = false }) {
  if (compact) {
    return (
      <footer className="border-t border-slate-200 bg-white px-4 py-6 text-center text-xs leading-5 text-slate-500 sm:text-sm">
        © 2026 ConectU · Plataforma de Vinculación Universitaria.
      </footer>
    );
  }

  return (
    <footer className="bg-brand-navy-dark text-slate-300">
      <div className="container-page grid gap-x-12 gap-y-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:py-16">
        <div className="max-w-md sm:col-span-2 lg:col-span-1">
          <Brand light />
          <p className="mt-5 text-sm leading-7 text-slate-300">
            Un espacio para conectar a estudiantes activos de la UNAM con organizaciones que ofrecen oportunidades de desarrollo profesional.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-400">
            ConectU no es una plataforma oficial de la UNAM.
          </p>
        </div>
        <nav aria-label="Enlaces para estudiantes">
          <h2 className="text-sm font-bold text-white">Estudiantes</h2>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm">
            <Link href="/ofertas" className="transition hover:text-brand-gold">Explorar ofertas</Link>
            <Link href="/registro/estudiante" className="transition hover:text-brand-gold">Crear cuenta</Link>
            <Link href="/ingresar" className="transition hover:text-brand-gold">Iniciar sesión</Link>
          </div>
        </nav>
        <nav aria-label="Enlaces para empresas">
          <h2 className="text-sm font-bold text-white">Empresas</h2>
          <div className="mt-4 flex flex-col items-start gap-3 text-sm">
            <Link href="/planes" className="transition hover:text-brand-gold">Planes empresariales</Link>
            <Link href="/registro/empresa" className="transition hover:text-brand-gold">Registrar empresa</Link>
          </div>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-5 text-center text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <span>© 2026 ConectU. Todos los derechos reservados.</span>
          <span>Vinculación universitaria · Proyecto académico</span>
        </div>
      </div>
    </footer>
  );
}
