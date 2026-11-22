"use client";

import { useMemo, useState } from "react";
import {
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Gift,
  ReceiptText,
  RotateCcw,
  Search,
  ShieldCheck,
} from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

// Registros de ejemplo procedentes de la versión inicial del repositorio.
// Los importes se ajustaron a las tarifas ilustrativas definidas para ConectU.
// No se deben presentar como cobros reales ni utilizar para calcular los KPIs.
const examplePurchases = [
  {
    id: "CMP-1005",
    company: "Empresa demostrativa",
    concept: "Plan Básico",
    description: "Periodo de 30 días",
    category: "plan",
    date: "2026-11-20",
    amountCents: 9900,
    status: "confirmado",
    paymentMethod: null,
  },
  {
    id: "CMP-1004",
    company: "Organización ejemplo",
    concept: "Promoción de 15 días",
    description: "Promoción adicional",
    category: "promocion",
    date: "2026-11-18",
    amountCents: 6900,
    status: "confirmado",
    paymentMethod: null,
  },
  {
    id: "CMP-1003",
    company: "Industria demostrativa",
    concept: "Plan Premium",
    description: "Periodo de 30 días",
    category: "plan",
    date: "2026-11-17",
    amountCents: 24900,
    status: "confirmado",
    paymentMethod: null,
  },
  {
    id: "CMP-1002",
    company: "Estudio demostrativo",
    concept: "Promoción de 7 días",
    description: "Promoción adicional",
    category: "promocion",
    date: "2026-11-16",
    amountCents: 3900,
    status: "reembolsado",
    paymentMethod: null,
  },
];

