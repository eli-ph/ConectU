import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { verificarOrigen, leerJson, errorJson } from '@/server/auth/http';
import { fail } from '@/server/services/http-errors';
import {
  consultarPromocionesIncluidas, activarPromocionIncluida,
} from '@/server/services/promociones-incluidas.service';

export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={ 'Cache-Control':'private, no-store' };

export async function GET(request) {
  try {
    return NextResponse.json({ok:true,...consultarPromocionesIncluidas(obtenerUsuarioDeRequest(request))},{headers});
  } catch (error) { return fail(error,'consultando promociones incluidas'); }
}

export async function POST(request) {
  if (!verificarOrigen(request)) return errorJson('Solicitud no permitida.',403);
  try {
    const input=await leerJson(request);
    const ofertaId=input?.ofertaId;
    const respuesta=activarPromocionIncluida(obtenerUsuarioDeRequest(request),ofertaId);
    return NextResponse.json({ok:true,...respuesta},{status:201,headers});
  } catch (error) { return fail(error,'activando promoción incluida'); }
}
