import { Mail, CreditCard as Edit, Trash2, Eye } from "lucide-react";
import Table from "../../components/table/Table";
import Switch from "../../components/switch/Switch";

export default function EVOwnerTable({
  owners,
  onView,
  onDelete,
  onActivate,
  onDeactivate,
}) {
  const columns = [
    {
      header: "Name",
      key: "name",
      render: (owner) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-800 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
            {owner.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-gray-900">{owner.name}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Email",
      key: "email",
      render: (owner) => (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          {owner.email}
        </div>
      ),
    },
    {
      header: "NIC",
      key: "nic",
      render: (owner) => (
        <span className="text-sm font-mono text-gray-500">{owner.nic}</span>
      ),
    },
    {
      header: "Phone",
      key: "phone",
      render: (owner) => (
        <span className="text-sm text-gray-500">{owner.phone}</span>
      ),
    },
    {
      header: "Address",
      key: "address",
      render: (owner) => (
        <span className="text-sm text-gray-500 truncate">{owner.address}</span>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (owner) => (
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(owner.nic);
            }}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(owner.nic);
            }}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
    {
      header: "Status",
      key: "isActive",
      render: (owner) => (
        <div className="flex items-center gap-2">
          <Switch
            checked={owner.isActive}
            onChange={(e) => {
              e.stopPropagation();
              owner.isActive ? onDeactivate(owner.nic) : onActivate(owner.nic);
            }}
          />
          <span className="text-sm">
            {owner.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
  ];
  return <Table columns={columns} data={owners} />;
}
