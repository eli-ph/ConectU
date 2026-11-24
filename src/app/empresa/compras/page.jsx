import {DashboardShell} from '@/components/dashboard-shell';
import {StripePurchasesList} from '@/components/stripe-purchases-list';
import {exigirRol} from '@/server/auth/session';
import {misComprasEmpresa} from '@/server/services/compras.service';
export const runtime='nodejs';export const dynamic='force-dynamic';
export const metadata={title:'Compras | ConectU'};
export default async function EmpresaComprasPage({searchParams}){
 const query=await searchParams;
 const usuario=await exigirRol('empresa');
 return <DashboardShell role="empresa" title="Empresa" badge="CORPORATIVO" hidePageHeader><div className="mb-6"><p className="text-xs font-bold uppercase tracking-widest text-slate-400">Finanzas corporativas</p><h1 className="mt-2 text-2xl font-bold text-brand-navy">Historial de Compras y Facturación</h1><p className="mt-2 text-sm text-slate-500">Pagos por planes y promociones adicionales confirmados mediante Stripe.</p></div><StripePurchasesList initialPurchases={misComprasEmpresa(usuario)} checkout={query?.checkout||null} sessionId={query?.session_id||null}/></DashboardShell>;
}
