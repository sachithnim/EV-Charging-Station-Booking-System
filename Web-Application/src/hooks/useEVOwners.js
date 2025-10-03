import { useState, useEffect } from "react";
import { activateEVOwner, deactivateEVOwner, deleteEVOwner, getAllEVOwners } from "../services/evowners/evowners";

export function useEVOwners() {
  const [evOwners, setEVOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEVOwners = async () => {
    try {
      setLoading(true);
      setError(null);
      const evOwnersData = await getAllEVOwners();
      setEVOwners(evOwnersData);
    } catch {
      console.error("Failed to fetch owners:", error);
      setError("Failed to fetch owners");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEVOwner = async (nic) => {
    try {
      await deleteEVOwner(nic);
      await fetchEVOwners();
      return { success: true };
    } catch (error) {
      console.error("Failed to delete EV Owner:", error);
      return { success: false, error: "Failed to delete EV Owner" };
    }
  }

  const handleDeactivateEVOwner = async (nic) => {
    try {
      await deactivateEVOwner(nic);
      await fetchEVOwners();
      return { success: true };
    } catch (error) {
      console.error("Failed to deactivate EV Owner:", error);
      return { success: false, error: "Failed to deactivate EV Owner" };
    }
  }

  const handleActivateEVOwner = async (nic) => {
    try {
      await activateEVOwner(nic);
      await fetchEVOwners();
      return { success: true };
    } catch (error) {
      console.error("Failed to activate EV Owner:", error);
      return { success: false, error: "Failed to activate EV Owner" };
    }
  }

  useEffect(() => {
    fetchEVOwners();
  }, []);

  return {
    evOwners,
    loading,
    error,
    fetchEVOwners,
    handleDeleteEVOwner,
    handleDeactivateEVOwner,
    handleActivateEVOwner
  }
}
