import { useMemo, useState } from "react";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";
import Input from "../../components/input/Input";
import Switch from "../../components/switch/Switch";
import Modal from "../../components/modal/Modal";
import { useStations } from "../../hooks/useStations";

export default function StationList({ onCreate, onView, onEdit }) {
  const { stations, loading, error, filters, setFilters, handleDeactivateStation } = useStations({});

  // local filter UI state
  const [search, setSearch] = useState("");
  const [onlyActive, setOnlyActive] = useState(true);
  const [type, setType] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeactivateId, setPendingDeactivateId] = useState(null);
  const [confirmMsg, setConfirmMsg] = useState("");

  const filtered = useMemo(() => {
    let list = stations;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(x =>
        x.name?.toLowerCase().includes(s) ||
        x.address?.toLowerCase().includes(s)
      );
    }
    if (onlyActive) list = list.filter(x => x.isActive);
    if (type) list = list.filter(x => x.type === type);
    return list;
  }, [stations, search, onlyActive, type]);

  const columns = [
    { header: "Name", key: "name" },
    { header: "Type", render: (r) => <span className="px-2 py-1 rounded-lg bg-gray-100 text-gray-700">{r.type}</span> },
    { header: "Status", render: (r) => (
        <span className={`px-2 py-1 rounded-lg ${r.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
          {r.isActive ? "Active" : "Inactive"}
        </span>
      )
    },
    { header: "Address", key: "address" },
    { header: "Updated", render: (r) => new Date(r.updatedAt).toLocaleString() },
    { header: "Actions", render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" onClick={(e)=>{e.stopPropagation(); onView?.(r);}}>View</Button>
        <Button size="sm" onClick={(e)=>{e.stopPropagation(); onEdit?.(r);}}>Edit</Button>
        <Button 
          size="sm" 
          variant="danger" 
          onClick={(e)=>{ 
            e.stopPropagation(); 
            setPendingDeactivateId(r.id);
            setConfirmMsg(r.isActive 
              ? "Deactivate this station? Bookings (active/upcoming) will block the action." 
              : "This station is already inactive.");
            setConfirmOpen(true);
          }}
          disabled={!r.isActive}
        >
          Deactivate
        </Button>
      </div>
    )}
  ];

  const onRowClick = (row) => onView?.(row);

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
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Charging Stations</h1>
        <div className="flex gap-3">
          <div className="w-64">
            <Input placeholder="Search by name or address..." value={search} onChange={e=>setSearch(e.target.value)} />
          </div>
          <select
            className="border-2 border-gray-200 rounded-xl px-3 py-2 bg-white"
            value={type}
            onChange={e=>setType(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="AC">AC</option>
            <option value="DC">DC</option>
          </select>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Only Active</span>
            <Switch checked={onlyActive} onChange={()=>setOnlyActive(v=>!v)} />
          </div>
          <Button onClick={()=>onCreate?.()}>+ Create Station</Button>
        </div>
      </div>

      {loading && <div className="text-gray-600">Loading stations…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && (
        <Table columns={columns} data={filtered} onRowClick={onRowClick} />
      )}

      <Modal isOpen={confirmOpen} onClose={()=>setConfirmOpen(false)} title="Confirm">
        <p className="mb-4">{confirmMsg}</p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={()=>setConfirmOpen(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleConfirm}>Yes, Deactivate</Button>
        </div>
      </Modal>
    </div>
  );
}
