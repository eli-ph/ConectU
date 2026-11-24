import { NextResponse } from 'next/server';
import fs from 'node:fs/promises';
import path from 'node:path';
import { hoyMexico } from '@/server/services/ofertas.service';
import { obtenerAdjuntoPublicado } from '@/server/repositories/ofertas.repository';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(_request,{params}) {
  const {id,archivoId}=await params;
  if(!/^\d+$/.test(id)||!/^\d+$/.test(archivoId))return new Response('No encontrado',{status:404});
  const doc=obtenerAdjuntoPublicado(Number(id),Number(archivoId),hoyMexico());
  if(!doc)return new Response('No encontrado',{status:404});
  const root=path.resolve(process.cwd(),'storage','ofertas',String(id));
  const file=path.resolve(process.cwd(),doc.ruta_archivo);
  if(!file.startsWith(root+path.sep))return new Response('No encontrado',{status:404});
  try{const content=await fs.readFile(file);
    return new NextResponse(content,{headers:{'Content-Type':'application/pdf',
      'Content-Disposition':`inline; filename="anexo-${doc.id}.pdf"`,
      'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff'}});
  }catch{return new Response('Documento no disponible',{status:404});}
}
