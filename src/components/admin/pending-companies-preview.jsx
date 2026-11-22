"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CompanyExpedientModal } from "@/components/admin/company-expedient-modal";

export function PendingCompaniesPreview({ companies }) {
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <>
      <div className="p-4 sm:hidden">
        {companies.map((company) => (
          <article key={company.name} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#edf0ff] text-xs font-bold text-brand-navy">
                {company.initial}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-brand-navy">{company.name}</p>
                <p className="mt-1 text-sm text-slate-500">{company.sector}</p>
              </div>
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-800">
                {company.state}
              </span>
            </div>
            <p className="mt-4 text-xs text-slate-500">RFC y fecha de solicitud disponibles en el expediente.</p>
            <button
              type="button"
              onClick={() => setSelectedCompany(company)}
              className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-4 py-2 text-sm font-bold text-white hover:bg-brand-navy-light"
            >
              Revisar <ArrowRight size={16} aria-hidden="true" />
            </button>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto sm:block">
        <table className="conectu-table w-full min-w-[740px] border-collapse text-left text-sm">
          <thead className="bg-[#f3f5fb] text-[0.69rem] font-bold uppercase tracking-[0.065em] text-slate-500">
            <tr>
              <th scope="col" className="px-6 py-4">Organización / razón social</th>
              <th scope="col" className="px-4 py-4">RFC</th>
              <th scope="col" className="px-4 py-4">Solicitud</th>
              <th scope="col" className="px-4 py-4">Sector</th>
              <th scope="col" className="px-4 py-4">Estado</th>
              <th scope="col" className="px-6 py-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {companies.map((company) => (
              <tr key={company.name} className="transition-colors hover:bg-slate-50/80">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#edf0ff] text-xs font-bold text-brand-navy">{company.initial}</span>
                    <div className="min-w-0">
                      <p className="font-bold text-brand-navy">{company.name}</p>
                      <p className="mt-0.5 text-xs text-slate-500">Registro de ejemplo</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-5 text-slate-500">Dato protegido</td>
                <td className="px-4 py-5 text-slate-500">—</td>
                <td className="px-4 py-5 text-slate-600">{company.sector}</td>
                <td className="px-4 py-5">
                  <span className="rounded-full bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800">{company.state}</span>
                </td>
                <td className="px-6 py-5 text-right">
                  <button
                    type="button"
                    onClick={() => setSelectedCompany(company)}
                    className="inline-flex min-h-10 items-center gap-2 whitespace-nowrap rounded-xl bg-brand-navy px-4 py-2 text-xs font-bold text-white transition hover:bg-brand-navy-light"
                  >
                    Revisar <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <CompanyExpedientModal company={selectedCompany} onClose={() => setSelectedCompany(null)} />
    </>
  );
}
