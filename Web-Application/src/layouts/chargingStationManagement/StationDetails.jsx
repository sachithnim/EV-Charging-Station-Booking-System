import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button/Button";
import { getStationById } from "../../services/stations/stations";
import MapPreviewLeaflet from "../../components/maps/MapPreviewLeaflet";

export default function StationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getStationById(id);
        setStation(data);
      } catch (err) {
        console.error("Failed to fetch station:", err);
        setError("Failed to load station details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="text-gray-600">Loading station details...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!station) return <div className="text-gray-600">No station found.</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{station.name}</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>Back</Button>
          <Button onClick={() => navigate(`/charging-station-management/${id}/edit`)}>Edit</Button>
          <Button variant="outline" onClick={() => navigate(`/charging-station-management/${id}/slots`)}>Manage Slots</Button>
        </div>
      </div>

      {/* Station Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">General Information</h2>
          <p><b>Name:</b> {station.name}</p>
          <p><b>Type:</b> {station.type}</p>
          <p><b>Status:</b> {station.isActive ? "Active" : "Inactive"}</p>
          <p><b>Address:</b> {station.address}</p>
          <p><b>Latitude:</b> {station.latitude}</p>
          <p><b>Longitude:</b> {station.longitude}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Location</h2>
        <p className="text-sm text-gray-600 mb-3">{station.address}</p>
        <MapPreviewLeaflet lat={station.latitude} lng={station.longitude} />
    </div>


      {/* Schedule */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Schedules</h2>
        {station.schedules?.length > 0 ? (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold">Day</th>
                <th className="text-left py-3 px-4 font-semibold">Start Time</th>
                <th className="text-left py-3 px-4 font-semibold">End Time</th>
                <th className="text-left py-3 px-4 font-semibold">Slot Count</th>
              </tr>
            </thead>
            <tbody>
              {station.schedules.map((s, idx) => (
                <tr key={idx} className="border-b border-gray-100">
                  <td className="py-2 px-4">
                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][s.dayOfWeek]}
                  </td>
                  <td className="py-2 px-4">{s.startTime}</td>
                  <td className="py-2 px-4">{s.endTime}</td>
                  <td className="py-2 px-4">{s.slotCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-gray-600">No schedules available.</p>
        )}
      </div>
    </div>
  );
}
