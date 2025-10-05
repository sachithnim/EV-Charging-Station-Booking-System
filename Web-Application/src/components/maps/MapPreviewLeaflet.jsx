import { useMemo } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";

const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function MapPreviewLeaflet({ lat, lng }) {
  const center = useMemo(
    () => ({
      lat: isFinite(lat) ? Number(lat) : 6.9271,
      lng: isFinite(lng) ? Number(lng) : 79.8612,
    }),
    [lat, lng]
  );

  return (
    <div className="w-full h-[220px] rounded-xl overflow-hidden">
      <MapContainer center={center} zoom={14} dragging={false} scrollWheelZoom={false} doubleClickZoom={false} style={{ width: "100%", height: "100%" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={icon} />
      </MapContainer>
    </div>
  );
}
