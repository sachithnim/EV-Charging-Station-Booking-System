import { useState, useEffect } from "react";
import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../services/users/users";

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const userData = await getAllUsers();
      setUsers(userData);
    } catch (error) {
      console.error("Failed to fetch users:", error);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error("Failed to create user:", error);
      return { success: false, error: "Failed to create user" };
    }
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      await updateUser(userId, userData);
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error("Failed to update user:", error);
      return { success: false, error: "Failed to update user" };
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await deleteUser(userId);
      await fetchUsers();
      return { success: true };
    } catch (error) {
      console.error("Failed to delete user:", error);
      return { success: false, error: "Failed to delete user" };
    }
  };

  const getUserStats = () => {
    const total = users.length;
    const admins = users.filter((u) => u.role === "Admin").length;
    const backoffice = users.filter((u) => u.role === "Backoffice").length;
    const regularUsers = users.filter((u) => u.role === "User").length;

    return { total, admins, backoffice, regularUsers };
  };

  const filterUsers = (searchTerm, selectedRole) => {
    return users.filter((user) => {
      const matchesSearch =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRole === "All" || user.role === selectedRole;
      return matchesSearch && matchesRole;
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    fetchUsers,
    handleCreateUser,
    handleUpdateUser,
    handleDeleteUser,
    getUserStats,
    filterUsers,
  };
}
