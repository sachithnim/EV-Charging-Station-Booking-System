import { useState } from "react";
import { useEVOwners } from "../../hooks/useEVOwners";
import EVOwnerTable from "./EVOwnerTable";
import toast from "react-hot-toast";
import Modal from "../../components/modal/Modal";
import Button from "../../components/button/Button";
import { getEVOwnerByNIC } from "../../services/evowners/evowners";
import EVOwnerViewModal from "./EVOwnerModal";
import { Search } from "lucide-react";

export default function EVOwnerManagement() {
  const {
    loading,
    handleActivateEVOwner,
    handleDeactivateEVOwner,
    handleDeleteEVOwner,
    filterEVOwner,
  } = useEVOwners();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedstatus, setSelectedStatus] = useState("All");

  const evOwners = filterEVOwner(searchTerm, selectedstatus);

  const status = ["All", "Active", "Inactive"];

  const handleViewOwner = async (nic) => {
    setFormLoading(true);
    const data = await getEVOwnerByNIC(nic);
    setOwnerDetails(data);
    setShowViewModal(true);
    setFormLoading(false);
  };

  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    const { success, error } = await handleDeleteEVOwner(selectedOwner);
    setFormLoading(false);

    if (success) {
      closeModals();
      toast.success("EV Owner deleted successfully");
    } else {
      console.error(error);
    }
  };

  const handleActivateConfirm = async () => {
    setFormLoading(true);
    const { success, error } = await handleActivateEVOwner(selectedOwner);
    setFormLoading(false);

    if (success) {
      closeModals();
      toast.success("EV Owner activated successfully");
    } else {
      console.error(error);
    }
  };

  const handleDeactivateConfirm = async () => {
    setFormLoading(true);
    const { success, error } = await handleDeactivateEVOwner(selectedOwner);
    setFormLoading(false);
    if (success) {
      closeModals();
      toast.success("EV Owner deactivated successfully");
    } else {
      console.error(error);
    }
  };

  const openActivateModal = (owner) => {
    setSelectedOwner(owner);
    setShowActivateModal(true);
  };

  const openDeactivateModal = (owner) => {
    setSelectedOwner(owner);
    setShowDeactivateModal(true);
  };

  const openDeleteModal = (owner) => {
    setSelectedOwner(owner);
    console.log(owner);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowDeleteModal(false);
    setShowActivateModal(false);
    setShowDeactivateModal(false);
    setSelectedOwner(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            EV Owner Management
          </h1>
          <p className="text-gray-600 mt-1">Manage system EV Owners.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search EVOwners by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedstatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {status.map((stat) => (
              <option key={stat} value={stat}>
                {stat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <EVOwnerTable
        owners={evOwners}
        onView={handleViewOwner}
        onDelete={openDeleteModal}
        onActivate={openActivateModal}
        onDeactivate={openDeactivateModal}
      />
      <EVOwnerViewModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        owner={ownerDetails}
        loading={formLoading}
      />
      <Modal
        isOpen={showDeleteModal}
        onClose={closeModals}
        title="Confirm Delete"
      >
        <div className="space-y-6">
          <p>Are you sure you want to delete this owner?</p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={closeModals} className="mr-2">
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={formLoading}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showActivateModal}
        onClose={closeModals}
        title="Confirm Activate"
      >
        <div className="space-y-6">
          <p>Are you sure you want to activate this owner?</p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={closeModals} className="mr-2">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleActivateConfirm}
              loading={formLoading}
            >
              Activate
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={showDeactivateModal}
        onClose={closeModals}
        title="Confirm Deactivate"
      >
        <div className="space-y-6">
          <p>Are you sure you want to deactivate this owner?</p>
          <div className="flex justify-end">
            <Button variant="secondary" onClick={closeModals} className="mr-2">
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleDeactivateConfirm}
              loading={formLoading}
            >
              Deactivate
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
