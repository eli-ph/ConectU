import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { verificarOrigen,leerJson,errorJson } from '@/server/auth/http';
import { fail } from '@/server/services/http-errors';
import { retirarMiPostulacion } from '@/server/services/postulaciones.service';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function PATCH(request,{params}){
  if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
  try{
    const input=await leerJson(request);
    if(input?.action!=='retirar')return errorJson('Operación no permitida.');
    const data=retirarMiPostulacion(obtenerUsuarioDeRequest(request),(await params).id);
    return NextResponse.json({ok:true,...data},{headers:{'Cache-Control':'no-store'}});
  }catch(e){return fail(e,'retirando postulación');}
}
