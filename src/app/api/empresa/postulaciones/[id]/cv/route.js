import { NextResponse } from 'next/server';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { fail } from '@/server/services/http-errors';
import { verCandidatura } from '@/server/services/postulaciones.service';
import { leerCvEstudiante } from '@/server/services/perfil-estudiante.service';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function GET(request,{params}){
  try {
    // Nunca se recibe un usuario_id desde el navegador: se obtiene de la postulación autorizada.
    const p=verCandidatura(obtenerUsuarioDeRequest(request),(await params).id);
    const {contenido,nombre}=await leerCvEstudiante(p.estudiante_usuario_id);
    return new NextResponse(new Uint8Array(contenido),{headers:{
      'Content-Type':'application/pdf',
      'Content-Disposition':`inline; filename="${nombre.replace(/[^\x20-\x7e]/g,'_').replace(/["\\]/g,'_')}"; filename*=UTF-8''${encodeURIComponent(nombre)}`,
      'Cache-Control':'private, no-store',
      'X-Content-Type-Options':'nosniff',
      'Content-Security-Policy':'sandbox',
    }});
  }catch(e){return fail(e,'consultando CV autorizado');}
}
