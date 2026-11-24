import {getDatabase} from '@/server/db/sqlite';
import {listarNotificaciones, marcarLeidas} from '@/server/notificaciones/core.mjs';
export function consultarNotificaciones(usuarioId) {
  const db=getDatabase();
  // GET debe ser de solo lectura: procesar eventos aquí convierte cada
  // consulta de la campana en una escritura SQLite y provoca trabajo continuo.
  // El Observer de eventos corre independientemente en el worker 6A.
  return listarNotificaciones(db,usuarioId,50);
}
export function actualizarNotificaciones(usuarioId,notificationId) {
  return marcarLeidas(getDatabase(),usuarioId,notificationId);
}
