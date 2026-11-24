import {DashboardShell} from '@/components/dashboard-shell';
import {StripePurchasesList} from '@/components/stripe-purchases-list';
import {exigirRol} from '@/server/auth/session';
import {listadoComprasAdministrador} from '@/server/services/compras.service';
export const runtime='nodejs';export const dynamic='force-dynamic';
export const metadata={title:'Compras empresariales | ConectU'};
export default async function AdminComprasPage(){
 const usuario=await exigirRol('admin');
 return <DashboardShell role="admin" title="Consulta de compras empresariales" eyebrow="Operaciones comerciales"><p className="mb-5 text-sm text-slate-600">Registro consolidado de pagos realizados por empresas en ConectU.</p><StripePurchasesList initialPurchases={listadoComprasAdministrador(usuario)} role="admin"/></DashboardShell>;
}
