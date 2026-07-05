import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

export interface MapPin {
    id: number;
    name: string;
    lat: number;
    lng: number;
    href: string;
    subtitle?: string;
}

export type MapFocus =
    | { type: 'point'; lat: number; lng: number; zoom?: number }
    | { type: 'bounds'; points: [number, number][] }
    | null;

function pinIcon(active: boolean) {
    const size = active ? 30 : 24;
    const color = active ? '#FF6700' : '#7B3B2A';
    return L.divIcon({
        html: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" fill="none" style="filter:drop-shadow(0 2px 3px rgb(0 0 0 / 0.35))">
            <path d="M12 0C7.58 0 4 3.58 4 8c0 6 8 16 8 16s8-10 8-16c0-4.42-3.58-8-8-8z" fill="${color}"/>
            <circle cx="12" cy="8" r="3.5" fill="white"/>
        </svg>`,
        className: '',
        iconSize: [size, size * (32 / 24)],
        iconAnchor: [size / 2, size * (32 / 24)],
        popupAnchor: [0, -(size * (32 / 24))],
    });
}

function MapController({ focus }: { focus: MapFocus }) {
    const map = useMap();

    useEffect(() => {
        if (!focus) return;

        const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        const duration = reduceMotion ? 0 : 0.6;

        if (focus.type === 'point') {
            map.flyTo([focus.lat, focus.lng], focus.zoom ?? 15, { duration });
        } else if (focus.type === 'bounds' && focus.points.length > 0) {
            if (focus.points.length === 1) {
                map.flyTo(focus.points[0], 14, { duration });
            } else {
                map.flyToBounds(L.latLngBounds(focus.points), { padding: [48, 48], duration, maxZoom: 14 });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [focus]);

    return null;
}

function PinMarker({ pin, active }: { pin: MapPin; active: boolean }) {
    const markerRef = useRef<L.Marker>(null);

    useEffect(() => {
        if (active) markerRef.current?.openPopup();
    }, [active]);

    return (
        <Marker ref={markerRef} position={[pin.lat, pin.lng]} icon={pinIcon(active)}>
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
    );
}

interface Props {
    pins: MapPin[];
    center?: [number, number];
    zoom?: number;
    className?: string;
    focus?: MapFocus;
    activeId?: number | null;
}

export default function PinMap({ pins, center, zoom = 13, className, focus = null, activeId = null }: Props) {
    const mapCenter: [number, number] =
        center ??
        (pins.length > 0
            ? [pins[0].lat, pins[0].lng]
            : [-18.665695, 35.529562]);

    return (
        <MapContainer
            center={mapCenter}
            zoom={zoom}
            className={className}
            style={{ height: '100%', width: '100%' }}
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapController focus={focus} />
            {pins.map(pin => (
                <PinMarker key={pin.id} pin={pin} active={pin.id === activeId} />
            ))}
        </MapContainer>
    );
}
