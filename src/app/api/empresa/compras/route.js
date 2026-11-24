import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { misComprasEmpresa } from '@/server/services/compras.service';
import { fail } from '@/server/services/http-errors';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(request){
 try{return NextResponse.json({ok:true,compras:misComprasEmpresa(obtenerUsuarioDeRequest(request))},{headers:{'Cache-Control':'private, no-store'}});}
 catch(error){return fail(error,'consultando compras de empresa');}
}
