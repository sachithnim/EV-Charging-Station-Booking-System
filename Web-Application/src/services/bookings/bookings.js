import axiosInstance from "../axiosInstance";

// Get all bookings (Backoffice, Admin, Station Operator)
export const getAllBookings = async () => {
  try {
    const response = await axiosInstance.get("/bookings");
    return response.data;
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw error;
  }
};

// Get booking by ID
export const getBookingById = async (id) => {
  try {
    const response = await axiosInstance.get(`/bookings/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
};

// Get bookings by NIC (for EV Owner)
export const getBookingsByNic = async (nic) => {
  try {
    const response = await axiosInstance.get(`/bookings/owner/${nic}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for NIC ${nic}:`, error);
    throw error;
  }
};

// Create a new booking
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post("/bookings", bookingData);
    return response.data;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

// Update a booking (must be 12 hours before start)
export const updateBooking = async (id, bookingData) => {
  try {
    await axiosInstance.put(`/bookings/${id}`, bookingData);
  } catch (error) {
    console.error(`Error updating booking with ID ${id}:`, error);
    throw error;
  }
};

// Cancel a booking (must be 12 hours before start)
export const cancelBooking = async (id) => {
  try {
    await axiosInstance.patch(`/bookings/${id}/cancel`);
  } catch (error) {
    console.error(`Error cancelling booking with ID ${id}:`, error);
    throw error;
  }
};

// Approve a booking (Backoffice or Station Operator only)
export const approveBooking = async (id) => {
  try {
    await axiosInstance.patch(`/bookings/${id}/approve`);
  } catch (error) {
    console.error(`Error approving booking with ID ${id}:`, error);
    throw error;
  }
};

// Complete a booking (Station Operator only)
export const completeBooking = async (id) => {
  try {
    await axiosInstance.patch(`/bookings/${id}/complete`);
  } catch (error) {
    console.error(`Error completing booking with ID ${id}:`, error);
    throw error;
  }
};

// Get a single booking with station + slot details
export const getBookingWithStation = async (id) => {
  try {
    const response = await axiosInstance.get(`/bookings/${id}/details`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking details with ID ${id}:`, error);
    throw error;
  }
};

// Get all bookings with station + slot details
export const getAllBookingsWithStations = async () => {
  try {
    const response = await axiosInstance.get(`/bookings/details`);
    return response.data;
  } catch (error) {
    console.error("Error fetching all bookings with station details:", error);
    throw error;
  }
};
