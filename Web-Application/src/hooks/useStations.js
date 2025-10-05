import { useEffect, useState } from "react";
import { 
  getStations,
  activateStation,
  deactivateStation,
  deleteStation
} from "../services/stations/stations";

export function useStations(initialFilters = {}) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchStations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getStations(filters);
      setStations(data);
    } catch (err) {
      console.error("Failed to fetch stations:", err);
      setError("Failed to fetch stations");
    } finally {
      setLoading(false);
    }
  };

  // Deactivate
  const handleDeactivateStation = async (id) => {
    try {
      await deactivateStation(id);
      await fetchStations();
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to deactivate station";
      console.error(msg);
      return { success: false, error: msg };
    }
  };

  // Activate
  const handleActivateStation = async (id) => {
    try {
      await activateStation(id);
      await fetchStations();
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to activate station";
      console.error(msg);
      return { success: false, error: msg };
    }
  };

  // Delete
  const handleDeleteStation = async (id) => {
    try {
      await deleteStation(id);
      await fetchStations();
      return { success: true };
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete station";
      console.error(msg);
      return { success: false, error: msg };
    }
  };

  useEffect(() => {
    fetchStations();
  }, [JSON.stringify(filters)]);

  return {
    stations,
    loading,
    error,
    filters,
    setFilters,
    fetchStations,
    handleActivateStation,
    handleDeactivateStation,
    handleDeleteStation,
  };
}
