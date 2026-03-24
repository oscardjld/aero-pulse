import { X, PlaneTakeoff, MapPin, GaugeCircle, Mountain, Timer } from 'lucide-react';
import type { Flight } from '../types/flight';

interface FlightDetailPanelProps {
    flight: Flight | null;
    onClose: () => void;
    lang: 'es' | 'en'; // <-- Esto soluciona el error en App.tsx
}

export const FlightDetailPanel = ({ flight, onClose, lang }: FlightDetailPanelProps) => {
    if (!flight) return null;

    const t = {
        es: {
        telemetry: "Telemetría en Tiempo Real",
        altitude: "Altitud",
        speed: "Velocidad",
        track: "Dirección (Rumbo)",
        status: "Estado en Tierra",
        ground: "En Tierra",
        airborne: "En Vuelo",
        origin: "País de Origen"
        },
        en: {
        telemetry: "Real-Time Telemetry",
        altitude: "Altitude",
        speed: "Speed",
        track: "Direction (Track)",
        status: "Ground Status",
        ground: "On Ground",
        airborne: "Airborne",
        origin: "Origin Country"
        }
    }[lang];

  const altitudeFeet = Math.round(flight.baro_altitude * 3.28084);
  const speedKnots = Math.round(flight.velocity * 1.94384);

    return (
        <aside className="absolute top-0 right-0 bottom-0 w-full sm:w-80 md:w-96 z-1000 bg-slate-900/60 backdrop-blur-2xl p-6 border-l border-white/5 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-right duration-300 pointer-events-auto">
        <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
                <PlaneTakeoff className="text-blue-400 w-6 h-6" />
            </div>
            <div>
                <h2 className="text-xl font-black text-white font-mono tracking-tight">{flight.callsign || 'N/A'}</h2>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black italic">ICAO: {flight.icao24}</p>
            </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors cursor-pointer">
            <X className="w-5 h-5" />
            </button>
        </div>

        <div className="h-px w-full bg-linear-to-r from-transparent via-blue-500/30 to-transparent"></div>

        <div className="flex-1 overflow-y-auto space-y-6 pr-1 custom-scrollbar">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 flex items-center gap-4">
            <MapPin className="text-slate-500 w-5 h-5 shrink-0" />
            <div className="flex-1">
                <p className="text-[10px] uppercase text-slate-500 font-bold">{t.origin}</p>
                <p className="text-sm font-bold text-white tracking-wide uppercase">{flight.origin_country}</p>
            </div>
            </div>

            <div className="space-y-4">
            <h3 className="text-[10px] uppercase font-black tracking-widest text-slate-500 px-1">{t.telemetry}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-1">
                <div className="flex justify-between items-center text-slate-500 mb-1">
                    <span className="text-[10px] uppercase font-bold">{t.altitude}</span>
                    <Mountain className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-white font-mono leading-none">{Math.round(flight.baro_altitude)}m</p>
                <p className="text-[9px] text-blue-400 font-mono opacity-70 uppercase tracking-tighter">{altitudeFeet.toLocaleString()} FT</p>
                </div>
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-1">
                <div className="flex justify-between items-center text-slate-500 mb-1">
                    <span className="text-[10px] uppercase font-bold">{t.speed}</span>
                    <GaugeCircle className="w-4 h-4" />
                </div>
                <p className="text-xl font-black text-white font-mono leading-none">{Math.round(flight.velocity * 3.6)}k/h</p>
                <p className="text-[9px] text-blue-400 font-mono opacity-70 uppercase tracking-tighter">{speedKnots} KT</p>
                </div>
            </div>

            <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
                <Timer className="text-slate-500 w-5 h-5" />
                <div className="flex-1">
                <p className="text-[10px] uppercase text-slate-500 font-bold">{t.track}</p>
                <p className="text-sm font-bold text-slate-300 font-mono">{flight.true_track.toFixed(1)}°</p>
                </div>
                <div style={{ transform: `rotate(${flight.true_track}deg)` }} className="p-2 bg-blue-500/10 rounded-full text-blue-400 transition-transform duration-500">
                <PlaneTakeoff className="w-5 h-5" />
                </div>
            </div>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5">
            <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase text-slate-500 font-bold">{t.status}</span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-md border uppercase ${flight.on_ground ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' : 'bg-green-500/10 text-green-400 border-green-500/30'}`}>
                {flight.on_ground ? t.ground : t.airborne}
                </span>
            </div>
            </div>
        </div>
        </aside>
    );
};