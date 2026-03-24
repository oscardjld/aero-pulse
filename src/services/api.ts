// src/services/api.ts
import type { Flight, OpenSkyResponse } from '../types/flight';

const BASE_URL = 'https://opensky-network.org/api';

export const fetchFlights = async (): Promise<Flight[]> => {
    try {
        const response = await fetch(`${BASE_URL}/states/all`);
        
        if (response.status === 429) {
        console.warn("⚠️ API Limit reached. Esperando...");
        return []; // Devolvemos array vacío pero sin romper la app
        }

        if (!response.ok) throw new Error('Network response was not ok');
        
        const data: OpenSkyResponse = await response.json();
        if (!data.states) return [];

        return data.states.slice(0, 150).map((state) => ({
        icao24: state[0] as string,
        callsign: (state[1] as string)?.trim() || 'N/A',
        origin_country: state[2] as string,
        longitude: state[5] as number,
        latitude: state[6] as number,
        baro_altitude: state[7] as number,
        on_ground: state[8] as boolean,
        velocity: state[9] as number,
        true_track: state[10] as number,
        })).filter(f => f.longitude !== null && f.latitude !== null);
    } catch (error) {
        console.error("Error fetching flights:", error);
        return [];
    }
};