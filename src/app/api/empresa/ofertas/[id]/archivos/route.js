import { NextResponse } from 'next/server';
import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { obtenerUsuarioDeRequest } from '@/server/auth/session';
import { verificarOrigen,errorJson } from '@/server/auth/http';
import { ErrorDeNegocio } from '@/server/services/auth.service';
import { detalleOfertaEmpresa } from '@/server/services/ofertas.service';
import { insertarAdjunto } from '@/server/repositories/ofertas.repository';
import { fail } from '@/server/services/http-errors';
export const runtime='nodejs';
const MAX_BYTES=15*1024*1024;
export async function POST(request,{params}){
  if(!verificarOrigen(request))return errorJson('Solicitud no permitida.',403);
  const usuario=obtenerUsuarioDeRequest(request);
  let fullPath;
  try {
    const id=(await params).id;
    if(!usuario||usuario.rol!=='empresa'||usuario.estado_verificacion!=='aprobada')throw new ErrorDeNegocio('No tienes permiso.',403);
    const oferta=detalleOfertaEmpresa(usuario,id);
    if(!['borrador','publicada'].includes(oferta.estado))throw new ErrorDeNegocio('La oferta está cerrada.',409);
    const form=await request.formData();const file=form.get('archivo');
    if(!file||typeof file.arrayBuffer!=='function')throw new ErrorDeNegocio('Selecciona un archivo PDF.');
    if(file.size<5||file.size>MAX_BYTES)throw new ErrorDeNegocio('El PDF debe medir menos de 15 MB.');
    const buffer=Buffer.from(await file.arrayBuffer());
    if(buffer.subarray(0,5).toString('ascii')!=='%PDF-')throw new ErrorDeNegocio('El archivo debe ser un PDF válido.');
    const original=String(file.name||'anexo.pdf').replace(/[\\/\x00-\x1F]/g,'_').slice(0,150);
    if(!original.toLowerCase().endsWith('.pdf'))throw new ErrorDeNegocio('Solo se admiten PDF.');
    const relative=path.join('storage','ofertas',String(oferta.id),randomUUID()+'.pdf');
    fullPath=path.resolve(process.cwd(),relative);
    await fs.mkdir(path.dirname(fullPath),{recursive:true});
    await fs.writeFile(fullPath,buffer,{flag:'wx',mode:0o600});
    const record=insertarAdjunto(usuario.empresa_id,oferta.id,{nombre:original,ruta:relative,bytes:buffer.length});
    if(record.error){await fs.unlink(fullPath);return errorJson(record.error,409);}
    return NextResponse.json({ok:true,archivo:{...record,nombre_original:original,tamano_bytes:buffer.length}},{status:201});
  }catch(error){
    if(fullPath)await fs.unlink(fullPath).catch(()=>{});
    return fail(error,'cargando archivo de oferta');
  }
}
