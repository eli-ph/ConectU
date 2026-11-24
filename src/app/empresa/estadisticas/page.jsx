import Link from 'next/link';
import { DashboardShell } from '@/components/dashboard-shell';
import { EstadisticasEmpresa } from '@/components/estadisticas-empresa';
import { exigirRol } from '@/server/auth/session';
import { ErrorDeNegocio } from '@/server/services/auth.service';
import { obtenerEstadisticasEmpresa } from '@/server/services/estadisticas-empresa.service';

export const runtime='nodejs';
export const dynamic='force-dynamic';
export const metadata={title:'Estadísticas empresariales | ConectU'};

export default async function CompanyStatsPage({searchParams}){
 const usuario=await exigirRol('empresa');
 const query=await searchParams||{};
 let datos;
 try{datos=obtenerEstadisticasEmpresa(usuario,query);}
 catch(error){
  if(!(error instanceof ErrorDeNegocio))throw error;
  return <DashboardShell role="empresa" title="Estadísticas" badge="CORPORATIVO" hidePageHeader>
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-xl font-bold text-brand-navy">Estadísticas empresariales</h1>
      <p role="alert" className="mt-3 text-sm text-slate-600">{error.message}</p>
      <Link href={usuario.estado_verificacion==='aprobada'?'/empresa/estadisticas':'/empresa'} className="mt-4 inline-flex rounded-xl bg-brand-navy px-4 py-2 text-sm font-semibold text-white">{usuario.estado_verificacion==='aprobada'?'Restablecer filtros':'Volver al resumen'}</Link>
    </section>
  </DashboardShell>;
 }
 const f=datos.filtros;
 return <EstadisticasEmpresa key={`${usuario.empresa_id}:${f.periodo}:${f.desde}:${f.hasta}:${f.ofertaId}:${f.ejeId}`} datos={datos}/>;
}
