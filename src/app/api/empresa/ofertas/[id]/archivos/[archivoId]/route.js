import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { verificarOrigen,errorJson } from '@/server/auth/http';
import { ErrorDeNegocio } from '@/server/services/auth.service';
import { detalleOfertaEmpresa } from '@/server/services/ofertas.service';
import { obtenerAdjuntoEmpresa,eliminarAdjuntoEmpresa } from '@/server/repositories/ofertas.repository';
import { fail } from '@/server/services/http-errors';
export const runtime='nodejs';
function findFile(request,params){
  const usuario=obtenerUsuarioDeRequest(request);
  if(!usuario||usuario.rol!=='empresa'||usuario.estado_verificacion!=='aprobada')throw new ErrorDeNegocio('Acceso denegado.',403);
  const oferta=detalleOfertaEmpresa(usuario,params.id);
  const archivo=obtenerAdjuntoEmpresa(usuario.empresa_id,oferta.id,params.archivoId);
  if(!archivo)throw new ErrorDeNegocio('Archivo no encontrado.',404);
  const base=path.resolve(process.cwd(),'storage','ofertas',String(oferta.id));
  const file=path.resolve(process.cwd(),archivo.ruta_archivo);
  if(!file.startsWith(base+path.sep))throw new ErrorDeNegocio('Ruta no permitida.',403);
  return {usuario,oferta,archivo,file};
}
export async function GET(request,{params}){
  try {const {archivo,file}=findFile(request,await params);const buffer=await fs.readFile(file);
    return new NextResponse(buffer,{headers:{'Content-Type':'application/pdf','Content-Disposition':`inline; filename="documento-${archivo.id}.pdf"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
  }catch(error){return fail(error,'consultando anexo');}
}
export async function DELETE(request,{params}){
  if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
  try {const {usuario,oferta,archivo,file}=findFile(request,await params);
    if(!['borrador','publicada'].includes(oferta.estado))throw new ErrorDeNegocio('No puedes modificar documentos de una oferta cerrada.',409);
    eliminarAdjuntoEmpresa(usuario.empresa_id,oferta.id,archivo.id);
    await fs.unlink(file).catch(()=>{});return NextResponse.json({ok:true});
  }catch(error){return fail(error,'eliminando anexo');}
}
