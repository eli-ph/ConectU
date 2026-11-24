import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { estadoCompraEmpresa } from '@/server/services/compras.service';
import { fail } from '@/server/services/http-errors';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request){
 try{
  const id=new URL(request.url).searchParams.get('session_id');
  return NextResponse.json({ok:true,compra:estadoCompraEmpresa(obtenerUsuarioDeRequest(request),id)},{headers:{'Cache-Control':'private, no-store'}});
 }catch(e){return fail(e,'consultando estado de pago');}
}
