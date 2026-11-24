import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { verificarOrigen,leerJson,errorJson } from '@/server/auth/http';
import { detalleOfertaEmpresa,guardarOfertaEmpresa,cambiarEstadoEmpresaOferta } from '@/server/services/ofertas.service';
import { fail } from '@/server/services/http-errors';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request,{params}) {
  try {return NextResponse.json({ok:true,oferta:detalleOfertaEmpresa(obtenerUsuarioDeRequest(request),(await params).id)},{headers:{'Cache-Control':'no-store'}});}
  catch(e){return fail(e,'consultando oferta');}
}
export async function PUT(request,{params}) {
  if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
  try {const input=await leerJson(request);const result=guardarOfertaEmpresa(obtenerUsuarioDeRequest(request),(await params).id,input,input?.action==='publish'?'publicar':'guardar');
    return NextResponse.json({ok:true,...result});}
  catch(e){return fail(e,'editando oferta');}
}
export async function PATCH(request,{params}) {
  if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
  try {const input=await leerJson(request);const result=cambiarEstadoEmpresaOferta(obtenerUsuarioDeRequest(request),(await params).id,input?.action,input);
    return NextResponse.json({ok:true,...result});}
  catch(e){return fail(e,'cambiando estado de oferta');}
}
