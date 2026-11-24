/** Entrega diferida, vía Gmail API HTTPS (no SMTP ni dependencias adicionales). */
function requiredEnv() {
  const id=process.env.GMAIL_CLIENT_ID;
  const secret=process.env.GMAIL_CLIENT_SECRET;
  const refresh=process.env.GMAIL_REFRESH_TOKEN;
  const from=process.env.GMAIL_FROM_EMAIL || process.env.GMAIL_SENDER_EMAIL || process.env.GMAIL_EMAIL;
  if(!id||!secret||!refresh||!from)throw new Error(
    'Gmail no está configurado: define GMAIL_CLIENT_ID, GMAIL_CLIENT_SECRET, GMAIL_REFRESH_TOKEN y GMAIL_FROM_EMAIL.');
  return {id,secret,refresh,from};
}
function validEmail(value) {
  const email=String(value||'').trim();
  if(!/^[\w.+%-]+@[\w.-]+\.[A-Za-z]{2,}$/.test(email))throw new Error('Dirección de correo inválida.');
  return email;
}
const mimeSubject=(subject)=>`=?UTF-8?B?${Buffer.from(subject,'utf8').toString('base64')}?=`;
function gmailMIME({to,from,subject,body,notificationId}) {
  const text=Buffer.from(String(body),'utf8').toString('base64').match(/.{1,76}/g)?.join('\r\n')||'';
  return [
    `From: ${validEmail(from)}`, `To: ${validEmail(to)}`,
    `Subject: ${mimeSubject(String(subject).replace(/[\r\n]/g,' '))}`,
    `Message-ID: <conectu-notificacion-${Number(notificationId)}@conectu.local>`,
    'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64', '', text,
  ].join('\r\n');
}
export async function enviarCorreoNotificacion({to,subject,body,notificationId},fetchImpl=fetch) {
  const {id,secret,refresh,from}=requiredEnv();
  const params=new URLSearchParams({client_id:id,client_secret:secret,refresh_token:refresh,grant_type:'refresh_token'});
  const tokenResponse=await fetchImpl('https://oauth2.googleapis.com/token',{
    method:'POST',body:params,headers:{'Content-Type':'application/x-www-form-urlencoded'},
    signal:AbortSignal.timeout(15000),
  });
  const token=await tokenResponse.json();
  if(!tokenResponse.ok||!token.access_token)throw new Error(`Gmail OAuth no autorizó el token (HTTP ${tokenResponse.status}).`);
  const mime=gmailMIME({from,to,subject,body,notificationId});
  const raw=Buffer.from(mime,'utf8').toString('base64url');
  const response=await fetchImpl('https://gmail.googleapis.com/gmail/v1/users/me/messages/send',{
    method:'POST',headers:{Authorization:`Bearer ${token.access_token}`,'Content-Type':'application/json'},
    body:JSON.stringify({raw}),signal:AbortSignal.timeout(20000),
  });
  if(!response.ok)throw new Error(`Gmail rechazó el envío (HTTP ${response.status}).`);
  const result=await response.json();
  if(!result.id)throw new Error('Gmail no devolvió un identificador de mensaje.');
  return result.id;
}
