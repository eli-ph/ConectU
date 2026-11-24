import { ErrorDeNegocio } from '@/server/services/auth.service';
import { consultarNotificaciones, actualizarNotificaciones } from '@/server/repositories/notificaciones.repository';
function usuarioId(user) {
  if(!user || !['admin','empresa','estudiante'].includes(user.rol) || !Number.isSafeInteger(Number(user.id)))
    throw new ErrorDeNegocio('Inicia sesión para consultar tus notificaciones.',401);
  return Number(user.id);
}
export function obtenerNotificaciones(user) {
  return consultarNotificaciones(usuarioId(user));
}
export function marcarNotificaciones(user,datos) {
  const uid=usuarioId(user);
  if(!datos || typeof datos!=='object' || Array.isArray(datos))throw new ErrorDeNegocio('Solicitud inválida.',400);
  if(datos.todas===true) return {actualizadas:actualizarNotificaciones(uid,null)};
  const id=Number(datos.id);
  if(!Number.isSafeInteger(id)||id<=0)throw new ErrorDeNegocio('Notificación inválida.',400);
  return {actualizadas:actualizarNotificaciones(uid,id)};
}
