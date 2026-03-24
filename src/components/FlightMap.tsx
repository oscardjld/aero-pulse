import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { Flight } from '../types/flight';
import 'leaflet/dist/leaflet.css';

// Componente interno para manejar la animación de vuelo
function MapController({ selectedFlight }: { selectedFlight: Flight | null }) {
    const map = useMap();

    useEffect(() => {
        if (selectedFlight) {
        map.flyTo([selectedFlight.latitude, selectedFlight.longitude], 8, {
            duration: 1.5,
            easeLinearity: 0.25,
        });
        }
    }, [selectedFlight, map]);

    return null;
    }

    const createAirplaneIcon = (course: number) => {
    return L.divIcon({
        html: `
            <div style="transform: rotate(${course}deg); display: flex; justify-content: center; align-items: center;">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 16V14.5L13 9.5V3.5C13 2.67 12.33 2 11.5 2C10.67 2 10 2.67 10 3.5V9.5L2 14.5V16L10 13.5V19L8 20.5V22L11.5 21L15 22V20.5L13 19V13.5L21 16Z" 
                    fill="#60A5FA" stroke="#1E3A8A" stroke-width="0.5"/>
                </svg>
            </div>
            `,
        className: 'custom-airplane-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

interface FlightMapProps {
    flights: Flight[];
    selectedFlight: Flight | null; // Nueva prop
}

export const FlightMap = ({ flights, selectedFlight }: FlightMapProps) => {
    return (
        <div className="w-full h-full min-h-full">
        <MapContainer
            center={[20, 0]}
            zoom={3}
            preferCanvas={true}
            scrollWheelZoom={true}
            className="w-full h-full"
            style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
        >
            <TileLayer
            attribution='&copy; CARTO'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {/* El controlador que escucha los cambios de selección */}
            <MapController selectedFlight={selectedFlight} />

            {flights.map((flight) => (
            <Marker
                key={flight.icao24}
                position={[flight.latitude, flight.longitude]}
                icon={createAirplaneIcon(flight.true_track)}
            >
                <Popup>
                <div className="p-1">
                    <p className="font-bold text-blue-600 font-mono">{flight.callsign || 'N/A'}</p>
                    <p className="text-[10px] text-slate-500">{flight.origin_country}</p>
                </div>
                </Popup>
            </Marker>
            ))}
        </MapContainer>
        </div>
    );
};