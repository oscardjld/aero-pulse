import { useEffect, useState, useMemo, useRef } from 'react';
import { mockFlights } from './data/mockFlights';
import aeroPulseLogo from './assets/aero_pulse_logo.png';

// Estilos y Tipos
import 'leaflet/dist/leaflet.css';
import type { Flight } from './types/flight';
import { fetchFlights } from './services/api';

// Componentes y UI
import { FlightMap } from './components/FlightMap';
import { FlightDetailPanel } from './components/FlightDetailPanel';
import { Activity, Search, X, Wind, Languages } from 'lucide-react';

const translations = {
  es: {
    ops_control: "Control de Ops",
    search_placeholder: "EJ: IBE321...",
    live_traffic: "Tráfico en Vivo",
    sync: "SINC",
    loading: "Estableciendo Conexión Satelital...",
    min_alt: "Altitud Mín"
  },
  en: {
    ops_control: "Ops Control",
    search_placeholder: "EX: IBE321...",
    live_traffic: "Live Traffic",
    sync: "SYNC",
    loading: "Establishing Satellite Link...",
    min_alt: "Min Altitude"
  }
};

function App() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdate, setLastUpdate] = useState<string>('');
  const [lang, setLang] = useState<'es' | 'en'>('es');
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [minAltitude, setMinAltitude] = useState<number>(0);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const t = translations[lang];

  const getData = async () => {
    const data = await fetchFlights();
    if (data.length > 0) {
      setFlights(data);
    } else if (flights.length === 0) {
      setFlights(mockFlights);
    }
    setLastUpdate(new Date().toLocaleTimeString());
    setLoading(false);
  };

  useEffect(() => {
    getData();
    const interval = setInterval(getData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedFlight) {
      const element = document.getElementById(`flight-${selectedFlight.icao24}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedFlight]);

  const filteredFlights = useMemo(() => {
    return flights.filter(flight => 
      (flight.callsign?.toLowerCase() || '').includes(searchTerm.toLowerCase()) &&
      flight.baro_altitude >= minAltitude
    );
  }, [flights, searchTerm, minAltitude]);

  return (
    <div className="flex flex-col h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-blue-500/30">
      <header className="h-16 shrink-0 border-b border-white/5 bg-slate-900/50 flex items-center px-4 lg:px-10 z-50 backdrop-blur-md">
        <div className="w-full max-w-1920px mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* NUEVO LOGO PNG INTEGRADO */}
            <div className="relative group shrink-0">
              <div className="absolute -inset-1 bg-blue-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <div className="relative bg-slate-900/50 border border-white/10 p-1 rounded-xl shadow-xl flex items-center justify-center">
                <img 
                  src={aeroPulseLogo} 
                  alt="Aero-Pulse" 
                  className="w-8 h-8 md:w-10 md:h-10 object-contain" 
                />
              </div>
            </div>
            
            <div>
              <h1 className="text-lg md:text-xl font-black tracking-tighter text-white uppercase italic leading-none">Aero-Pulse</h1>
              <p className="hidden xs:block text-[8px] md:text-[9px] text-blue-400 font-mono tracking-widest uppercase opacity-80 mt-1">Radar v4.0.2</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setLang(lang === 'es' ? 'en' : 'es')}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all uppercase cursor-pointer"
            >
              <Languages className="w-3.5 h-3.5 text-blue-400" />
              {lang === 'es' ? 'English' : 'Español'}
            </button>
            <div className="flex flex-col items-end min-w-80px text-right font-mono">
              <span className="text-slate-500 text-[9px] uppercase font-black">{t.sync}</span>
              <span className="text-[10px] md:text-sm text-blue-400">{lastUpdate || '--:--:--'}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row overflow-hidden p-3 md:p-6 gap-6 w-full max-w-1920px mx-auto">
        <aside className="w-full md:w-80 lg:w-96 shrink-0 bg-slate-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 shadow-2xl flex flex-col gap-6 overflow-hidden max-h-[35vh] md:max-h-full">
          <div className="flex items-center justify-between shrink-0">
            <h2 className="text-xs font-black uppercase tracking-widest text-white">{t.ops_control}</h2>
            <Activity className="text-blue-500 w-4 h-4" />
          </div>

          <div className="relative shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600 w-4 h-4" />
            <input 
              type="text" placeholder={t.search_placeholder} value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 p-3 pl-10 rounded-xl text-sm outline-none focus:border-blue-500/50 transition-all font-mono"
            />
            {searchTerm && <X className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 cursor-pointer hover:text-white" onClick={() => setSearchTerm('')} />}
          </div>

          <div className="space-y-3 shrink-0 hidden md:block border-b border-white/5 pb-4">
            <div className="flex justify-between items-end px-1">
              <label className="text-[9px] uppercase tracking-widest text-slate-500 font-black">{t.min_alt}</label>
              <span className="font-mono text-blue-400 text-xs font-bold">{minAltitude.toLocaleString()}m</span>
            </div>
            <input 
              type="range" min="0" max="12000" step="500" value={minAltitude}
              onChange={(e) => setMinAltitude(Number(e.target.value))}
              className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          <div className="flex-1 overflow-hidden flex flex-col gap-4">
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-black px-1">{t.live_traffic} ({filteredFlights.length})</p>
            <div ref={listRef} className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar will-change-scroll">
              {filteredFlights.map(f => (
                <div 
                  key={f.icao24} id={`flight-${f.icao24}`}
                  onClick={() => setSelectedFlight(f)}
                  className={`bg-white/5 border p-3 rounded-xl flex justify-between items-center hover:bg-white/10 transition-all group cursor-pointer ${selectedFlight?.icao24 === f.icao24 ? 'border-blue-500 bg-blue-500/10' : 'border-white/5'}`}
                >
                  <div className="flex flex-col">
                    <p className="font-mono text-blue-400 font-bold text-sm tracking-tight">{f.callsign}</p>
                    <p className="text-[8px] md:text-[9px] text-slate-500 uppercase font-medium truncate w-32 tracking-wider">{f.origin_country}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-300 font-mono font-bold">{Math.round(f.baro_altitude)}m</p>
                    <div className="flex items-center justify-end gap-1 text-[9px] text-slate-600 font-mono">
                      <Wind className="w-3 h-3" />
                      {Math.round(f.velocity * 3.6)}km/h
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="flex-1 relative rounded-3xl overflow-hidden border border-white/5 bg-slate-900 shadow-2xl">
          <div className="relative h-full w-full">
            {loading && flights.length === 0 ? (
              <div className="h-full w-full flex flex-col items-center justify-center bg-slate-950 gap-4 absolute inset-0 z-20">
                <Activity className="animate-spin text-blue-500 w-8 h-8" />
                <span className="text-slate-500 font-mono text-[10px] tracking-widest uppercase animate-pulse">{t.loading}</span>
              </div>
            ) : (
              <>
                <div className="absolute inset-0">
                  <FlightMap flights={filteredFlights} selectedFlight={selectedFlight} />
                </div>
                <div className="absolute top-0 right-0 h-full w-full md:w-96 pointer-events-none z-1000">
                  <div className="pointer-events-auto h-full">
                    <FlightDetailPanel flight={selectedFlight} onClose={() => setSelectedFlight(null)} lang={lang} />
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;