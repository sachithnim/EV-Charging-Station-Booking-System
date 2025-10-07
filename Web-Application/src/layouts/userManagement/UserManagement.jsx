import { useState } from "react";
import { Users, Search, Plus, User, Shield } from "lucide-react";
import { useUsers } from "../../hooks/useUsers";
import StatsCard from "../../components/statsCard/StatsCard";
import UserTable from "./UserTable";
import Modal from "../../components/modal/Modal";
import UserForm from "./UserForm";
import Button from "../../components/button/Button";
import toast from "react-hot-toast";

export default function UserManagement() {
  const {
    loading,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    getUserStats,
    filterUsers,
  } = useUsers();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const roles = ["All", "Admin", "Backoffice"];
  const stats = getUserStats();
  const filteredUsers = filterUsers(searchTerm, selectedRole);

  const handleCreateSubmit = async (userData) => {
    setFormLoading(true);
    const result = await handleCreateUser(userData);
    setFormLoading(false);

    if (result.success) {
      setShowCreateModal(false);
    }
  };

  const handleEditSubmit = async (userData) => {
    setFormLoading(true);
    const result = await handleUpdateUser(selectedUser.id, userData);
    setFormLoading(false);

    if (result.success) {
      setShowEditModal(false);
      setSelectedUser(null);
    }
  };

  const handleDeleteConfirm = async () => {
    setFormLoading(true);
    const result = await handleDeleteUser(selectedUser);
    setFormLoading(false);

    if (result.success) {
      setShowDeleteModal(false);
      setSelectedUser(null);
      toast.success("User deleted successfully!");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const openDeleteModal = (user) => {
    setSelectedUser(user);
    console.log(user);
    setShowDeleteModal(true);
  };

  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage system users and their permissions.
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add New User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <StatsCard
          title="Total Users"
          value={stats.total}
          icon={Users}
          iconColor="blue"
          valueColor="gray"
        />
        <StatsCard
          title="Admins"
          value={stats.admins}
          icon={Shield}
          iconColor="red"
          valueColor="red"
        />
        <StatsCard
          title="Backoffice"
          value={stats.backoffice}
          icon={User}
          iconColor="blue"
          valueColor="blue"
        />
        <StatsCard
          title="Station Operators"
          value={stats.stationOperators}
          icon={User}
          iconColor="green"
          valueColor="green"
        />
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mt-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by username or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Users Table */}
      <UserTable
        users={filteredUsers}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
      />

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeModals}
        title="Create New User"
      >
        <UserForm
          onSubmit={handleCreateSubmit}
          onCancel={closeModals}
          loading={formLoading}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal isOpen={showEditModal} onClose={closeModals} title="Edit User">
        <UserForm
          user={selectedUser}
          onSubmit={handleEditSubmit}
          onCancel={closeModals}
          loading={formLoading}
        />
      </Modal>
      <Modal
        isOpen={showDeleteModal}
        onClose={closeModals}
        title="Confirm Delete"
      >
        <div className="space-y-6">
          <p>Are you sure you want to delete this user?</p>
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
    </div>
  );
}
