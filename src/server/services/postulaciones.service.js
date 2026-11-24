// Reglas del dominio: usuarios, pertenencia, límites de plazas y estados.
import { ErrorDeNegocio } from "@/server/services/auth.service";
import { hoyMexico } from "@/server/services/ofertas.service";
import {
  transaccionPostulaciones,estudiantePorUsuario,ofertaElegible,postulacionActiva,
  crearPostulacion,listarPostulacionesEstudiante,postulacionDeEstudiante,
  retirarPostulacion,idsPostulacionesActivas,empresaDeUsuario,
  postulacionesDeOferta,detallePostulacionEmpresa,totalAceptadasOferta,actualizarEstadoPostulacion,
} from "@/server/repositories/postulaciones.repository";

function idValido(value) {
  const id=Number(value);
  if(!Number.isSafeInteger(id)||id<1||id>2147483647)throw new ErrorDeNegocio('Identificador inválido.',400);
  return id;
}
function exigirEstudiante(usuario){
  if(!usuario||usuario.rol!=='estudiante'||usuario.email_verificado!==1)
    throw new ErrorDeNegocio('Inicia sesión con una cuenta estudiantil verificada.',401);
  const estudiante=estudiantePorUsuario(usuario.id);
  if(!estudiante)throw new ErrorDeNegocio('No encontramos tu perfil estudiantil.',403);
  return estudiante;
}
function exigirEmpresa(usuario){
  if(!usuario||usuario.rol!=='empresa')throw new ErrorDeNegocio('Inicia sesión como empresa.',401);
  const empresa=empresaDeUsuario(usuario.id);
  if(!empresa||empresa.estado_verificacion!=='aprobada')
    throw new ErrorDeNegocio('Tu empresa debe estar aprobada.',403);
  return empresa.empresa_id;
}

export function enviarPostulacion(usuario,ofertaId,mensaje=''){
  const estudiante=exigirEstudiante(usuario), id=idValido(ofertaId);
  if(typeof mensaje!=='string'||mensaje.length>1200)throw new ErrorDeNegocio('El mensaje no debe superar 1200 caracteres.');
  try {
    return transaccionPostulaciones(()=>{
      const oferta=ofertaElegible(id,hoyMexico());
      if(!oferta)throw new ErrorDeNegocio('La oferta ya no está disponible para postulaciones.',409);
      if(postulacionActiva(estudiante.estudiante_id,id))throw new ErrorDeNegocio('Ya tienes una postulación para esta oferta.',409);
      return {id:crearPostulacion(estudiante.estudiante_id,id,mensaje.trim()||null,usuario.id,oferta.usuario_empresa,oferta.titulo)};
    });
  } catch(error){
    if(error.code?.startsWith('SQLITE_CONSTRAINT'))throw new ErrorDeNegocio('Ya tienes una postulación para esta oferta.',409);
    throw error;
  }
}

export function misPostulaciones(usuario){
  exigirEstudiante(usuario);
  return listarPostulacionesEstudiante(usuario.id,hoyMexico());
}
export function misOfertasPostuladas(usuario){
  if(!usuario||usuario.rol!=='estudiante'||usuario.email_verificado!==1)return [];
  return idsPostulacionesActivas(usuario.id);
}
export function retirarMiPostulacion(usuario,postulacionId){
  exigirEstudiante(usuario);const id=idValido(postulacionId);
  return transaccionPostulaciones(()=>{
    const p=postulacionDeEstudiante(usuario.id,id);
    if(!p)throw new ErrorDeNegocio('No encontramos esa postulación.',404);
    if(!['enviada','en_revision'].includes(p.estado))throw new ErrorDeNegocio('Esta postulación ya no se puede retirar.',409);
    if(!retirarPostulacion(id,usuario.id))throw new ErrorDeNegocio('La postulación cambió. Actualiza la página.',409);
    return {estado:'retirada'};
  });
}
export function candidaturasOferta(usuario,ofertaId){
  const empresaId=exigirEmpresa(usuario);
  const respuesta=postulacionesDeOferta(empresaId,idValido(ofertaId));
  if(!respuesta)throw new ErrorDeNegocio('No encontramos esa oferta.',404);
  return respuesta;
}
export function verCandidatura(usuario,postulacionId){
  const empresaId=exigirEmpresa(usuario);
  const p=detallePostulacionEmpresa(empresaId,idValido(postulacionId));
  if(!p)throw new ErrorDeNegocio('No encontramos esa postulación.',404);
  return p;
}
export function decidirCandidatura(usuario,postulacionId,estado){
  const empresaId=exigirEmpresa(usuario),id=idValido(postulacionId);
  if(!['en_revision','aceptada','rechazada'].includes(estado))throw new ErrorDeNegocio('Estado no permitido.');
  return transaccionPostulaciones(()=>{
    const p=detallePostulacionEmpresa(empresaId,id);
    if(!p)throw new ErrorDeNegocio('No encontramos esa postulación.',404);
    if(p.oferta_estado!=='publicada'||p.fecha_vencimiento<hoyMexico())
      throw new ErrorDeNegocio('La oferta no está vigente. Solo puedes consultar las solicitudes anteriores.',409);
    if(!['enviada','en_revision'].includes(p.estado))throw new ErrorDeNegocio('Esta postulación ya tiene una resolución.',409);
    if(p.estado===estado)throw new ErrorDeNegocio('La postulación ya está en ese estado.',409);
    if(estado==='aceptada'&&totalAceptadasOferta(p.oferta_id)>=p.plazas)
      throw new ErrorDeNegocio('Ya se ocuparon todas las plazas de la oferta.',409);
    if(!actualizarEstadoPostulacion(id,estado,usuario.id,p.estudiante_usuario_id,p.oferta_titulo))
      throw new ErrorDeNegocio('La postulación cambió. Actualiza la página.',409);
    return {estado};
  });
}
