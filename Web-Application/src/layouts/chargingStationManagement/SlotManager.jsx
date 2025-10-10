import { useEffect, useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Switch from "../../components/switch/Switch";
import Modal from "../../components/modal/Modal";
import { Plus, ArrowLeft, Zap, Power } from "lucide-react";
import SlotFilters from "../../components/filters/SlotFilters";
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

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [connectorTypeFilter, setConnectorTypeFilter] = useState("");
  const [onlyActive, setOnlyActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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

  // Get unique connector types for filter
  const uniqueConnectorTypes = useMemo(() => {
    return [...new Set(slots.map((slot) => slot.connectorType))].sort();
  }, [slots]);

  // Filter and paginate slots
  const filteredSlots = useMemo(() => {
    return slots.filter((slot) => {
      const matchesSearch =
        searchTerm === "" ||
        slot.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        slot.connectorType?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesConnectorType =
        connectorTypeFilter === "" || slot.connectorType === connectorTypeFilter;
      const matchesStatus = !onlyActive || slot.isActive;
      return matchesSearch && matchesConnectorType && matchesStatus;
    });
  }, [slots, searchTerm, connectorTypeFilter, onlyActive]);

  const totalPages = Math.ceil(filteredSlots.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedSlots = useMemo(
    () => filteredSlots.slice(startIndex, endIndex),
    [filteredSlots, startIndex, endIndex]
  );

  const resetFilters = () => {
    setSearchTerm("");
    setConnectorTypeFilter("");
    setOnlyActive(true);
    setCurrentPage(1);
  };

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
    { 
      header: "Slot Code", 
      key: "code",
      render: (r) => (
        <span className="font-medium text-gray-900">{r.code}</span>
      )
    },
    { 
      header: "Connector Type", 
      key: "connectorType",
      render: (r) => (
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200">
          <Zap className="w-4 h-4 mr-1" />
          {r.connectorType}
        </span>
      )
    },
    { 
      header: "Power (kW)", 
      key: "powerKw",
      render: (r) => (
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-purple-50 text-purple-700 font-medium border border-purple-200">
          <Power className="w-4 h-4 mr-1" />
          {r.powerKw} kW
        </span>
      )
    },
    {
      header: "Status",
      render: (r) => (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-lg font-medium ${
            r.isActive 
              ? "bg-green-50 text-green-700 border border-green-200" 
              : "bg-gray-100 text-gray-600 border border-gray-300"
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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Slot Manager
          </h1>
          <p className="text-gray-600">
            Manage charging slots for this station
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
            Back
          </Button>
          <Button onClick={() => setModalOpen(true)}>
            <Plus className="w-5 h-5" />
            Add Slot
          </Button>
        </div>
      </div>

      {/* Filters Section */}
      <SlotFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        connectorTypeFilter={connectorTypeFilter}
        setConnectorTypeFilter={setConnectorTypeFilter}
        onlyActive={onlyActive}
        setOnlyActive={setOnlyActive}
        resetFilters={resetFilters}
        filteredCount={filteredSlots.length}
        totalCount={slots.length}
        uniqueConnectorTypes={uniqueConnectorTypes}
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading slots...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <Table 
            columns={columns} 
            data={paginatedSlots} 
          />
        </div>
      )}

      {/* Modal */}
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slot Code
            </label>
            <Input
              placeholder="Enter slot code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Connector Type
            </label>
            <Input
              placeholder="Enter connector type (e.g., Type2, CCS)"
              value={formData.connectorType}
              onChange={(e) => setFormData({ ...formData, connectorType: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Power (kW)
            </label>
            <Input
              type="number"
              placeholder="Enter power in kW"
              value={formData.powerKw}
              onChange={(e) => setFormData({ ...formData, powerKw: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-3 h-11">
              <span className="text-sm text-gray-600">Active</span>
              <Switch
                checked={formData.isActive}
                onChange={() =>
                  setFormData({ ...formData, isActive: !formData.isActive })
                }
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
