"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Award,
  BarChart3,
  BriefcaseBusiness,
  Building2,
  CircleUserRound,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Tags,
  UsersRound,
  X,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { NotificationBell } from "@/components/notification-bell";

const navigation = {
  estudiante: [
    ["/estudiante", "Resumen", LayoutDashboard],
    ["/estudiante/postulaciones", "Mis postulaciones", ClipboardList],
    ["/estudiante/cuenta", "Mi cuenta", FileText],
  ],
  empresa: [
    ["/empresa", "Resumen", LayoutDashboard],
    ["/empresa/ofertas", "Mis ofertas", BriefcaseBusiness],
    ["/empresa/plan", "Plan y promociones", Award],
    ["/empresa/compras", "Compras", ClipboardList],
    ["/empresa/estadisticas", "Estadísticas", BarChart3],
    ["/empresa/cuenta", "Mi cuenta", CircleUserRound],
  ],
  admin: [
    ["/admin", "Resumen", LayoutDashboard],
    ["/admin/empresas", "Empresas", Building2],
    ["/admin/ofertas", "Moderación de ofertas", ShieldCheck],
    ["/admin/usuarios", "Usuarios", UsersRound],
    ["/admin/compras", "Compras", CreditCard],
    ["/admin/catalogos", "Catálogos", Tags],
  ],
};

const roleMeta = {
  estudiante: {
    label: "Panel del estudiante",
    subrole: "Estudiante",
  },
  empresa: {
    label: "Panel empresarial",
    subrole: "Empresa",
  },
  admin: {
    label: "Panel administrativo",
    subrole: "Administrador",
  },
};

function identidadUsuario(user, role) {
  if (!user || user.rol !== role) return null;
  const nombre = typeof user.nombre === "string" ? user.nombre.trim() : "";
  const apellidos = typeof user.apellidos === "string" ? user.apellidos.trim() : "";
  const name = [nombre, apellidos].filter(Boolean).join(" ").replace(/\s+/g, " ");
  if (!name) return null;
  const partes = name.split(" ");
  const initials = [partes[0], apellidos ? apellidos.split(/\s+/)[0] : partes[1]]
    .filter(Boolean).map(parte => Array.from(parte)[0]).join("").toUpperCase();
  return { name, initials };
}

