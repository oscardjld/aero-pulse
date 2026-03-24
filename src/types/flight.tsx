export interface Flight {
    icao24: string;
    callsign: string;
    origin_country: string;
    longitude: number;
    latitude: number;
    baro_altitude: number; // Altitud en metros
    velocity: number;      // Velocidad en m/s
    true_track: number;    // Dirección en grados (0-360)
    on_ground: boolean;
}

// Estructura de la respuesta cruda de OpenSky
export interface OpenSkyResponse {
    time: number;
    states: (string | number | boolean | null)[][];
}