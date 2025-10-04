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
    if (isEditMode) {
      (async () => {
        try {
          const data = await getStationById(id);
          setFormData({
            name: data.name || "",
            address: data.address || "",
            latitude: data.latitude || "",
            longitude: data.longitude || "",
            type: data.type || "AC",
            schedules: data.schedules || [],
          });
        } catch (err) {
          console.error("Failed to load station:", err);
          alert("Error loading station details.");
        }
      })();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const payload = {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isEditMode ? "Edit Station" : "Create New Station"}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Station Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
        />
        <Input
          label="Latitude"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
        />
        <Input
          label="Longitude"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />
        <div>
          <label className="text-sm font-semibold text-gray-700 mb-2 block">
            Type
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="border-2 border-gray-200 rounded-xl px-4 py-3 w-full"
          >
            <option value="AC">AC</option>
            <option value="DC">DC</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-gray-700 mb-2 block">
          Schedule
        </label>
        {formData.schedules.length > 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            {formData.schedules.map((s, idx) => (
              <div
                key={idx}
                className="flex justify-between border-b py-2 last:border-none text-sm"
              >
                <span>
                  <b>
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
                      s.dayOfWeek
                    ]}
                  </b>{" "}
                  | {s.startTime} - {s.endTime}
                </span>
                <span className="text-gray-600">{s.slotCount} slots</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No schedules added yet.</p>
        )}

        <Button
          className="mt-3"
          variant="secondary"
          onClick={() => setScheduleModalOpen(true)}
        >
          Manage Schedule
        </Button>
      </div>

      <div className="flex gap-3 justify-end">
        <Button variant="secondary" onClick={() => navigate(-1)}>
          Cancel
        </Button>
        <Button onClick={handleSave} loading={loading}>
          Save
        </Button>
      </div>

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
