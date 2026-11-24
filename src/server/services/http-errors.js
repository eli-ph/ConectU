import { errorJson } from '@/server/auth/http';
import { ErrorDeNegocio } from '@/server/services/auth.service';
export function fail(error,contexto){
  if(error instanceof ErrorDeNegocio)return errorJson(error.message,error.status);
  if(error instanceof SyntaxError)return errorJson('Revisa los datos enviados.');
  console.error(`[ConectU] Error ${contexto}:`,error?.code||error?.message);
  return errorJson('No pudimos completar la operación. Inténtalo de nuevo.',500);
}