export function DashboardShell({
  role,
  title,
  eyebrow,
  description,
  badge,
  hidePageHeader = false,
  children,
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [closingSession, setClosingSession] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const logoutPending = useRef(false);
  const meta = roleMeta[role];
  const [sessionIdentity, setSessionIdentity] = useState(null);
  const identity = sessionIdentity?.pathname === pathname && sessionIdentity?.role === role
    ? sessionIdentity.identity : null;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function cargarIdentidad() {
      try {
        const response = await fetch("/api/auth/me", {
          cache: "no-store",
          credentials: "same-origin",
          signal: controller.signal,
        });
        const data = response.ok ? await response.json() : null;
        if (!active) return;
        setSessionIdentity({ pathname, role, identity: data?.ok ? identidadUsuario(data.user, role) : null });
      } catch {
        if (active) setSessionIdentity(null);
      }
    }

    cargarIdentidad();
    return () => {
      active = false;
      controller.abort();
    };
  }, [pathname, role]);

  useEffect(() => {
    if (!menuOpen && !notificationsOpen) return;
    const onEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setNotificationsOpen(false);
      }
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [menuOpen, notificationsOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  async function cerrarSesion() {
    if (logoutPending.current) return;
    logoutPending.current = true;
    setClosingSession(true);
    setLogoutError("");
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok || data?.ok !== true) {
        throw new Error(data?.message || "No se pudo cerrar la sesión.");
      }
      // Navegación completa: descarta el estado y la caché de rutas del panel.
      window.location.replace("/ingresar");
    } catch (error) {
      setLogoutError(error?.message || "No se pudo cerrar la sesión. Intenta nuevamente.");
      logoutPending.current = false;
      setClosingSession(false);
    }
  }

  const isActive = (href) =>
    href === `/${role}` ? pathname === href : pathname.startsWith(href);

  const sidebar = (
    <aside className="flex h-full w-[min(17rem,85vw)] flex-col overflow-y-auto border-r border-slate-200 bg-white lg:w-68">
      <div className="flex min-h-[76px] items-center border-b border-slate-100 px-5">
        <Brand />
      </div>
      <p className="px-5 pb-3 pt-7 text-[0.68rem] font-bold uppercase tracking-[0.13em] text-slate-400">
        {meta.label}
      </p>
      <nav className="flex-1 space-y-1 px-3" aria-label={meta.label}>
        {navigation[role].map(([href, label, Icon]) => (
          <Link
            key={href}
            href={href}
            prefetch={href === "/empresa/estadisticas" ? false : undefined}
            aria-current={isActive(href) ? "page" : undefined}
            onClick={() => setMenuOpen(false)}
            className={`flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-colors ${
              isActive(href)
                ? "bg-brand-navy text-white shadow-soft"
                : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
            }`}
          >
            <Icon size={18} className="shrink-0" aria-hidden="true" />
            <span className="min-w-0 flex-1">{label}</span>
            {isActive(href) && (
              <span
                className="h-1.5 w-1.5 rounded-full bg-brand-gold"
                aria-hidden="true"
              />
            )}
          </Link>
        ))}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={cerrarSesion}
          disabled={closingSession}
          aria-busy={closingSession}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-navy disabled:cursor-wait disabled:opacity-60"
        >
          <LogOut size={18} aria-hidden="true" /> {closingSession ? "Cerrando sesión…" : "Cerrar sesión"}
        </button>
        {logoutError && (
          <p role="alert" className="px-3.5 pt-2 text-xs text-red-700">{logoutError}</p>
        )}
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-page">
      <a
        href="#contenido-principal"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[90] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-brand-navy"
      >
        Saltar al contenido
      </a>

      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-[2px]"
            aria-label="Cerrar navegación"
            onClick={() => setMenuOpen(false)}
          />
          <div className="relative h-full w-fit shadow-raised">
            {sidebar}
            <button
              type="button"
              className="absolute right-2 top-4 grid h-10 w-10 place-items-center rounded-lg bg-white text-brand-navy shadow-sm"
              onClick={() => setMenuOpen(false)}
              aria-label="Cerrar menú lateral"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      <div className="min-w-0 lg:pl-68">
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-3 border-b border-slate-200/90 bg-white/95 px-4 py-2 shadow-[0_1px_8px_rgba(20,43,73,0.03)] backdrop-blur-xl sm:px-6 xl:px-9">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-slate-200 text-brand-navy lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir navegación"
              aria-expanded={menuOpen}
            >
              <Menu size={21} />
            </button>
            <div className="min-w-0">
              {!hidePageHeader && (
                <p className="hidden text-xs font-medium text-slate-500 sm:block">
                  {meta.label}
                </p>
              )}
              <div className="flex items-center gap-2.5">
                <p className="truncate text-sm font-bold text-brand-navy sm:text-base">
                  {title}
                </p>
                {badge && (
                  <span className="rounded-md bg-brand-gold-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#765600]">
                    {badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="relative flex shrink-0 items-center gap-1.5 sm:gap-3">
            {role === "estudiante" && (
              <Link
                href="/ofertas"
                aria-label="Explorar ofertas"
                title="Explorar ofertas"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-brand-navy bg-brand-navy px-3 text-sm font-semibold text-white transition hover:bg-brand-navy-light sm:px-4"
              >
                <BriefcaseBusiness
                  size={18}
                  className="shrink-0"
                  aria-hidden="true"
                />
                <span className="hidden sm:inline">Explorar ofertas</span>
              </Link>
            )}
            <NotificationBell open={notificationsOpen} onToggle={() => setNotificationsOpen(v => !v)} onClose={() => setNotificationsOpen(false)} />
            <Link
              href={`/${role}/cuenta`}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
              aria-label={identity ? `Abrir mi cuenta: ${identity.name}` : "Abrir mi cuenta"}
              title={identity?.name || meta.subrole}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-navy text-xs font-bold text-white ring-2 ring-brand-gold/20">
                {identity?.initials || <CircleUserRound size={18} aria-hidden="true" />}
              </span>
              <span className="hidden max-w-36 min-w-0 text-left md:block">
                <span className="block truncate text-xs font-bold text-slate-800">
                  {identity?.name || meta.subrole}
                </span>
                <span className="block text-[0.7rem] text-slate-500">
                  {meta.subrole}
                </span>
              </span>
            </Link>

            
          </div>
        </header>

        <main
          id="contenido-principal"
          className="min-w-0 px-4 py-6 sm:px-6 sm:py-8 xl:px-9 xl:py-9"
        >
          <div className="mx-auto w-full min-w-0 max-w-[1440px]">
            {!hidePageHeader && (
              <div className="mb-6 sm:mb-8">
                {eyebrow && <p className="ui-eyebrow mb-2">{eyebrow}</p>}
                <h1 className="ui-heading text-2xl sm:text-3xl">{title}</h1>
                {description && (
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-500">
                    {description}
                  </p>
                )}
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}