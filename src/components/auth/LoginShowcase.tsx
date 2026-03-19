import {
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import showcaseBackground from '../../assets/image-stoke.jpg';


export function LoginShowcase() {
  return (
    <div className="relative hidden h-2/6 overflow-hidden rounded-[30px] bg-slate-950 p-5 text-white shadow-[0_30px_80px_rgba(15,23,42,0.32)] md:block lg:min-h-[590px]">
      <img
        src={showcaseBackground}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,_rgba(15,23,42,0.86),_rgba(15,23,42,0.68)_52%,_rgba(120,113,47,0.34))]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(252,211,77,0.18),_transparent_34%),radial-gradient(circle_at_bottom_left,_rgba(56,189,248,0.14),_transparent_36%)]" />
      <div className="absolute -right-24 top-0 h-64 w-64 rounded-full bg-amber-200/15 blur-3xl" />
      <div className="absolute -left-20 bottom-10 h-56 w-56 rounded-full bg-cyan-300/10 blur-3xl" />

      <div className="relative z-10 flex h-2/6 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="max-w-sm">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.24em] text-slate-200 backdrop-blur">
              <Sparkles className="h-3 w-3 text-amber-300" />
              Gestion intelligente
            </div>
            <h2 className="mt-4 text-2xl font-semibold leading-tight text-white xl:text-[1.8rem]">
              Pilotez vos ventes, vos stocks et votre equipe sur une seule interface.
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-300">
              Une experience plus claire pour les operations quotidiennes, la supervision des
              caisses et le suivi des performances en temps reel.
            </p>
          </div>

          <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur">
            <ArrowUpRight className="h-5 w-5 text-amber-300" />
          </div>
        </div>

        <div className="relative mt-1 flex-1"> 

          <div className="absolute h-60 inset-x-0 bottom-6 top-10 rounded-[32px] border border-white/10 bg-white/10 p-4 backdrop-blur-xl">
            
          </div>
        </div>
      </div>
    </div>
  );
}
