import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { fail } from '@/server/services/http-errors';
import { candidaturasOferta } from '@/server/services/postulaciones.service';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request,{params}){
  try{return NextResponse.json({ok:true,...candidaturasOferta(obtenerUsuarioDeRequest(request),(await params).id)},{headers:{'Cache-Control':'private, no-store'}});}
  catch(e){return fail(e,'consultando candidaturas');}
}
