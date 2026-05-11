import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export interface MapPin {
    id: number;
    name: string;
    lat: number;
    lng: number;
    href: string;
    subtitle?: string;
}

const pinIcon = L.divIcon({
    html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" fill="none">
        <path d="M12 0C7.58 0 4 3.58 4 8c0 6 8 16 8 16s8-10 8-16c0-4.42-3.58-8-8-8z" fill="#7B3B2A"/>
        <circle cx="12" cy="8" r="3.5" fill="white"/>
    </svg>`,
    className: '',
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32],
});

interface Props {
    pins: MapPin[];
    center?: [number, number];
    zoom?: number;
}

export default function PinMap({ pins, center, zoom = 13 }: Props) {
    const mapCenter: [number, number] =
        center ??
        (pins.length > 0
            ? [pins[0].lat, pins[0].lng]
            : [-18.665695, 35.529562]);

    return (
        <MapContainer
            center={mapCenter}
            zoom={zoom}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {pins.map(pin => (
                <Marker key={pin.id} position={[pin.lat, pin.lng]} icon={pinIcon}>
                    <Popup>
                        <div className="min-w-[140px]">
                            <p className="font-semibold text-sm text-gray-900">{pin.name}</p>
                            {pin.subtitle && (
                                <p className="text-xs text-gray-500 mt-0.5">{pin.subtitle}</p>
                            )}
                            <a
                                href={pin.href}
                                className="block mt-2 text-xs font-semibold text-[#7B3B2A] hover:underline"
                            >
                                Ver mais →
                            </a>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
}
