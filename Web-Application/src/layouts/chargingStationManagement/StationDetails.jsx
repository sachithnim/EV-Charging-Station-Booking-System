import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button/Button";
import { getStationById } from "../../services/stations/stations";
import MapPreviewLeaflet from "../../components/maps/MapPreviewLeaflet";
import { 
  ArrowLeft, 
  Edit, 
  Settings, 
  MapPin, 
  Zap, 
  Clock, 
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";

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

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading station details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!station) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-700 font-medium">No station found.</p>
        </div>
      </div>
    );
  }

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {station.name}
          </h1>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-gray-400" />
            <p className="text-gray-600">{station.address}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <Button onClick={() => navigate(`/charging-station-management/${id}/edit`)}>
            <Edit className="w-5 h-5" />
            Edit
          </Button>
          <Button variant="outline" onClick={() => navigate(`/charging-station-management/${id}/slots`)}>
            <Settings className="w-5 h-5" />
            Manage Slots
          </Button>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-6">
        {station.isActive ? (
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-green-50 text-green-700 font-medium border border-green-200">
            <CheckCircle className="w-5 h-5 mr-2" />
            Active Station
          </span>
        ) : (
          <span className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-100 text-gray-600 font-medium border border-gray-300">
            <XCircle className="w-5 h-5 mr-2" />
            Inactive Station
          </span>
        )}
      </div>

      {/* Station Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* General Information Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">General Information</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Station Name</span>
              <span className="text-sm font-semibold text-gray-900">{station.name}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Type</span>
              <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200 text-sm">
                <Zap className="w-4 h-4 mr-1" />
                {station.type}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Status</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-lg font-medium border text-sm ${
                station.isActive 
                  ? 'bg-green-50 text-green-700 border-green-200' 
                  : 'bg-gray-100 text-gray-600 border-gray-300'
              }`}>
                {station.isActive ? "Active" : "Inactive"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-sm font-medium text-gray-600">Latitude</span>
              <span className="text-sm text-gray-900 font-mono">{station.latitude}</span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm font-medium text-gray-600">Longitude</span>
              <span className="text-sm text-gray-900 font-mono">{station.longitude}</span>
            </div>
          </div>
        </div>

        {/* Location Map Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Location</h2>
          </div>
          <p className="text-sm text-gray-600 mb-3">{station.address}</p>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <MapPreviewLeaflet lat={station.latitude} lng={station.longitude} />
          </div>
        </div>
      </div>

      {/* Schedule */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Operating Schedules</h2>
        </div>
        {station.schedules?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Day</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Start Time
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      End Time
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Slot Count</th>
                </tr>
              </thead>
              <tbody>
                {station.schedules.map((s, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200 text-sm">
                        {dayNames[s.dayOfWeek]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900 font-medium">{s.startTime}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900 font-medium">{s.endTime}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 font-medium border border-purple-200 text-sm">
                        {s.slotCount} {s.slotCount === 1 ? 'slot' : 'slots'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 font-medium">No schedules available</p>
            <p className="text-sm text-gray-500 mt-1">Add schedules to manage operating hours</p>
          </div>
        )}
      </div>
    </div>
  );
}
