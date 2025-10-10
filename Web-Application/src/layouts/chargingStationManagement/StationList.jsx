import { useMemo, useState } from "react";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";
import { useStations } from "../../hooks/useStations";
import { MapPin, Zap, Plus } from "lucide-react";
import StationFilters from "../../components/filters/StationFilters";

export default function StationList({ onCreate, onView, onEdit }) {
  const {
    stations,
    loading,
    error,
    filters,
    setFilters,
    handleDeactivateStation,
    handleActivateStation,
    handleDeleteStation,
  } = useStations({});

  // local filter UI state
  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState(true);
  const [type, setType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeactivateId, setPendingDeactivateId] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState("");

  const filtered = useMemo(() => {
    let list = stations;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (x) =>
          x.name?.toLowerCase().includes(s) ||
          x.address?.toLowerCase().includes(s)
      );
    }
    if (onlyActive) list = list.filter((x) => x.isActive);
    if (type) list = list.filter((x) => x.type === type);
    return list;
  }, [stations, search, onlyActive, type]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedStations = useMemo(
    () => filtered.slice(startIndex, endIndex),
    [filtered, startIndex, endIndex]
  );

  const resetFilters = () => {
    setSearch("");
    setOnlyActive(true);
    setType("");
    setCurrentPage(1);
  };

  const columns = [
    { 
      header: "Id", 
      key: "index" 
    },
    { 
      header: "Station Name", 
      key: "name",
      render: (r) => (
        <span className="font-medium text-gray-900">{r.name}</span>
      )
    },
    {
      header: "Type",
      render: (r) => (
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-50 text-blue-700 font-medium border border-blue-200">
          <Zap className="w-4 h-4 mr-1" />
          {r.type}
        </span>
      ),
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
      header: "Address", 
      key: "address",
      render: (r) => (
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
          <span className="text-gray-600">{r.address}</span>
        </div>
      )
    },
    {
      header: "Last Updated",
      render: (r) => (
        <span className="text-gray-600">
          {new Date(r.updatedAt).toLocaleString()}
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
              onView?.(r);
            }}
          >
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(r);
            }}
          >
            Edit
          </Button>

          {r.isActive ? (
            <Button
              size="sm"
              variant="danger"
              onClick={(e) => {
                e.stopPropagation();
                setPendingDeactivateId(r.id || r._id);
                setConfirmMsg(
                  "Deactivate this station? Active/upcoming bookings will block the action."
                );
                setConfirmOpen(true);
              }}
            >
              Deactivate
            </Button>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={async (e) => {
                e.stopPropagation();
                const res = await handleActivateStation(r.id || r._id);
                if (!res.success) alert(res.error);
              }}
            >
              Activate
            </Button>
          )}

          <Button
            size="sm"
            variant="secondary"
            onClick={async (e) => {
              e.stopPropagation();
              if (!confirm("Delete this station permanently?")) return;
              const res = await handleDeleteStation(r.id || r._id);
              if (!res.success) alert(res.error);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleConfirm = async () => {
    setConfirmOpen(false);
    if (!pendingDeactivateId) return;
    const res = await handleDeactivateStation(pendingDeactivateId);
    if (!res.success) {
      alert(res.error);
    }
    setPendingDeactivateId(null);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Charging Station Management
          </h1>
          <p className="text-gray-600">
            Manage and monitor all EV charging stations
          </p>
        </div>
        <Button onClick={() => onCreate?.()}>
          <Plus className="w-5 h-5" />
          Create Station
        </Button>
      </div>

      {/* Filters Section */}
      <StationFilters
        search={search}
        setSearch={setSearch}
        type={type}
        setType={setType}
        onlyActive={onlyActive}
        setOnlyActive={setOnlyActive}
        resetFilters={resetFilters}
        filteredCount={filtered.length}
        totalCount={stations.length}
      />

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading stations...</p>
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
            data={paginatedStations.map((station, i) => ({
              ...station,
              index: startIndex + i + 1,
            }))} 
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Confirm Deactivation"
      >
        <p className="mb-4 text-gray-700">{confirmMsg}</p>
        <div className="flex justify-end gap-2">
          <Button 
            variant="secondary" 
            onClick={() => setConfirmOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleConfirm}
          >
            Yes, Deactivate
          </Button>
        </div>
      </Modal>
    </div>
  );
}
