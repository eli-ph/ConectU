import { NextResponse } from 'next/server';
import { verificarEventoStripe } from '@/server/integrations/stripe-checkout';
import { procesarEventoStripe } from '@/server/services/compras.service';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export async function POST(request){
 let event;
 try {event=verificarEventoStripe(await request.text(),request.headers.get('stripe-signature'));}
 catch(error){console.warn('[ConectU] Stripe webhook: firma inválida:',error.message);return NextResponse.json({received:false},{status:400});}
 try {
  await procesarEventoStripe(event);
  return NextResponse.json({received:true});
 }catch(error){
  // Stripe reintentará la entrega. Jamás se confirma un pago solo por la URL de retorno.
  console.error('[ConectU] Webhook Stripe no conciliado:',event.id,event.type,error.message);
  return NextResponse.json({received:false},{status:500});
 }
}
