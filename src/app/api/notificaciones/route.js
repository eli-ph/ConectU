import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { verificarOrigen, leerJson, errorJson } from '@/server/auth/http';
import { fail } from '@/server/services/http-errors';
import { obtenerNotificaciones, marcarNotificaciones } from '@/server/services/notificaciones.service';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const noCache={'Cache-Control':'private, no-store'};
export async function GET(request) {
  try {
    return NextResponse.json({ok:true,...obtenerNotificaciones(obtenerUsuarioDeRequest(request))},{headers:noCache});
  } catch(e) { return fail(e,'consultando notificaciones'); }
}
export async function PATCH(request) {
  if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
  try {
    const body=await leerJson(request);
    return NextResponse.json({ok:true,...marcarNotificaciones(obtenerUsuarioDeRequest(request),body)},{headers:noCache});
  } catch(e) { return fail(e,'actualizando notificaciones'); }
}
