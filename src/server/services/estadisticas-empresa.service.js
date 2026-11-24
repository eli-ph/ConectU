import { ErrorDeNegocio } from '@/server/services/auth.service';
import { consultarEstadisticasEmpresa } from '@/server/repositories/estadisticas-empresa.repository';
import { hoyMexico } from '@/server/services/ofertas.service';

const PERIODOS={'30':30,'90':90,'180':180,'365':365};
const ESTADOS=['enviada','en_revision','aceptada','rechazada','retirada','cerrada'];
const fmt=d=>d.toISOString().slice(0,10);
const sumar=(iso,n)=>{const d=new Date(iso+'T12:00:00Z');d.setUTCDate(d.getUTCDate()+n);return fmt(d);};
function mesValido(value){return typeof value==='string'&&/^20\d{2}-(0[1-9]|1[0-2])$/.test(value);}
function id(value){if(value===undefined||value==='')return null;if(typeof value!=='string'||!/^\d{1,10}$/.test(value)||!Number.isSafeInteger(Number(value))||Number(value)<1)throw new ErrorDeNegocio('Filtro inválido.',400);return Number(value);}
export function validarFiltrosEstadisticas(query={},hoy=hoyMexico()){
 const periodo=query.periodo??'30';let desde,hasta=hoy;
 if(periodo==='personalizado'){
   if(!mesValido(query.inicio)||!mesValido(query.fin)||query.inicio>query.fin||query.fin>hoy.slice(0,7))throw new ErrorDeNegocio('Selecciona un rango de meses válido, sin meses futuros.',400);
   desde=query.inicio+'-01';
   const [y,m]=query.fin.split('-').map(Number);const ultimo=fmt(new Date(Date.UTC(y,m,0)));hasta=ultimo<hoy?ultimo:hoy;
   const meses=(Number(query.fin.slice(0,4))-Number(query.inicio.slice(0,4)))*12+Number(query.fin.slice(5))-Number(query.inicio.slice(5))+1;
   if(meses>12)throw new ErrorDeNegocio('El rango personalizado admite hasta 12 meses.',400);
 }else{
   if(typeof periodo!=='string'||!Object.hasOwn(PERIODOS,periodo))throw new ErrorDeNegocio('Periodo inválido.',400);
   desde=sumar(hoy,1-PERIODOS[periodo]);
 }
 return {periodo,inicio:periodo==='personalizado'?query.inicio:desde.slice(0,7),fin:periodo==='personalizado'?query.fin:hasta.slice(0,7),desde,hasta,hoy,ofertaId:id(query.oferta),ejeId:id(query.eje),desdeUtc:desde+'T06:00:00Z',hastaUtc:sumar(hasta,1)+'T06:00:00Z'};
}
export function obtenerEstadisticasEmpresa(usuario,query={},hoy=hoyMexico()){
 if(!usuario||usuario.rol!=='empresa'||!Number.isSafeInteger(usuario.empresa_id)||usuario.empresa_id<=0)throw new ErrorDeNegocio('Acceso reservado a empresas.',403);
 if(usuario.estado_verificacion!=='aprobada')throw new ErrorDeNegocio('Tu empresa debe estar aprobada para consultar sus estadísticas.',403);
 const filtros=validarFiltrosEstadisticas(query,hoy);
 const datos=consultarEstadisticasEmpresa(usuario.empresa_id,filtros);
 if(filtros.ofertaId&&!datos.ofertas.some(o=>o.id===filtros.ofertaId))throw new ErrorDeNegocio('La convocatoria seleccionada no está disponible.',404);
 const ejes=[...new Map(datos.ofertas.filter(o=>o.eje_accion_id&&o.eje_nombre).map(o=>[o.eje_accion_id,{id:o.eje_accion_id,nombre:o.eje_nombre}])).values()].sort((a,b)=>a.nombre.localeCompare(b.nombre,'es-MX'));
 if(filtros.ejeId&&!ejes.some(e=>e.id===filtros.ejeId))throw new ErrorDeNegocio('El eje seleccionado no está disponible.',404);
 const estados=Object.fromEntries(ESTADOS.map(e=>[e,0]));const porOferta=new Map();const porDia=new Map();let total=0;
 for(const row of datos.filas){
   estados[row.estado]=(estados[row.estado]||0)+row.total;total+=row.total;
   porOferta.set(row.oferta_id,(porOferta.get(row.oferta_id)||0)+row.total);
   porDia.set(row.dia,(porDia.get(row.dia)||0)+row.total);
 }
 const semanas=[];let cursor=filtros.desde;
 // Semanas consecutivas de siete días desde el inicio del periodo, incluyendo los intervalos sin actividad.
 while(cursor<=filtros.hasta){
   let fin=sumar(cursor,6);if(fin>filtros.hasta)fin=filtros.hasta;
   let cantidad=0;for(let d=cursor;d<=fin;d=sumar(d,1))cantidad+=porDia.get(d)||0;
   semanas.push({inicio:cursor,fin,total:cantidad});cursor=sumar(fin,1);
 }
 const pico=Math.max(0,...semanas.map(s=>s.total));const indicePico=pico>0?semanas.findIndex(s=>s.total===pico):-1;
 const convocatorias=datos.delPeriodo.map(o=>({id:o.id,titulo:o.titulo,plazas:o.plazas,estado:o.estado,activa:!!o.activa,total:porOferta.get(o.id)||0})).sort((a,b)=>b.total-a.total||a.titulo.localeCompare(b.titulo,'es-MX')||a.id-b.id);
 return {filtros,opciones:{ofertas:datos.ofertas.map(o=>({id:o.id,titulo:o.titulo,estado:o.estado})),ejes},
   indicadores:{activas:datos.seleccion.filter(o=>o.activa).length,plazas:convocatorias.reduce((s,o)=>s+o.plazas,0),postulaciones:total,convocatorias:convocatorias.length},
   estados,convocatorias,semanas,pico,indicePico,promedio:semanas.length?total/semanas.length:0};
}
