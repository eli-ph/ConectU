import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { leerJson, verificarOrigen, errorJson } from '@/server/auth/http';
import { fail } from '@/server/services/http-errors';
import { iniciarCheckoutEmpresa, catalogoCompras } from '@/server/services/compras.service';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request){
 try {return NextResponse.json({ok:true,...catalogoCompras(obtenerUsuarioDeRequest(request))},{headers:{'Cache-Control':'private, no-store'}});}
 catch(e){return fail(e,'consultando catálogo de compras');}
}
export async function POST(request){
 if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
 try{
  const input=await leerJson(request);
  const data=await iniciarCheckoutEmpresa(obtenerUsuarioDeRequest(request),input,request.headers.get('origin')); 
  return NextResponse.json({ok:true,...data},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return fail(e,'creando sesión de pago');}
}
