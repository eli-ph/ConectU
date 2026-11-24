"use client";

import { useEffect, useMemo, useState } from "react";
import { Eye, GraduationCap, LockKeyhole, RotateCcw, Search, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { consultarAdministracion } from "@/components/admin/admin-api";
import { DashboardShell } from "@/components/dashboard-shell";
import { TablePagination } from "@/components/table-pagination";
import { UserDetailsModal, UserManagementModal } from "@/components/admin/user-management-modal";

const tabs = [
  { value: "todos", label: "Todos los usuarios" },
  { value: "estudiante", label: "Estudiantes" },
  { value: "administrador", label: "Administradores" },
];

const roleStyles = {
  estudiante: { text: "Estudiante", icon: GraduationCap, pill: "bg-[#e7ecff] text-[#23456f]", avatar: "bg-[#e8edff] text-brand-navy" },
  administrador: { text: "Administrador", icon: ShieldCheck, pill: "bg-brand-navy text-white", avatar: "bg-brand-navy text-white" },
};

const statusStyles = {
  activo: { text: "Activo", dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-800" },
  pendiente: { text: "Pendiente", dot: "bg-amber-500", pill: "bg-amber-50 text-amber-800" },
  suspendido: { text: "Suspendido", dot: "bg-red-500", pill: "bg-red-50 text-red-800" },
};

const normalize = (value) => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const initials = (name) => name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

function RoleBadge({ role }) {
  const meta = roleStyles[role];
  const Icon = meta.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${meta.pill}`}>
      <Icon size={13} aria-hidden="true" /> {meta.text}
    </span>
  );
}

function StatusBadge({ status }) {
  const meta = statusStyles[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-semibold ${meta.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} aria-hidden="true" /> {meta.text}
    </span>
  );
}

function UserIdentity({ user }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xs font-extrabold ${roleStyles[user.role].avatar}`}>
        {initials(user.name)}
      </span>
      <div className="min-w-0">
        <p className="break-words text-sm font-bold leading-5 text-brand-navy">{user.name}</p>
        <p className="mt-0.5 text-[11px] leading-4 text-slate-500">{user.identifier ? `Identificador: ${user.identifier}` : roleStyles[user.role].text}</p>
      </div>
    </div>
  );
}

function UserActions({ user, onView, onManage }) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <button type="button" onClick={() => onView(user)} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-[#f1f3fb] px-3 py-2 text-[12px] font-semibold text-brand-navy transition hover:bg-[#e6ebfb]">
        <Eye size={15} aria-hidden="true" /> Ver usuario
      </button>
      <button type="button" disabled={user.own} onClick={() => onManage(user)} className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg bg-brand-navy px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-brand-navy-light">
        <LockKeyhole size={14} aria-hidden="true" /> Gestionar usuario
      </button>
    </div>
  );
}

function MobileUser({ user, onView, onManage }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <UserIdentity user={user} />
        <StatusBadge status={user.status} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2"><RoleBadge role={user.role} /></div>
      <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs">
        <p className="break-all text-slate-700"><span className="font-semibold text-slate-500">Correo:</span> {user.email}</p>
        <p className="text-slate-700"><span className="font-semibold text-slate-500">Registro:</span> {user.registeredAt || "—"}</p>
      </div>
      <div className="mt-4 border-t border-slate-100 pt-3"><UserActions user={user} onView={onView} onManage={onManage} /></div>
    </article>
  );
}

