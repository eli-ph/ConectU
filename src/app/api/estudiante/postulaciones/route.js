import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { verificarOrigen,leerJson,errorJson } from '@/server/auth/http';
import { fail } from '@/server/services/http-errors';
import { enviarPostulacion, misPostulaciones } from '@/server/services/postulaciones.service';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store'};
export async function GET(request){
  try{return NextResponse.json({ok:true,postulaciones:misPostulaciones(obtenerUsuarioDeRequest(request))},{headers});}
  catch(e){return fail(e,'consultando postulaciones del estudiante');}
}
export async function POST(request){
  if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
  try{
    const data=await leerJson(request);
    const result=enviarPostulacion(obtenerUsuarioDeRequest(request),data?.ofertaId,data?.mensaje||'');
    return NextResponse.json({ok:true,...result},{status:201,headers});
  }catch(e){return fail(e,'enviando postulación');}
}
