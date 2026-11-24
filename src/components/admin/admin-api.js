'use client';
export async function consultarAdministracion(vista,signal){const r=await fetch(`/api/admin/gestion?vista=${encodeURIComponent(vista)}`,{cache:'no-store',signal});const d=await r.json();if(!r.ok||!d.ok)throw new Error(d.message||'No se pudieron cargar los datos.');return d;}
export async function operacionAdministracion(data){const r=await fetch('/api/admin/gestion',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});const d=await r.json();if(!r.ok||!d.ok)throw new Error(d.message||'No se pudo completar la operación.');return d;}