export default function AdminUsersPage() {
  const [users,setUsers]=useState([]);
  const [loadState,setLoadState]=useState("Cargando usuarios…");
  useEffect(()=>{const controller=new AbortController();consultarAdministracion("usuarios",controller.signal).then(d=>{setUsers(d.usuarios);setLoadState("");}).catch(e=>{if(!controller.signal.aborted)setLoadState(e.message);});return ()=>controller.abort();},[]);
  const [role, setRole] = useState("todos");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [moreFilters, setMoreFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState("original");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [detailsUser, setDetailsUser] = useState(null);
  const [managedUser, setManagedUser] = useState(null);

  const filteredUsers = useMemo(() => {
    const needle = normalize(query.trim());
    const list = users.filter((user) => {
      const matchesRole = role === "todos" || user.role === role;
      const matchesStatus = !status || user.status === status;
      const matchesQuery = !needle || normalize([user.name, user.email, user.identifier, roleStyles[user.role].text].join(" ")).includes(needle);
      return matchesRole && matchesStatus && matchesQuery;
    });
    if (sortOrder === "nombre-asc") list.sort((a, b) => a.name.localeCompare(b.name, "es"));
    if (sortOrder === "nombre-desc") list.sort((a, b) => b.name.localeCompare(a.name, "es"));
    return list;
  }, [users, query, role, status, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const visibleUsers = filteredUsers.slice((safePage - 1) * pageSize, safePage * pageSize);

  const resetPage = () => setPage(1);
  const resetFilters = () => { setRole("todos"); setQuery(""); setStatus(""); setSortOrder("original"); setPage(1); };

  return (
    <DashboardShell role="admin" title="Directorio y administración de usuarios" eyebrow="Gestión de cuentas">
      <div className="-mt-3 mb-6 max-w-3xl text-sm leading-6 text-slate-600">
        Consulta las cuentas de estudiantes y administradores, y administra su acceso a ConectU.
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_4px_18px_rgba(20,43,73,0.045)] sm:p-5">
        <div className="flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filtrar usuarios por rol">
          {tabs.map((tab) => (
            <button
              key={tab.value} type="button" role="tab" aria-selected={role === tab.value}
              onClick={() => { setRole(tab.value); resetPage(); }}
              className={`min-h-10 shrink-0 whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition ${role === tab.value ? "bg-brand-navy text-white shadow-sm" : "bg-[#f4f5fc] text-slate-600 hover:bg-[#e9edfa] hover:text-brand-navy"}`}
            >{tab.label}</button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_220px_auto_auto]">
          <label className="relative block min-w-0">
            <span className="sr-only">Buscar usuarios</span>
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" aria-hidden="true" />
            <input
              value={query} onChange={(event) => { setQuery(event.target.value); resetPage(); }}
              type="search" placeholder="Buscar por nombre, correo o identificador"
              className="h-11 w-full rounded-lg border border-slate-200 bg-[#f5f6fd] pl-11 pr-3 text-sm text-brand-navy outline-none placeholder:text-slate-400 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
            />
          </label>
          <label className="min-w-0">
            <span className="sr-only">Filtrar por estado</span>
            <select value={status} onChange={(event) => { setStatus(event.target.value); resetPage(); }} className="h-11 w-full rounded-lg border border-slate-200 bg-[#f5f6fd] px-3 text-sm text-brand-navy outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10">
              <option value="">Todos los estados</option>
              <option value="activo">Activo</option>
              <option value="pendiente">Pendiente</option>
              <option value="suspendido">Suspendido</option>
            </select>
          </label>
          <button type="button" aria-expanded={moreFilters} onClick={() => setMoreFilters(!moreFilters)} className={`inline-flex h-11 items-center justify-center gap-2 rounded-lg border px-4 text-xs font-bold transition ${moreFilters ? "border-brand-navy bg-[#e9eef9] text-brand-navy" : "border-slate-200 bg-[#f5f6fd] text-slate-700 hover:bg-[#ebeffa]"}`}>
            <SlidersHorizontal size={16} aria-hidden="true" /> Más filtros
          </button>
          <button type="button" aria-label="Restablecer filtros" title="Restablecer filtros" onClick={resetFilters} className="grid h-11 w-full place-items-center rounded-lg border border-slate-200 bg-[#f5f6fd] text-brand-navy transition hover:bg-[#e9eef9] md:w-11"><RotateCcw size={17} /></button>
        </div>
        {moreFilters && (
          <div className="mt-3 rounded-xl border border-slate-200 bg-[#f8f9fd] p-3">
            <label className="flex flex-col gap-2 text-xs font-bold text-slate-600 sm:max-w-xs">
              Ordenar resultados
              <select value={sortOrder} onChange={(event) => { setSortOrder(event.target.value); resetPage(); }} className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-brand-navy outline-none focus:border-brand-navy">
                <option value="original">Orden original</option>
                <option value="nombre-asc">Nombre (A–Z)</option>
                <option value="nombre-desc">Nombre (Z–A)</option>
              </select>
            </label>
          </div>
        )}
      </section>

      {loadState && <p role="status" className="mb-4 rounded-lg border border-slate-200 bg-white p-3 text-sm text-slate-600">{loadState}</p>}
      <section aria-label="Listado de usuarios" className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_5px_24px_rgba(20,43,73,0.045)]">
        <div className="hidden overflow-x-auto lg:block">
          <table className="conectu-table w-full min-w-[940px] border-collapse text-left text-[12px]">
            <thead className="bg-[#f1f3fc] text-[10px] font-bold uppercase tracking-[0.05em] text-slate-600">
              <tr>
                <th scope="col" className="px-4 py-4">Usuario e identificador</th>
                <th scope="col" className="px-4 py-4">Correo electrónico</th>
                <th scope="col" className="px-4 py-4">Rol en el sistema</th>
                <th scope="col" className="px-4 py-4">Registro / Último acceso</th>
                <th scope="col" className="px-4 py-4">Estado</th>
                <th scope="col" className="px-4 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visibleUsers.map((user) => (
                <tr key={user.id} className="transition hover:bg-[#f8faff]">
                  <td className="px-4 py-4"><UserIdentity user={user} /></td>
                  <td className="max-w-48 break-all px-4 py-4 text-slate-600">{user.email}</td>
                  <td className="px-4 py-4"><RoleBadge role={user.role} /></td>
                  <td className="px-4 py-4 text-slate-500"><span className="block">{user.registeredAt || "—"}</span><span className="mt-1 block text-[11px]">{user.lastAccess || "Último acceso: —"}</span></td>
                  <td className="px-4 py-4"><StatusBadge status={user.status} /></td>
                  <td className="px-4 py-4"><UserActions user={user} onView={setDetailsUser} onManage={setManagedUser} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space-y-3 bg-[#f8faff] p-3 lg:hidden">
          {visibleUsers.map((user) => <MobileUser key={user.id} user={user} onView={setDetailsUser} onManage={setManagedUser} />)}
        </div>
        {visibleUsers.length === 0 && <div className="px-5 py-12 text-center text-sm text-slate-500">No hay usuarios que coincidan con los filtros.</div>}
        <TablePagination
          page={safePage} pages={totalPages} onChange={setPage}
          total={filteredUsers.length} pageSize={pageSize}
          onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
          label="usuarios"
        />
      </section>

      <UserDetailsModal user={detailsUser} onClose={() => setDetailsUser(null)} onManage={(user) => { setDetailsUser(null); setManagedUser(user); }} />
      <UserManagementModal user={managedUser} onClose={() => setManagedUser(null)} onSaved={(data)=>{setUsers(data.usuarios);setManagedUser(null);}} />
    </DashboardShell>
  );
}