const normalize = (text) => String(text ?? "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase();

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function dateAsLocal(value) {
  return new Date(`${value}T12:00:00`);
}

function inPeriod(dateText, period) {
  if (period === "todos") return true;
  const date = dateAsLocal(dateText);
  const now = new Date();
  if (period === "actual") {
    return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }
  if (period === "anterior") {
    const previous = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return date.getFullYear() === previous.getFullYear() && date.getMonth() === previous.getMonth();
  }
  if (period === "30dias") {
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    return date >= start && date < end;
  }
  return true;
}

function initials(name) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

function KpiCard({ label, icon: Icon, detail, footnote, showTrack = false }) {
  return (
    <article className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
      <div className="flex min-h-9 items-start justify-between gap-3">
        <h2 className="pt-1 text-[11px] font-extrabold uppercase leading-[1.35] tracking-[0.045em] text-slate-700">{label}</h2>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-[#eef0ff] text-brand-navy">
          <Icon size={18} aria-hidden="true" />
        </span>
      </div>
      <div className="mt-auto pt-3">
        <p className="text-[2rem] font-extrabold leading-none tracking-[-0.05em] text-brand-navy sm:text-[2.2rem]" aria-label={`${label}: sin datos conectados`}>—</p>
        <p className="mt-3 text-xs leading-5 text-slate-600">{detail}</p>
        {showTrack && <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100" aria-hidden="true" />}
        <p className="mt-2 min-h-4 text-[11px] leading-4 text-slate-500">{footnote}</p>
      </div>
    </article>
  );
}

function StatusPill({ status }) {
  const states = {
    confirmado: "bg-emerald-50 text-emerald-700",
    reembolsado: "bg-amber-50 text-amber-800",
    pendiente: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-semibold ${states[status] || states.pendiente}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${status === "confirmado" ? "bg-emerald-500" : status === "reembolsado" ? "bg-amber-500" : "bg-slate-400"}`} />
      {status === "confirmado" ? "Confirmado" : status === "reembolsado" ? "Reembolsado" : "Pendiente"}
    </span>
  );
}

function CompanyCell({ purchase }) {
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#e8edff] text-[11px] font-bold text-brand-navy">
        {initials(purchase.company)}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-5 text-brand-navy">{purchase.company}</p>
        <p className="mt-0.5 text-[11px] text-slate-500">Referencia: {purchase.id}</p>
      </div>
    </div>
  );
}

function MobilePurchase({ purchase }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <CompanyCell purchase={purchase} />
        <StatusPill status={purchase.status} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 text-xs">
        <div>
          <p className="font-semibold uppercase tracking-wide text-slate-500">Fecha</p>
          <p className="mt-1 text-slate-700">{dateFormatter.format(dateAsLocal(purchase.date))}</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wide text-slate-500">Importe</p>
          <p className="mt-1 font-bold text-brand-navy">{money.format(purchase.amountCents / 100)}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold uppercase tracking-wide text-slate-500">Concepto</p>
          <p className="mt-1 font-semibold text-slate-800">{purchase.concept}</p>
          <p className="mt-0.5 text-slate-500">{purchase.description}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold uppercase tracking-wide text-slate-500">Medio de pago</p>
          <p className="mt-1 text-slate-600">{purchase.paymentMethod || "—"}</p>
        </div>
      </div>
    </article>
  );
}

export default function AdminPurchasesPage() {
  const [period, setPeriod] = useState("todos");
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("todos");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const purchases = useMemo(() => {
    const term = normalize(query.trim());
    return examplePurchases.filter((purchase) => {
      const matchesQuery = !term || normalize(`${purchase.company} ${purchase.id} ${purchase.concept}`).includes(term);
      const matchesStatus = status === "todos" || status === purchase.status;
      return matchesQuery && matchesStatus && inPeriod(purchase.date, period);
    });
  }, [period, query, status]);

  const pages = Math.max(1, Math.ceil(purchases.length / pageSize));
  const currentPage = Math.min(page, pages);
  const visible = purchases.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const first = purchases.length ? (currentPage - 1) * pageSize + 1 : 0;
  const last = Math.min(currentPage * pageSize, purchases.length);
  const reset = () => { setPeriod("todos"); setQuery(""); setStatus("todos"); setPage(1); };

  return (
    <DashboardShell role="admin" title="Consulta de compras empresariales" eyebrow="Operaciones comerciales">
      <div className="-mt-3 mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <p className="max-w-2xl text-sm leading-6 text-slate-600">
          Registro consolidado y seguimiento de compras de planes y promociones realizadas por empresas.
        </p>
        <label className="flex w-full shrink-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 shadow-sm sm:w-fit">
          <CalendarDays size={17} className="text-brand-navy" aria-hidden="true" />
          <span className="text-xs font-bold text-slate-700">Periodo:</span>
          <select
            aria-label="Periodo de las transacciones"
            className="min-w-0 flex-1 bg-[#f2f3fc] px-3 py-2 text-xs font-semibold text-brand-navy outline-none sm:flex-none"
            value={period}
            onChange={(event) => { setPeriod(event.target.value); setPage(1); }}
          >
            <option value="todos">Todo el historial</option>
            <option value="actual">Mes actual</option>
            <option value="anterior">Mes anterior</option>
            <option value="30dias">Últimos 30 días</option>
          </select>
        </label>
      </div>

      <section aria-label="Indicadores de compras" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        <KpiCard label="Ganancias" icon={Banknote} detail="MXN" footnote="Ingresos del periodo seleccionado" />
        <KpiCard label="Planes contratados" icon={CreditCard} detail="Planes Básico y Premium" footnote="Contrataciones del periodo" />
        <KpiCard label="Promociones adquiridas" icon={Gift} detail="Promociones de 7, 15 y 30 días" footnote="Compras del periodo" />
        <KpiCard label="Efectividad de cobro" icon={ShieldCheck} detail="Operaciones de pago" footnote="Indicador pendiente de datos" showTrack />
      </section>

      <section aria-label="Filtros de transacciones" className="mt-5 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-soft sm:p-4 lg:flex-row lg:items-center lg:justify-between">
        <label className="relative block min-w-0 flex-1 lg:max-w-[440px]">
          <span className="sr-only">Buscar por empresa, referencia o concepto</span>
          <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => { setQuery(event.target.value); setPage(1); }}
            placeholder="Buscar por empresa o referencia..."
            className="h-11 w-full rounded-lg border border-transparent bg-[#f3f4fd] pl-11 pr-3 text-sm text-brand-navy outline-none placeholder:text-slate-500 focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10"
          />
        </label>
        <div className="flex min-w-0 items-center gap-2 sm:justify-end">
          <label htmlFor="purchase-status" className="shrink-0 text-xs font-semibold text-slate-700">Filtrar estado:</label>
          <select
            id="purchase-status"
            value={status}
            onChange={(event) => { setStatus(event.target.value); setPage(1); }}
            className="h-11 min-w-0 flex-1 rounded-lg border border-slate-200 bg-[#f3f4fd] px-3 text-xs font-semibold text-brand-navy outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10 sm:flex-none"
          >
            <option value="todos">Todos los estados</option>
            <option value="confirmado">Confirmados</option>
            <option value="reembolsado">Reembolsados</option>
          </select>
          <button type="button" aria-label="Restablecer filtros" title="Restablecer filtros" onClick={reset} className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#f3f4fd] text-brand-navy transition hover:bg-[#e7ecfc]">
            <RotateCcw size={18} aria-hidden="true" />
          </button>
        </div>
      </section>

      <section aria-labelledby="compras-title" className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3 bg-[#f1f2fc] px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <h2 id="compras-title" className="text-sm font-bold text-brand-navy sm:text-base">Registro consolidado de transacciones</h2>
            <span className="rounded-full bg-[#e7ebfb] px-2.5 py-1 text-[11px] font-semibold text-brand-navy">{purchases.length} ejemplos en lista</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <ReceiptText size={15} aria-hidden="true" /> Consulta de movimientos
          </div>
        </div>

        <div className="hidden overflow-x-auto xl:block">
          <table className="conectu-table w-full min-w-[880px] border-collapse text-left text-xs">
            <thead className="border-y border-slate-200 bg-[#f6f7fd] text-[10px] font-bold uppercase tracking-[0.055em] text-slate-600">
              <tr>
                <th scope="col" className="w-[27%] px-5 py-3.5">Empresa</th>
                <th scope="col" className="w-[13%] px-3 py-3.5">Fecha</th>
                <th scope="col" className="w-[23%] px-3 py-3.5">Concepto</th>
                <th scope="col" className="w-[12%] px-3 py-3.5 text-right">Importe</th>
                <th scope="col" className="w-[13%] px-3 py-3.5">Estado</th>
                <th scope="col" className="w-[12%] px-5 py-3.5">Medio de pago</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visible.map((purchase) => (
                <tr key={purchase.id} className="transition hover:bg-[#f9faff]">
                  <td className="px-5 py-4"><CompanyCell purchase={purchase} /></td>
                  <td className="px-3 py-4 text-xs font-medium text-slate-600">{dateFormatter.format(dateAsLocal(purchase.date))}</td>
                  <td className="px-3 py-4">
                    <span className="block font-semibold text-slate-800">{purchase.concept}</span>
                    <span className="mt-1 block text-[11px] leading-4 text-slate-500">{purchase.description}</span>
                  </td>
                  <td className="px-3 py-4 text-right">
                    <span className="whitespace-nowrap text-sm font-extrabold text-brand-navy">{money.format(purchase.amountCents / 100)}</span>
                  </td>
                  <td className="px-3 py-4">
                    <StatusPill status={purchase.status} />
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {purchase.paymentMethod ? <span className="inline-flex items-center gap-2"><CreditCard size={15} />{purchase.paymentMethod}</span> : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="space-y-3 bg-[#f8f9ff] p-3 xl:hidden">
          {visible.map((purchase) => <MobilePurchase key={purchase.id} purchase={purchase} />)}
        </div>
        {visible.length === 0 && (
          <div className="px-6 py-12 text-center text-sm text-slate-500">No se encontraron movimientos con estos filtros.</div>
        )}

        <div className="flex flex-col items-start justify-between gap-3 border-t border-slate-200 bg-[#f3f4fc] px-4 py-3.5 text-xs text-slate-600 sm:flex-row sm:items-center sm:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <span>Mostrando {first}–{last} de {purchases.length} ejemplos</span>
            <label className="flex items-center gap-2">
              Filas por página
              <select value={pageSize} onChange={(event) => { setPageSize(Number(event.target.value)); setPage(1); }} className="rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-brand-navy">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>
          <nav aria-label="Páginas de transacciones" className="flex items-center gap-1.5">
            <button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)} aria-label="Página anterior" className="grid h-9 w-9 place-items-center rounded-lg bg-white text-brand-navy transition hover:bg-slate-100 disabled:opacity-40"><ChevronLeft size={16} /></button>
            <span aria-current="page" className="grid h-9 min-w-9 place-items-center rounded-lg bg-brand-navy px-2 text-xs font-bold text-white">{currentPage}</span>
            <span className="px-1 text-xs text-slate-500">/ {pages}</span>
            <button type="button" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)} aria-label="Página siguiente" className="grid h-9 w-9 place-items-center rounded-lg bg-white text-brand-navy transition hover:bg-slate-100 disabled:opacity-40"><ChevronRight size={16} /></button>
          </nav>
        </div>
      </section>
    </DashboardShell>
  );
}
