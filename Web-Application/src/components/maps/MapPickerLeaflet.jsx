import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import Button from "../button/Button";

// default pin
const icon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function MapPickerLeaflet({ lat, lng, onChange }) {
  const center = useMemo(
    () => ({
      lat: isFinite(lat) ? Number(lat) : 6.9271,
      lng: isFinite(lng) ? Number(lng) : 79.8612,
    }),
    [lat, lng]
  );
  const [pos, setPos] = useState(center);

  useEffect(() => setPos(center), [center]);

  const onSelect = (p) => {
    setPos(p);
    onChange?.(p);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported.");
    navigator.geolocation.getCurrentPosition(
      (geo) => {
        const p = { lat: geo.coords.latitude, lng: geo.coords.longitude };
        setPos(p);
        onChange?.(p);
      },
      () => alert("Permission denied or unavailable.")
    );
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">Click on the map or drag the pin to set the exact location.</p>
        <Button size="sm" variant="secondary" onClick={useMyLocation}>Use My Location</Button>
      </div>

      <div className="w-full h-[320px] rounded-xl overflow-hidden">
        <MapContainer center={pos} zoom={14} style={{ width: "100%", height: "100%" }}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ClickHandler onSelect={onSelect} />
          <Marker
            position={pos}
            icon={icon}
            draggable
            eventHandlers={{
              dragend: (e) => {
                const { lat, lng } = e.target.getLatLng();
                onSelect({ lat, lng });
              },
            }}
          />
        </MapContainer>
      </div>
    </div>
  );
}
