// Stripe Checkout mediante HTTPS, sin dependencias npm adicionales.
// Esta etapa habilita EXCLUSIVAMENTE el entorno de prueba.
import { createHmac, timingSafeEqual } from 'node:crypto';

export function exigirStripePruebas() {
  const secret = process.env.STRIPE_SECRET_KEY || '';
  if (!secret.startsWith('sk_test_')) throw new Error('Stripe Checkout no está configurado en modo de prueba.');
  return secret;
}

export function obtenerOrigenPublico(requestOrigin = null) {
  const raw=process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || '';
  if(!raw) throw new Error('Configura APP_URL para los retornos de Stripe.');
  const url=new URL(raw);
  if (!(url.protocol==='https:' || (url.protocol==='http:' && ['localhost','127.0.0.1'].includes(url.hostname))))
    throw new Error('APP_URL debe usar HTTPS o localhost.');
  if (!requestOrigin) return url.origin;
  const requestUrl=new URL(requestOrigin);
  const local=(hostname)=>['localhost','127.0.0.1'].includes(hostname);
  if (requestUrl.origin===url.origin) return url.origin;
  // En local, localhost y 127.0.0.1 tienen cookies distintas. El retorno usa
  // exactamente el host/puerto con el que se autenticó el navegador.
  if (local(url.hostname)&&local(requestUrl.hostname)&&requestUrl.protocol==='http:'&&requestUrl.port===url.port)
    return requestUrl.origin;
  throw new Error('APP_URL debe coincidir con el origen donde iniciaste sesión en ConectU.');
}

async function stripePost(endpoint, parameters, idempotencyKey) {
  const body=new URLSearchParams();
  for(const [k,v] of Object.entries(parameters)) if(v != null) body.set(k,String(v));
  const response=await fetch(`https://api.stripe.com/v1/${endpoint}`,{
    method:'POST',headers:{
      Authorization:`Bearer ${exigirStripePruebas()}`,
      'Content-Type':'application/x-www-form-urlencoded',
      ...(idempotencyKey?{'Idempotency-Key':idempotencyKey}:{})
    },body:body.toString(),cache:'no-store',signal:AbortSignal.timeout(20000)
  });
  const result=await response.json().catch(()=>({}));
  if(!response.ok) {
    const error=new Error(`Stripe no pudo procesar la solicitud (${response.status}).`);
    error.providerMessage=result.error?.message || 'Sin detalle del proveedor';
    error.stripeCode=result.error?.code || null;
    error.stripeParam=result.error?.param || null;
    error.stripeType=result.error?.type || null;
    error.httpStatus=response.status;
    error.stripeRequestId=response.headers?.get?.('request-id') || null;
    throw error;
  }
  return result;
}

export async function crearCheckout({folio,compraId,intentoId,nombre,importe,email,requestOrigin=null}) {
  const origin=obtenerOrigenPublico(requestOrigin);
  // Solo tarjeta, usando el parámetro compatible con Stripe Checkout API 2026-09-30.endive y posteriores.
  // No habilita métodos asíncronos como SPEI/OXXO en esta integración de prueba.
  return stripePost('checkout/sessions',{
    mode:'payment',
    'allowed_payment_method_types[0]':'card',
    'line_items[0][price_data][currency]':'mxn',
    'line_items[0][price_data][unit_amount]':importe,
    'line_items[0][price_data][product_data][name]':nombre,
    'line_items[0][quantity]':1,
    client_reference_id:folio,
    customer_email:email,
    ...(intentoId ? {'metadata[conectu_intento_id]':intentoId} : {'metadata[conectu_compra_id]':compraId}),
    'metadata[conectu_folio]':folio,
    success_url:`${origin}/empresa/compras?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url:`${origin}/empresa/plan`,
    // Stripe exige un mínimo de 30 minutos medido DESDE que recibe la solicitud.
    // Exactamente 1800 s puede quedar por debajo del mínimo por la latencia de red.
    // Se otorgan 35 min; el bloqueo interno se mantiene 36 min como margen.
    expires_at:Math.floor(Date.now()/1000)+35*60,
  },intentoId?`conectu-intento-${folio}`:`conectu-compra-${compraId}`);
}

export async function reembolsarPago({paymentIntent,compraId}) {
  if(!paymentIntent || !/^pi_[a-zA-Z0-9]+$/.test(paymentIntent)) throw new Error('Referencia de pago inválida.');
  return stripePost('refunds',{payment_intent:paymentIntent,reason:'requested_by_customer'},`conectu-reembolso-compra-${compraId}`);
}

/** Verifica firma sobre los bytes crudos, con ventana máxima de cinco minutos. */
export function verificarEventoStripe(raw,header,secret=process.env.STRIPE_WEBHOOK_SECRET){
  exigirStripePruebas();
  if(!secret?.startsWith('whsec_') || typeof header!=='string') throw new Error('Firma de webhook no configurada.');
  const pairs=header.split(',').map(x=>x.trim().split('='));
  const timestamp=pairs.find(([key])=>key==='t')?.[1];
  const signatures=pairs.filter(([key])=>key==='v1').map(([,value])=>value).filter(Boolean);
  if(!/^\d+$/.test(timestamp||'') || !signatures.length) throw new Error('Falta la firma Stripe.');
  if(Math.abs(Date.now()/1000-Number(timestamp))>300) throw new Error('Firma fuera de vigencia.');
  const digest=createHmac('sha256',secret).update(`${timestamp}.${raw}`).digest('hex');
  const matched=signatures.some(sig=>{
    if(!/^[a-f0-9]{64}$/i.test(sig))return false;
    return timingSafeEqual(Buffer.from(digest,'hex'),Buffer.from(sig,'hex'));
  });
  if(!matched) throw new Error('Firma Stripe inválida.');
  const event=JSON.parse(raw);
  if(!event?.id?.startsWith('evt_')||!event?.type||!event?.data?.object) throw new Error('Evento Stripe inválido.');
  if(event.livemode!==false) throw new Error('Solo se aceptan eventos Stripe de prueba.');
  return event;
}
