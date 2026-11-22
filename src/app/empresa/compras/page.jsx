"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";

const transactions = [
  {
    id: "trx-94821",
    date: "12 Ene 2025",
    time: "10:14 hrs",
    title: "Suscripción Plan Básico (30 días)",
    folio: "Folio: #TRX-94821",
    vacancy: "",
    status: "Liquidado",
    statusTone: "indigo",
    gateway: "Stripe Payments MX",
    paymentMethod: "(Mastercard *4812)",
    amount: "$99.00",
    strikethrough: false,
  },
  {
    id: "trx-91204",
    date: "05 Ene 2025",
    time: "16:30 hrs",
    title: "Promoción Adicional 15 días",
    folio: "Vacante: #VNC-2024-089",
    vacancy: "• #TRX-91204",
    status: "Liquidado",
    statusTone: "indigo",
    gateway: "Mercado Pago",
    paymentMethod: "(Saldo Empresas)",
    amount: "$69.00",
    strikethrough: false,
  },
  {
    id: "trx-88412",
    date: "28 Dic 2024",
    time: "11:20 hrs",
    title: "Suscripción Plan Premium (30 días)",
    folio: "Folio: #TRX-88412",
    vacancy: "",
    status: "Liquidado",
    statusTone: "indigo",
    gateway: "Transferencia SPEI",
    paymentMethod: "(STP)",
    amount: "$249.00",
    strikethrough: false,
  },
  {
    id: "trx-86109",
    date: "15 Dic 2024",
    time: "09:05 hrs",
    title: "Promoción Adicional 7 días",
    folio: "Vacante: #VNC-2024-045",
    vacancy: "• #TRX-86109",
    status: "Fallido",
    statusTone: "rose",
    gateway: "Terminal BBVA",
    paymentMethod: "(Tarjeta Débito *3102)",
    amount: "$39.00",
    strikethrough: true,
  },
  {
    id: "trx-95101",
    date: "14 Ene 2025",
    time: "08:00 hrs",
    title: "Renovación Plan Básico",
    folio: "Próximo ciclo",
    vacancy: "• #TRX-95101",
    status: "Pendiente",
    statusTone: "amber",
    gateway: "SPEI Banco",
    paymentMethod: "(Línea de captura)",
    amount: "$99.00",
    strikethrough: false,
  },
];

export default function CompanyPurchasesPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filteredRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return transactions;

    return transactions.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.folio.toLowerCase().includes(q) ||
        item.vacancy.toLowerCase().includes(q) ||
        item.gateway.toLowerCase().includes(q) ||
        item.paymentMethod.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <DashboardShell
      role="empresa"
      title="Empresa"
      badge="CORPORATIVO"
      hidePageHeader
    >
      {/* Encabezado superior */}
      <div className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
          FINANZAS CORPORATIVAS / AUDITORÍA FISCAL
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-brand-navy sm:text-[28px]">
          Historial de Compras y Facturación
        </h1>
        <p className="mt-1 text-[13px] font-normal text-slate-500">
          Consulta el registro auditable de pagos de suscripciones a planes y
          adquisición de promociones de vacantes.
        </p>
      </div>

      {/* Contenedor principal de movimientos */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
        {/* Cabecera de sección + filtro */}
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <h2 className="text-[15px] font-semibold text-brand-navy">
              Movimientos de Compras
            </h2>
            <span className="rounded-full bg-[#eeefff] px-2.5 py-0.5 text-[11px] font-semibold text-indigo-700">
              {transactions.length} registros
            </span>
          </div>

          <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200/90 bg-white px-3 py-1.5 focus-within:border-brand-navy sm:w-64">
            <Search size={14} className="shrink-0 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrar por folio o concepto..."
              className="w-full bg-transparent text-xs font-normal text-slate-700 placeholder:text-slate-400 outline-none"
            />
          </div>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-slate-200/70 bg-slate-50/60 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="px-5 py-3">FECHA Y HORA</th>
                <th className="px-4 py-3">CONCEPTO</th>
                <th className="px-4 py-3">PASARELA / MEDIO DE PAGO</th>
                <th className="px-5 py-3 text-right">IMPORTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredRows.map((row) => (
                <tr key={row.id} className="transition hover:bg-slate-50/50">
                  {/* Fecha y hora */}
                  <td className="whitespace-nowrap px-5 py-4 align-top">
                    <p className="font-semibold text-brand-navy">{row.date}</p>
                    <p className="mt-0.5 text-[11px] font-normal text-slate-400">
                      {row.time}
                    </p>
                  </td>

                  {/* Concepto */}
                  <td className="px-4 py-4 align-top">
                    <p className="text-[13px] font-semibold text-brand-navy">
                      {row.title}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
                      <span className="font-medium text-slate-500">
                        {row.folio}
                      </span>
                      {row.vacancy && (
                        <span className="font-normal text-slate-400">
                          {row.vacancy}
                        </span>
                      )}

                      {row.statusTone === "indigo" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#eeefff] px-2 py-0.5 text-[10px] font-semibold text-indigo-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" />
                          {row.status}
                        </span>
                      )}

                      {row.statusTone === "rose" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-semibold text-rose-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                          {row.status}
                        </span>
                      )}

                      {row.statusTone === "amber" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-brand-gold-soft px-2 py-0.5 text-[10px] font-semibold text-[#8b6600]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#c99700]" />
                          {row.status}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Pasarela / Medio de pago */}
                  <td className="whitespace-nowrap px-4 py-4 align-top">
                    <div className="flex items-center gap-2 text-xs">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                          row.statusTone === "amber"
                            ? "bg-[#c99700]"
                            : "bg-brand-navy"
                        }`}
                      />
                      <span className="font-semibold text-brand-navy">
                        {row.gateway}
                      </span>
                      <span className="text-[11px] font-normal text-slate-400">
                        {row.paymentMethod}
                      </span>
                    </div>
                  </td>

                  {/* Importe */}
                  <td className="whitespace-nowrap px-5 py-4 text-right align-top">
                    <span
                      className={`text-[13px] font-semibold ${
                        row.strikethrough
                          ? "text-slate-400 line-through"
                          : "text-brand-navy"
                      }`}
                    >
                      {row.amount}
                    </span>
                    <span className="ml-1 text-[10px] font-medium uppercase text-slate-400">
                      MXN
                    </span>
                  </td>
                </tr>
              ))}

              {filteredRows.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-5 py-8 text-center text-xs font-normal text-slate-500"
                  >
                    No hay movimientos que coincidan con tu búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pie de tabla */}
        <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-5 py-3.5 text-xs font-normal text-slate-400 sm:flex-row">
          <p>
            Mostrando {filteredRows.length} de {transactions.length} transacciones
            registradas
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              aria-label="Página anterior"
              className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              type="button"
              onClick={() => setPage(1)}
              className="h-7 w-7 rounded-lg bg-brand-navy text-xs font-semibold text-white"
            >
              {page}
            </button>
            <button
              type="button"
              onClick={() => setPage(1)}
              aria-label="Página siguiente"
              className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 text-slate-400 hover:bg-slate-50"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}