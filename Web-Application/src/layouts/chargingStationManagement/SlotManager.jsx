import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Switch from "../../components/switch/Switch";
import Modal from "../../components/modal/Modal";
import {
  getSlots,
  addSlot,
  updateSlot,
  deactivateSlot,
  deleteSlot,
} from "../../services/stations/stations";

export default function SlotManager() {
  const { id } = useParams(); // stationId
  const navigate = useNavigate();

  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [editSlot, setEditSlot] = useState(null); // if null - new

  const [formData, setFormData] = useState({
    code: "",
    connectorType: "",
    powerKw: "",
    isActive: true,
  });

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const data = await getSlots(id);
      setSlots(data);
    } catch (err) {
      console.error("Failed to fetch slots:", err);
      setError("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [id]);

  const handleSaveSlot = async () => {
    try {
      const payload = {
        code: formData.code,
        connectorType: formData.connectorType,
        powerKw: parseFloat(formData.powerKw),
        isActive: formData.isActive,
      };

      if (editSlot) {
        await updateSlot(id, editSlot.id || editSlot._id, payload);
        alert("Slot updated successfully.");
      } else {
        await addSlot(id, payload);
        alert("Slot added successfully.");
      }
      setModalOpen(false);
      setEditSlot(null);
      setFormData({ code: "", connectorType: "", powerKw: "", isActive: true });
      await fetchSlots();
    } catch (err) {
      console.error("Save failed:", err);
      alert("Failed to save slot.");
    }
  };

  const handleDeactivate = async (slot) => {
    try {
      await deactivateSlot(id, slot.id || slot._id);
      alert("Slot deactivated successfully.");
      await fetchSlots();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Cannot deactivate slot (might have active bookings).";
      alert(msg);
    }
  };

  const handleDelete = async (slot) => {
    try {
      await deleteSlot(id, slot.id || slot._id);
      alert("Slot deleted successfully.");
      await fetchSlots();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Cannot delete slot (might have active bookings).";
      alert(msg);
    }
  };

  const columns = [
    { header: "Code", key: "code" },
    { header: "Connector Type", key: "connectorType" },
    { header: "Power (kW)", key: "powerKw" },
    {
      header: "Status",
      render: (r) => (
        <span
          className={`px-2 py-1 rounded-lg ${
            r.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          {r.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (r) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={(e) => {
              e.stopPropagation();
              setEditSlot(r);
              setFormData({
                code: r.code,
                connectorType: r.connectorType,
                powerKw: r.powerKw,
                isActive: r.isActive,
              });
              setModalOpen(true);
            }}
          >
            Edit
          </Button>
          <Button
            size="sm"
            variant="danger"
            disabled={!r.isActive}
            onClick={(e) => {
              e.stopPropagation();
              handleDeactivate(r);
            }}
          >
            Deactivate
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(r);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Slot Manager</h1>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button onClick={() => setModalOpen(true)}>+ Add Slot</Button>
        </div>
      </div>

      {loading && <div className="text-gray-600">Loading slots...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && <Table columns={columns} data={slots} />}

      <Modal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditSlot(null);
          setFormData({ code: "", connectorType: "", powerKw: "", isActive: true });
        }}
        title={editSlot ? "Edit Slot" : "Add New Slot"}
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Slot Code"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
          />
          <Input
            label="Connector Type"
            placeholder="CCS / Type2 / CHAdeMO"
            value={formData.connectorType}
            onChange={(e) => setFormData({ ...formData, connectorType: e.target.value })}
          />
          <Input
            label="Power (kW)"
            type="number"
            value={formData.powerKw}
            onChange={(e) => setFormData({ ...formData, powerKw: e.target.value })}
          />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Active</span>
            <Switch
              checked={formData.isActive}
              onChange={() =>
                setFormData({ ...formData, isActive: !formData.isActive })
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveSlot}>
              {editSlot ? "Update Slot" : "Add Slot"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
