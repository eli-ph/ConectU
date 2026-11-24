/**
 * Procesamiento exclusivo de eventos Observer de ConectU (sin correos Gmail).
 * CMD: node --env-file=.env.local scripts\procesar_eventos_6a.mjs --watch
 * No modifica páginas ni inicia reinicios de Next.js.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';
import { procesarEventos } from '../src/server/notificaciones/core.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dbfile=path.resolve(root, process.env.DATABASE_PATH || 'database/backend.db');
const db=new Database(dbfile,{fileMustExist:true});
db.pragma('foreign_keys=ON');
db.pragma('busy_timeout=5000');
const watch=process.argv.includes('--watch');
let running=true;
process.on('SIGINT',()=>{running=false;});
process.on('SIGTERM',()=>{running=false;});
console.log('[ConectU 6A] Procesador de eventos Observer activo. No envía correos.');
try {
  do {
    let total=0;
    try {
      do {
        const batch=procesarEventos(db,100);
        total+=batch;
        if(batch<100)break;
      }while(total<1000);
      if(total>0)console.log(`[ConectU 6A] Eventos procesados: ${total}`);
    } catch(error){
      console.error('[ConectU 6A] No se pudieron procesar eventos:',error.message);
      if(!watch)process.exitCode=1;
    }
    if(!watch||!running)break;
    await new Promise(resolve=>setTimeout(resolve,15000));
  } while(running);
} finally { db.close(); }
