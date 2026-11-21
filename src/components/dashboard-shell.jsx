"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  BarChart3,
  Bell,
  BookOpenText,
  BriefcaseBusiness,
  Building2,
  ChevronDown,
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
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { Brand } from "@/components/brand";

const navigation = {
  estudiante: [
    ["/estudiante", "Resumen", LayoutDashboard],
    ["/ofertas", "Explorar ofertas", BriefcaseBusiness],
    ["/estudiante/postulaciones", "Mis postulaciones", ClipboardList],
    ["/estudiante/cuenta", "Mi perfil y CV", FileText],
  ],
  empresa: [
    ["/empresa", "Resumen", LayoutDashboard],
    ["/empresa/ofertas", "Mis ofertas", BriefcaseBusiness],
    ["/empresa/plan", "Plan y promociones", CreditCard],
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
  estudiante: { label: "Panel del estudiante", name: "David Hernández", initials: "DH" },
  empresa: { label: "Panel empresarial", name: "Empresa demostrativa", initials: "ED" },
  admin: { label: "Panel administrativo", name: "Administración", initials: "AD" },
};

export function DashboardShell({ role, title, eyebrow, children }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const meta = roleMeta[role];

  const sidebar = (
    <aside className="flex h-full w-[268px] flex-col border-r border-slate-200 bg-white">
      <div className="flex h-[72px] items-center border-b border-slate-100 px-5"><Brand /></div>
      <div className="px-5 pb-2 pt-6 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">{meta.label}</div>
      <nav className="flex-1 space-y-1 px-3" aria-label={meta.label}>
        {navigation[role].map(([href, label, Icon]) => {
          const active = href === `/${role}` ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                active ? "bg-brand-navy text-white" : "text-slate-600 hover:bg-slate-100 hover:text-brand-navy"
              }`}
            >
              <Icon size={18} /> {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <Link href={`/${role}/cuenta`} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
          <Settings size={18} /> Mi cuenta y seguridad
        </Link>
        <Link href="/ingresar" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100">
          <LogOut size={18} /> Cerrar sesión
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-page">
      <div className="fixed inset-y-0 left-0 z-40 hidden lg:block">{sidebar}</div>
      {menuOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <button className="absolute inset-0 bg-slate-950/40" aria-label="Cerrar navegación" onClick={() => setMenuOpen(false)} />
          <div className="relative h-full w-[268px] shadow-2xl">{sidebar}</div>
        </div>
      )}

      <div className="lg:pl-[268px]">
        <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xl sm:px-7">
          <div className="flex items-center gap-3">
            <button className="grid h-10 w-10 place-items-center rounded-lg border border-slate-200 text-brand-navy lg:hidden" onClick={() => setMenuOpen(true)} aria-label="Abrir navegación">
              <Menu size={20} />
            </button>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-slate-500">{meta.label}</p>
              <p className="text-sm font-semibold text-brand-navy">{title}</p>
            </div>
          </div>
          <div className="relative flex items-center gap-2 sm:gap-4">
            <button
              className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100"
              onClick={() => setNotificationsOpen((value) => !value)}
              aria-expanded={notificationsOpen}
              aria-label="Ver notificaciones"
            >
              <Bell size={20} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-gold ring-2 ring-white" />
            </button>
            <button className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-slate-100">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-navy text-xs font-bold text-white">{meta.initials}</span>
              <span className="hidden text-left md:block">
                <span className="block text-xs font-semibold text-slate-800">{meta.name}</span>
                <span className="block text-[0.7rem] text-slate-500">{role === "admin" ? "Administrador" : role === "empresa" ? "Empresa" : "Estudiante"}</span>
              </span>
              <ChevronDown size={15} className="hidden text-slate-400 md:block" />
            </button>
            {notificationsOpen && (
              <div className="absolute right-0 top-[54px] w-[min(360px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                  <div><p className="text-sm font-semibold text-slate-900">Notificaciones</p><p className="text-xs text-slate-500">Actividad reciente</p></div>
                  <button className="text-xs font-semibold text-brand-navy">Marcar leídas</button>
                </div>
                <div className="p-2">
                  <Notification icon={BookOpenText} title="Tienes una actualización pendiente" text="Consulta los detalles desde tu panel." />
                  <Notification icon={UserRound} title="Tu cuenta está lista" text="Completa la información de tu perfil." />
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="px-4 py-7 sm:px-7 lg:px-9 lg:py-9">
          <div className="mx-auto max-w-[1240px]">
            <div className="mb-7">
              {eyebrow && <p className="mb-1 text-sm font-semibold text-brand-gold">{eyebrow}</p>}
              <h1 className="text-2xl font-bold tracking-[-0.03em] text-brand-navy sm:text-[2rem]">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function Notification({ icon: Icon, title, text }) {
  return (
    <button className="flex w-full gap-3 rounded-lg p-3 text-left hover:bg-slate-50">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-gold-soft text-[#7b5d16]"><Icon size={17} /></span>
      <span><span className="block text-sm font-semibold text-slate-800">{title}</span><span className="block text-xs leading-5 text-slate-500">{text}</span></span>
    </button>
  );
}
