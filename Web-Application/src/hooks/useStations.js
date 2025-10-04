import { useEffect, useState } from "react";
import { 
  getStations, 
  deactivateStation 
} from "../services/stations/stations";

export function useStations(initialFilters = {}) {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);
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

  const handleDeactivateStation = async (id) => {
    try {
      await deactivateStation(id);
      await fetchStations();
      return { success: true };
    } catch (err) {
      // 409 expected when bookings exist
      const msg = err?.response?.data?.message || "Failed to deactivate station";
      console.error(msg);
      return { success: false, error: msg };
    }
  };

  useEffect(() => {
    fetchStations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(filters)]);

  return {
    stations,
    loading,
    error,
    filters,
    setFilters,
    fetchStations,
    handleDeactivateStation,
  };
}
