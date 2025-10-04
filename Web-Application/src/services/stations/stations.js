import axiosInstance from "../axiosInstance";

// Stations
export const getStations = async (params = {}) => {
  const res = await axiosInstance.get("/ChargingStations", { params });
  return res.data;
};

export const getStationById = async (id) => {
  const res = await axiosInstance.get(`/ChargingStations/${id}`);
  return res.data;
};

export const createStation = async (payload) => {
  const res = await axiosInstance.post("/ChargingStations", payload);
  return res.data;
};

export const updateStation = async (id, payload) => {
  const res = await axiosInstance.put(`/ChargingStations/${id}`, payload);
  return res.data;
};

export const updateStationSchedule = async (id, schedule) => {
  const res = await axiosInstance.put(`/ChargingStations/${id}/schedule`, schedule);
  return res.data;
};

export const deactivateStation = async (id) => {
  const res = await axiosInstance.post(`/ChargingStations/${id}/deactivate`);
  return res.data;
};

// Nearby (for dashboard map)
export const getNearbyStations = async (params) => {
  const res = await axiosInstance.get("/ChargingStations/nearby", { params });
  return res.data;
};

// Slots
export const getSlots = async (stationId) => {
  const res = await axiosInstance.get(`/ChargingStations/${stationId}/slots`);
  return res.data;
};

export const addSlot = async (stationId, payload) => {
  const res = await axiosInstance.post(`/ChargingStations/${stationId}/slots`, payload);
  return res.data;
};

export const updateSlot = async (stationId, slotId, payload) => {
  const res = await axiosInstance.put(`/ChargingStations/${stationId}/slots/${slotId}`, payload);
  return res.data;
};

export const deactivateSlot = async (stationId, slotId) => {
  const res = await axiosInstance.post(`/ChargingStations/${stationId}/slots/${slotId}/deactivate`);
  return res.data;
};

export const deleteSlot = async (stationId, slotId) => {
  const res = await axiosInstance.delete(`/ChargingStations/${stationId}/slots/${slotId}`);
  return res.data;
};
