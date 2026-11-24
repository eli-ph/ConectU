// Un catálogo de estados para estudiante y empresa. Los códigos son los de SQLite.
export const APPLICATION_STATUS = Object.freeze({
  enviada:{label:'Enviada',tone:'blue'},
  en_revision:{label:'En revisión',tone:'amber'},
  aceptada:{label:'Aceptada',tone:'green'},
  rechazada:{label:'Rechazada',tone:'red'},
  retirada:{label:'Retirada',tone:'slate'},
  cerrada:{label:'Cerrada',tone:'slate'},
});
export function estadoPostulacion(estado){return APPLICATION_STATUS[estado]||{label:estado,tone:'slate'};}
