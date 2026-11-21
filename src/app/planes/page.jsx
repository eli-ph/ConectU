import Link from "next/link";
import { Check, Gem, Sparkles } from "lucide-react";
import { PublicFooter } from "@/components/public-footer";
import { PublicHeader } from "@/components/public-header";

export const metadata = { title: "Planes para empresas" };

const plans = [
  { name: "Gratuito", price: "$0", offers: "10 ofertas activas", promos: "Sin promociones incluidas", featured: false },
  { name: "Básico", price: "$99", offers: "20 ofertas activas", promos: "1 promoción de 7 días", featured: true },
  { name: "Premium", price: "$249", offers: "Sin cuota numérica", promos: "3 promociones de 7 días", featured: false },
];

export default function PlansPage() {
  return (
    <><PublicHeader /><main>
      <section className="bg-brand-navy-dark py-16 text-center text-white sm:py-20"><div className="container-page"><span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-sm text-brand-gold"><Gem size={16} /> Opciones para empresas aprobadas</span><h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold tracking-[-0.04em] sm:text-5xl">Elige la capacidad que necesita tu organización</h1><p className="mx-auto mt-5 max-w-2xl text-lg text-slate-300">Todos los planes incluyen el mismo panel y estadísticas. Cambian la capacidad de ofertas y las promociones incluidas.</p></div></section>
      <section className="container-page py-16"><div className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900"><strong>Precios ilustrativos.</strong> Las tarifas comerciales aún requieren validación.</div><div className="grid gap-5 lg:grid-cols-3">{plans.map((plan) => <PlanCard key={plan.name} {...plan} />)}</div><div className="mt-10 rounded-2xl border border-slate-200 bg-white p-7 sm:p-9"><div className="flex flex-col justify-between gap-5 md:flex-row md:items-center"><div><div className="flex items-center gap-2 text-brand-gold"><Sparkles size={18} /><span className="text-sm font-bold uppercase tracking-[0.1em]">Promociones adicionales</span></div><h2 className="mt-2 text-2xl font-bold text-brand-navy">Da mayor visibilidad a una oferta activa</h2><p className="mt-2 text-slate-600">Compra una promoción y asígnala posteriormente desde Mi plan.</p></div><Link href="/registro" className="shrink-0 rounded-lg bg-brand-navy px-6 py-3 text-center text-sm font-semibold text-white">Registrar empresa</Link></div></div></section>
    </main><PublicFooter /></>
  );
}

function PlanCard({ name, price, offers, promos, featured }) {
  return <article className={`relative rounded-2xl border bg-white p-7 ${featured ? 'border-brand-gold shadow-xl' : 'border-slate-200'}`}>{featured && <span className="absolute -top-3 left-6 rounded-full bg-brand-gold px-3 py-1 text-xs font-bold text-brand-navy-dark">Opción intermedia</span>}<h2 className="text-xl font-bold text-brand-navy">{name}</h2><div className="mt-5 flex items-end gap-2"><span className="text-4xl font-bold tracking-[-0.04em] text-brand-navy">{price}</span><span className="pb-1 text-sm text-slate-500">MXN / 30 días</span></div><div className="mt-7 space-y-3 text-sm text-slate-600"><p className="flex gap-2.5"><Check size={18} className="shrink-0 text-brand-gold" /> {offers}</p><p className="flex gap-2.5"><Check size={18} className="shrink-0 text-brand-gold" /> {promos}</p><p className="flex gap-2.5"><Check size={18} className="shrink-0 text-brand-gold" /> Dashboard y estadísticas</p><p className="flex gap-2.5"><Check size={18} className="shrink-0 text-brand-gold" /> Gestión de postulaciones</p></div><Link href="/registro" className={`mt-8 block rounded-lg px-5 py-3 text-center text-sm font-semibold ${featured ? 'bg-brand-navy text-white' : 'border border-brand-navy text-brand-navy'}`}>Comenzar registro</Link></article>;
}
