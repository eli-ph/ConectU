"use client";

import Link from "next/link";
import { LayoutDashboard, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/ofertas", label: "Explorar ofertas" },
  { href: "/planes", label: "Planes para empresas" },
];

export function PublicHeaderClient({ compact = false, dashboardHref = null }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [open]);

  const isActive = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_1px_8px_rgba(20,43,73,0.035)] backdrop-blur-xl">
      <div className="container-page flex min-h-[74px] items-center justify-between gap-4 py-2">
        <Brand href={dashboardHref || "/"} />

        {!compact && (
          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  isActive(link.href)
                    ? "bg-brand-gold-soft text-brand-navy"
                    : "text-slate-600 hover:bg-slate-50 hover:text-brand-navy"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {dashboardHref ? (
            <Link href={dashboardHref} className="ui-button-primary inline-flex items-center gap-2 px-5">
              <LayoutDashboard size={17} aria-hidden="true" /> Mi resumen
            </Link>
          ) : (
            <>
              <Link href="/ingresar" className="ui-button-secondary border-transparent px-4 hover:border-slate-200">
                Iniciar sesión
              </Link>
              {!compact && <Link href="/registro" className="ui-button-primary px-5">Crear cuenta</Link>}
            </>
          )}
        </div>

        <button
          type="button"
          className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-brand-navy transition hover:bg-slate-50 lg:hidden"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-controls="navegacion-publica-movil"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div id="navegacion-publica-movil" className="border-t border-slate-100 bg-white shadow-card lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-4" aria-label="Navegación móvil">
            {!compact && links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                onClick={() => setOpen(false)}
                className={`rounded-xl px-4 py-3 text-sm font-semibold ${isActive(link.href) ? "bg-brand-gold-soft text-brand-navy" : "text-slate-700 hover:bg-slate-50"}`}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
              {dashboardHref ? (
                <Link href={dashboardHref} onClick={() => setOpen(false)} className="ui-button-primary inline-flex flex-1 items-center justify-center gap-2">
                  <LayoutDashboard size={17} aria-hidden="true" /> Mi resumen
                </Link>
              ) : (
                <>
                  <Link href="/ingresar" onClick={() => setOpen(false)} className="ui-button-secondary flex-1">Iniciar sesión</Link>
                  {!compact && <Link href="/registro" onClick={() => setOpen(false)} className="ui-button-primary flex-1">Crear cuenta</Link>}
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
