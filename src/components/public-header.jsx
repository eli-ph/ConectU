"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Brand } from "@/components/brand";

const links = [
  { href: "/", label: "Inicio" },
  { href: "/ofertas", label: "Explorar ofertas" },
  { href: "/planes", label: "Planes para empresas" },
];

export function PublicHeader({ compact = false }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl">
      <div className="container-page flex h-[64px] items-center justify-between gap-5">
        <Brand />

        {!compact && (
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegación principal">
            {links.map((link) => {
              const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    active ? "text-brand-navy" : "text-slate-600 hover:text-brand-navy"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="hidden items-center gap-3 sm:flex">
          <Link href="/ingresar" className="rounded-lg px-4 py-2.5 text-sm font-semibold text-brand-navy hover:bg-slate-100">
            Iniciar sesión
          </Link>
          {!compact && (
            <Link href="/registro" className="rounded-lg bg-brand-navy px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-navy-light">
              Crear cuenta
            </Link>
          )}
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-brand-navy sm:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
        >
          {open ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navegación móvil">
            {!compact && links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
                {link.label}
              </Link>
            ))}
            <Link href="/ingresar" onClick={() => setOpen(false)} className="mt-2 rounded-lg bg-brand-navy px-3 py-2.5 text-center text-sm font-semibold text-white">
              Iniciar sesión
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
