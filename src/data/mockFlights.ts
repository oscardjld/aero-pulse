
import type { Flight } from '../types/flight';

export const mockFlights: Flight[] = [
    { icao24: 'a1b2c3', callsign: 'IBE3211', origin_country: 'Spain', longitude: -3.7038, latitude: 40.4168, baro_altitude: 10500, velocity: 230, true_track: 45, on_ground: false },
    { icao24: 'd4e5f6', callsign: 'AAL904', origin_country: 'United States', longitude: -74.0060, latitude: 40.7128, baro_altitude: 11000, velocity: 250, true_track: 270, on_ground: false },
    { icao24: 'g7h8i9', callsign: 'AFR012', origin_country: 'France', longitude: 2.3522, latitude: 48.8566, baro_altitude: 9000, velocity: 210, true_track: 180, on_ground: false },
    // Agrega unos 2 o 3 más de diferentes partes del mundo
];