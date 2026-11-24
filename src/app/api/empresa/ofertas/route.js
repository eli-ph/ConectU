import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { verificarOrigen,leerJson,errorJson } from '@/server/auth/http';
import { fail } from '@/server/services/http-errors';
import { guardarOfertaEmpresa,resumenOfertasEmpresa } from '@/server/services/ofertas.service';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request){
  try {return NextResponse.json({ok:true,...resumenOfertasEmpresa(obtenerUsuarioDeRequest(request))},{headers:{'Cache-Control':'no-store'}});}
  catch(error){return fail(error,'consultando ofertas');}
}
export async function POST(request){
  if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
  try {const input=await leerJson(request);
    const result=guardarOfertaEmpresa(obtenerUsuarioDeRequest(request),null,input,input?.action==='publish'?'publicar':'borrador');
    return NextResponse.json({ok:true,...result},{status:201,headers:{'Cache-Control':'no-store'}});
  }catch(error){return fail(error,'guardando oferta');}
}
