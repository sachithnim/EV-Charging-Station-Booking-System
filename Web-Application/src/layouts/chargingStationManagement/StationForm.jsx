import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";
import ScheduleEditor from "./ScheduleEditor";
import {
  createStation,
  getStationById,
  updateStation,
} from "../../services/stations/stations";
import AddressSearchNominatim from "../../components/maps/AddressSearchNominatim";
import MapPickerLeaflet from "../../components/maps/MapPickerLeaflet";
import { 
  ArrowLeft, 
  Save, 
  MapPin, 
  Zap, 
  Clock, 
  Calendar,
  Info
} from "lucide-react";

export default function StationForm() {
  const navigate = useNavigate();
  const { id } = useParams(); // if id exists - edit mode

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    latitude: "",
    longitude: "",
    type: "AC",
    schedules: [],
  });
  const [loading, setLoading] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!isEditMode) return;
    (async () => {
      try {
        const data = await getStationById(id);
        setFormData({
          name: data?.name ?? "",
          address: data?.address ?? "",
          latitude: data?.latitude ?? "",
          longitude: data?.longitude ?? "",
          type: data?.type ?? "AC",
          schedules: data?.schedules ?? [],
        });
      } catch (err) {
        console.error("Failed to load station:", err);
        alert("Error loading station details.");
      }
    })();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Safe numeric values for the map (avoid NaN)
  const latNum = Number.isFinite(parseFloat(formData.latitude))
    ? parseFloat(formData.latitude)
    : 6.927079; // Colombo default
  const lngNum = Number.isFinite(parseFloat(formData.longitude))
    ? parseFloat(formData.longitude)
    : 79.861244;

  const handleSave = async () => {
    try {
      setLoading(true);
      const lat = parseFloat(formData.latitude);
      const lng = parseFloat(formData.longitude);

      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        alert("Please select a valid location (latitude/longitude).");
        return;
      }
      if (!formData.name.trim()) {
        alert("Please enter a station name.");
        return;
      }
      if (!formData.address.trim()) {
        alert("Please enter an address.");
        return;
      }

      const payload = {
        ...formData,
        latitude: lat,
        longitude: lng,
      };

      if (isEditMode) {
        await updateStation(id, payload);
        alert("Station updated successfully.");
      } else {
        await createStation(payload);
        alert("Station created successfully.");
      }
      navigate("/charging-station-management");
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save station.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? "Edit Station" : "Create New Station"}
          </h1>
          <p className="text-gray-600">
            {isEditMode 
              ? "Update station information and settings" 
              : "Add a new charging station to the network"}
          </p>
        </div>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
          Back
        </Button>
      </div>

      {/* Basic Information Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
          <Info className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Basic Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Station Name <span className="text-red-500">*</span>
            </label>
            <Input
              name="name"
              placeholder="Enter station name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Enter a descriptive name for the station</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Zap className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="AC">AC (Alternating Current)</option>
                <option value="DC">DC (Direct Current)</option>
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-1">Select the charging type</p>
          </div>
        </div>
      </div>

      {/* Location Information Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-6">
          <MapPin className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-800">Location Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="md:col-span-3">
            <AddressSearchNominatim
              value={formData.address}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, address: text }))
              }
              onSelect={({ address, lat, lng }) => {
                setFormData((prev) => ({
                  ...prev,
                  latitude: String(lat.toFixed(6)),
                  longitude: String(lng.toFixed(6)),
                }));
              }}
            />
            <p className="text-xs text-gray-500 mt-1">Search and select the station address</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude <span className="text-red-500">*</span>
            </label>
            <Input
              name="latitude"
              type="number"
              step="any"
              placeholder="e.g., 6.927079"
              value={formData.latitude}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude <span className="text-red-500">*</span>
            </label>
            <Input
              name="longitude"
              type="number"
              step="any"
              placeholder="e.g., 79.861244"
              value={formData.longitude}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="relative z-0 mt-6 pt-6 border-t border-gray-200">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <MapPin className="w-4 h-4 text-blue-600" />
            Pick Location on Map
          </label>
          <div className="rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
            <MapPickerLeaflet
              lat={latNum}
              lng={lngNum}
              onChange={({ lat, lng }) => {
                setFormData((prev) => ({
                  ...prev,
                  latitude: String(lat.toFixed(6)),
                  longitude: String(lng.toFixed(6)),
                }));
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Info className="w-3 h-3" />
            Click on the map to set the exact station location
          </p>
        </div>
      </div>

      {/* Schedule Management Card */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-800">Operating Schedule</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setScheduleModalOpen(true)}
          >
            <Clock className="w-4 h-4" />
            Manage Schedule
          </Button>
        </div>
        
        {formData.schedules.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Day</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Operating Hours
                    </div>
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700 text-sm">Slot Count</th>
                </tr>
              </thead>
              <tbody>
                {formData.schedules.map((s, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200 text-sm">
                        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][s.dayOfWeek]}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900 font-medium">
                        {s.startTime} - {s.endTime}
                      </span>
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
            <p className="text-gray-600 font-medium">No schedules configured</p>
            <p className="text-sm text-gray-500 mt-1">Click "Manage Schedule" to add operating hours</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSave} loading={loading}>
          <Save className="w-5 h-5" />
          {isEditMode ? "Update Station" : "Create Station"}
        </Button>
      </div>

      {/* Schedule Modal */}
      <Modal
        isOpen={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        title="Manage Schedule"
        size="xl"
      >
        <ScheduleEditor
          schedules={formData.schedules}
          onChange={(updated) =>
            setFormData((prev) => ({ ...prev, schedules: updated }))
          }
          onClose={() => setScheduleModalOpen(false)}
        />
      </Modal>
    </div>
  );
}
