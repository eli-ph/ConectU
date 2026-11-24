import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { verificarOrigen,leerJson,errorJson } from '@/server/auth/http';
import { fail } from '@/server/services/http-errors';
import { verCandidatura, decidirCandidatura } from '@/server/services/postulaciones.service';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request,{params}){
  try{return NextResponse.json({ok:true,candidatura:verCandidatura(obtenerUsuarioDeRequest(request),(await params).id)},{headers:{'Cache-Control':'private, no-store'}});}
  catch(e){return fail(e,'consultando candidatura');}
}
export async function PATCH(request,{params}){
  if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
  try{
    const input=await leerJson(request);
    const data=decidirCandidatura(obtenerUsuarioDeRequest(request),(await params).id,input?.estado);
    return NextResponse.json({ok:true,...data},{headers:{'Cache-Control':'no-store'}});
  }catch(e){return fail(e,'actualizando candidatura');}
}
