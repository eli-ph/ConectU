"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Award,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Building2,
  CircleUserRound,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShieldCheck,
  Tags,
  UsersRound,
  X,
} from "lucide-react";
import { Brand } from "@/components/brand";

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
    name: "David Hernández",
    subrole: "Estudiante",
    initials: "DH",
  },
  empresa: {
    label: "Panel empresarial",
    name: "TechCorp Global",
    subrole: "Recursos Humanos",
    initials: "TG",
  },
  admin: {
    label: "Panel administrativo",
    name: "Administración",
    subrole: "Administrador",
    initials: "AD",
  },
};

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
  const [notificationFilter, setNotificationFilter] = useState("todas");
  const meta = roleMeta[role];

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
        <Link
          href={`/${role}/cuenta`}
          onClick={() => setMenuOpen(false)}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
        >
          <Settings size={18} /> Mi cuenta y seguridad
        </Link>
        <Link
          href="/ingresar"
          onClick={() => setMenuOpen(false)}
          className="flex min-h-11 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
        >
          <LogOut size={18} /> Cerrar sesión
        </Link>
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
            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-brand-navy"
              onClick={() => setNotificationsOpen((value) => !value)}
              aria-expanded={notificationsOpen}
              aria-label="Ver notificaciones"
              aria-controls="popover-notificaciones"
            >
              <Bell size={20} />
            </button>
            <Link
              href={`/${role}/cuenta`}
              className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-100"
              aria-label="Abrir mi cuenta"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-navy text-xs font-bold text-white ring-2 ring-brand-gold/20">
                {meta.initials}
              </span>
              <span className="hidden max-w-36 min-w-0 text-left md:block">
                <span className="block truncate text-xs font-bold text-slate-800">
                  {meta.name}
                </span>
                <span className="block text-[0.7rem] text-slate-500">
                  {meta.subrole}
                </span>
              </span>
            </Link>

            {notificationsOpen && (
              <div
                id="popover-notificaciones"
                className="absolute right-0 top-[58px] z-50 w-[min(370px,calc(100vw-1.5rem))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-raised"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-4">
                  <div>
                    <p className="text-sm font-bold text-brand-navy">
                      Notificaciones
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Avisos de la plataforma
                    </p>
                  </div>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-lg text-slate-500 hover:bg-slate-100"
                    aria-label="Cerrar notificaciones"
                    onClick={() => setNotificationsOpen(false)}
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-2.5">
                  <div
                    className="flex gap-1 rounded-lg bg-slate-100 p-1"
                    role="group"
                    aria-label="Filtrar notificaciones"
                  >
                    {["todas", "no-leidas"].map((filter) => (
                      <button
                        type="button"
                        key={filter}
                        aria-pressed={notificationFilter === filter}
                        onClick={() => setNotificationFilter(filter)}
                        className={`rounded-md px-3 py-1.5 text-xs font-semibold transition ${
                          notificationFilter === filter
                            ? "bg-white text-brand-navy shadow-sm"
                            : "text-slate-500 hover:text-brand-navy"
                        }`}
                      >
                        {filter === "todas" ? "Todas" : "No leídas"}
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    disabled
                    className="text-xs font-semibold text-slate-400"
                    title="No hay notificaciones que marcar como leídas"
                  >
                    Marcar leídas
                  </button>
                </div>
                <div className="px-5 py-8 text-center">
                  <Bell className="mx-auto text-slate-300" size={27} />
                  <p className="mt-3 text-sm font-semibold text-slate-700">
                    Sin notificaciones
                  </p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Los avisos aparecerán aquí cuando se habilite la información
                    real de la plataforma.
                  </p>
                </div>
              </div>
            )}
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