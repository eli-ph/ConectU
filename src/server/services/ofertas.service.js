import { ErrorDeNegocio } from '@/server/services/auth.service';
import { tieneCierreAdministrativo } from '@/server/repositories/administracion.repository';
import { totalAceptadasOferta } from '@/server/repositories/postulaciones.repository';
import {
  ejecutarOfertasTransaccion, consultarPlanEmpresa, contarPublicadasEmpresa, listarOfertasEmpresa,
  obtenerOfertaEmpresa, obtenerEjePorNombre, idsHabilidadesExactas, guardarOfertaRegistro,
  cambiarEstadoOferta, listarOfertasPublicadas,
} from '@/server/repositories/ofertas.repository';

const TYPES = new Set(['empleo','internship','servicio_social','practicas']);
const MODES = new Set(['presencial','hibrida','remota']);
function numeroEntero(v, field, min, max) {
  const n=Number(v); if (!Number.isSafeInteger(n)||n<min||n>max) throw new ErrorDeNegocio(`Revisa ${field}.`);
  return n;
}
function string(v,field,max=300,optional=false) {
  if(typeof v!=='string'||v.length>max||(!optional&&!v.trim())) throw new ErrorDeNegocio(`Revisa ${field}.`);
  return v.trim();
}
export function hoyMexico() {
  const partes = new Intl.DateTimeFormat('es-MX',{timeZone:'America/Mexico_City',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());
  const valor=(tipo)=>partes.find(p=>p.type===tipo)?.value;
  return `${valor('year')}-${valor('month')}-${valor('day')}`;
}
function sumarDias(iso,dias) {
  const d=new Date(`${iso}T12:00:00Z`);d.setUTCDate(d.getUTCDate()+dias);return d.toISOString().slice(0,10);
}
function sumarMeses(iso,meses){
  const [y,m,d]=iso.split('-').map(Number);
  const first=new Date(Date.UTC(y,m-1+meses,1));
  const last=new Date(Date.UTC(first.getUTCFullYear(),first.getUTCMonth()+1,0)).getUTCDate();
  return `${first.getUTCFullYear()}-${String(first.getUTCMonth()+1).padStart(2,'0')}-${String(Math.min(d,last)).padStart(2,'0')}`;
}
function esFechaReal(iso){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(iso))return false;
  const fecha=new Date(iso+'T00:00:00Z');
  return !Number.isNaN(fecha.getTime())&&fecha.toISOString().slice(0,10)===iso;
}
function diasEntre(desde,hasta){return Math.round((Date.parse(hasta+'T00:00:00Z')-Date.parse(desde+'T00:00:00Z'))/86400000);}
function empresaAprobada(usuario){
  if(!usuario || usuario.rol!=='empresa') throw new ErrorDeNegocio('Debes iniciar sesión como empresa.',401);
  if(usuario.estado_verificacion!=='aprobada') throw new ErrorDeNegocio('Tu empresa debe estar aprobada para gestionar ofertas.',403);
  return usuario.empresa_id;
}
function capacidad(empresaId,hoy){
  const plan=consultarPlanEmpresa(empresaId);
  if(!plan) throw new ErrorDeNegocio('No encontramos el plan de tu empresa.',409);
  return { plan:plan.nombre,limite:plan.limite==null?null:Number(plan.limite),activas:contarPublicadasEmpresa(empresaId,hoy)};
}
function comprobarCupo(empresaId,hoy){
  const cap=capacidad(empresaId,hoy);
  if(cap.limite!==null&&cap.activas>=cap.limite) throw new ErrorDeNegocio(`Llegaste al límite de ${cap.limite} ofertas activas de tu plan.`,409);
}
export function resumenOfertasEmpresa(usuario){
  const empresaId=empresaAprobada(usuario),hoy=hoyMexico();
  return { ofertas:listarOfertasEmpresa(empresaId).map(o=>({...o,estado_efectivo:o.estado==='publicada'&&o.fecha_vencimiento<hoy?'vencida':o.estado})),capacidad:capacidad(empresaId,hoy) };
}
export function detalleOfertaEmpresa(usuario,id){
  const e=empresaAprobada(usuario);const dato=obtenerOfertaEmpresa(e,numeroEntero(id,'la oferta',1,2147483647));
  if(!dato)throw new ErrorDeNegocio('No encontramos esa oferta.',404);return dato;
}
function validarDatos(input,{publicar,hoy,esPublicada}){
  if(!input||typeof input!=='object'||Array.isArray(input))throw new ErrorDeNegocio('Revisa la información de la oferta.');
  const title=string(input.title,'el título',160),description=string(input.description??'','la descripción',6000,!publicar);
  const type=string(input.type,'el tipo',40);if(!TYPES.has(type))throw new ErrorDeNegocio('Tipo de oferta inválido.');
  const modality=string(input.modality,'la modalidad',20);if(!MODES.has(modality))throw new ErrorDeNegocio('Modalidad inválida.');
  const location=string(input.location??'','la sede o ubicación',200,!publicar);
  const axis=string(input.axis??'','el eje de acción',160,!publicar);
  const eje=axis?obtenerEjePorNombre(axis):null;if(axis&&!eje)throw new ErrorDeNegocio('Selecciona un eje de acción del catálogo.');
  const skills=input.skills;
  if(!Array.isArray(skills)||skills.length>30||skills.some(s=>typeof s!=='string'||s.length>110)||new Set(skills).size!==skills.length)
    throw new ErrorDeNegocio('Revisa las habilidades seleccionadas.');
  const ids=idsHabilidadesExactas(skills);
  if(ids.length!==skills.length)throw new ErrorDeNegocio('Selecciona habilidades existentes en el catálogo.');
  const vacancies=numeroEntero(input.vacancies,'las plazas',1,100000);
  const minCredits=numeroEntero(input.minCredits??0,'el porcentaje de créditos',0,100);
  const deadline=string(input.deadline??'','la fecha de vencimiento',10,true);
  if(deadline&&!esFechaReal(deadline))throw new ErrorDeNegocio('La fecha de vencimiento no es válida.');
  if(publicar){
    if(!deadline || deadline<=hoy || (!esPublicada&&deadline>sumarMeses(hoy,2)))
      throw new ErrorDeNegocio('El vencimiento debe ser posterior a hoy y no superar dos meses desde la publicación.');
  }
  const stipend=string(input.stipend??'','el apoyo económico',80,true);
  const socialHours=string(input.socialHours??'','las horas requeridas',80,true);
  const officialKey=string(input.officialKey??'','la clave del programa',120,true);
  return { title,description,type,modality,location,ejeId:eje?.id??null,habilidadIds:ids.map(s=>s.id),vacancies,
    minCredits,deadline:deadline||null,stipend,socialHours,officialKey };
}
export function guardarOfertaEmpresa(usuario,id,input,accion){
  const empresaId=empresaAprobada(usuario),hoy=hoyMexico();
  const offerId=id==null?null:numeroEntero(id,'la oferta',1,2147483647);
  if(!['borrador','publicar','guardar'].includes(accion))throw new ErrorDeNegocio('Operación inválida.');
  return ejecutarOfertasTransaccion(()=>{
    const anterior=offerId?obtenerOfertaEmpresa(empresaId,offerId):null;
    if(offerId&&!anterior)throw new ErrorDeNegocio('No encontramos esa oferta.',404);
    if(anterior?.estado==='cerrada')throw new ErrorDeNegocio('Esta oferta está cerrada. Debes reactivarla antes de editarla.',409);
    const yaPublicada=anterior?.estado==='publicada';
    const publicar=accion==='publicar'||yaPublicada;
    const values=validarDatos(input,{publicar,hoy,esPublicada:!!anterior?.fecha_publicacion});
    if(offerId && values.vacancies < totalAceptadasOferta(offerId))
      throw new ErrorDeNegocio('Las plazas no pueden ser menos que los candidatos ya aceptados.',409);
    if(yaPublicada&&values.deadline!==anterior.fecha_vencimiento) {
      throw new ErrorDeNegocio('Para cambiar el vencimiento de una oferta publicada utiliza Extender vigencia.',409);
    }
    if(publicar && !yaPublicada) comprobarCupo(empresaId,hoy);
    const estado=publicar?'publicada':'borrador';
    const fechaPublicacion=publicar?hoy:null;
    const saved=guardarOfertaRegistro(empresaId,offerId,values,estado,fechaPublicacion);
    return { id:saved,estado };
  });
}
export function cambiarEstadoEmpresaOferta(usuario,id,accion,input={}){
  const empresaId=empresaAprobada(usuario),ofertaId=numeroEntero(id,'la oferta',1,2147483647),hoy=hoyMexico();
  return ejecutarOfertasTransaccion(()=>{
    const o=obtenerOfertaEmpresa(empresaId,ofertaId);
    if(!o)throw new ErrorDeNegocio('No encontramos esa oferta.',404);
    if(accion==='eliminar'){
      cambiarEstadoOferta(empresaId,ofertaId,'eliminada');return {estado:'eliminada'};
    }
    if(accion==='cerrar'){
      if(o.estado!=='publicada')throw new ErrorDeNegocio('Solo puedes cerrar ofertas publicadas.',409);
      cambiarEstadoOferta(empresaId,ofertaId,'cerrada');return {estado:'cerrada'};
    }
    if(accion==='publicar'){
      if(o.estado!=='borrador')throw new ErrorDeNegocio('Solo puedes publicar un borrador.',409);
      if(!o.fecha_vencimiento||o.fecha_vencimiento<=hoy||o.fecha_vencimiento>sumarMeses(hoy,2))
        throw new ErrorDeNegocio('Edita la fecha de vencimiento antes de publicar (máximo dos meses).',409);
      comprobarCupo(empresaId,hoy);
      cambiarEstadoOferta(empresaId,ofertaId,'publicada',{hoy,fechaFin:o.fecha_vencimiento});
      return {estado:'publicada'};
    }
    if(accion==='reactivar'){
      if(tieneCierreAdministrativo(ofertaId))throw new ErrorDeNegocio('Esta oferta fue cerrada por administración y no puede reactivarse.',409);
      if(!(o.estado==='cerrada'||(o.estado==='publicada'&&o.fecha_vencimiento<hoy)))
        throw new ErrorDeNegocio('Solo puedes reactivar una oferta cerrada o vencida.',409);
      comprobarCupo(empresaId,hoy);
      const fechaFin=input?.fechaFin;
      if(typeof fechaFin!=='string'||fechaFin<=hoy||fechaFin>sumarMeses(hoy,2)||!esFechaReal(fechaFin))
        throw new ErrorDeNegocio('Selecciona una nueva fecha de vencimiento válida (máximo dos meses).');
      cambiarEstadoOferta(empresaId,ofertaId,'publicada',{hoy,fechaFin});return {estado:'publicada'};
    }
    if(accion==='extender'){
      if(o.estado!=='publicada'||o.fecha_vencimiento<hoy)throw new ErrorDeNegocio('Solo puedes extender una oferta publicada y vigente.',409);
      const restantes=diasEntre(hoy,o.fecha_vencimiento);
      if(restantes>7)throw new ErrorDeNegocio('Podrás extenderla cuando falten siete días o menos.',409);
      const dias=numeroEntero(input?.dias,'los días de extensión',7,30);
      if(![7,15,30].includes(dias))throw new ErrorDeNegocio('Solo se permiten 7, 15 o 30 días.');
      const cap=capacidad(empresaId,hoy);
      if(cap.limite!==null && cap.activas>cap.limite)throw new ErrorDeNegocio('Tu plan actual supera su capacidad. No puedes extender ofertas.',409);
      const fechaFin= o.fecha_vencimiento>sumarDias(hoy,dias)?o.fecha_vencimiento:sumarDias(hoy,dias);
      cambiarEstadoOferta(empresaId,ofertaId,'extender',{fechaFin});return {estado:'publicada',fechaFin};
    }
    throw new ErrorDeNegocio('Operación inválida.');
  });
}

export function obtenerOfertasPublicas() {
  return listarOfertasPublicadas(hoyMexico());
}
