import { useState, useEffect } from "react";
import {
  getAllBookings,
  getBookingById,
  getBookingsByNic,
  createBooking,
  updateBooking,
  cancelBooking,
  approveBooking,
  completeBooking,
} from "../services/bookings/bookings";

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all bookings (for Backoffice or Station Operator)
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await getAllBookings();
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings by NIC (for EV Owner)
  const fetchBookingsByNic = async (nic) => {
    try {
      setLoading(true);
      const data = await getBookingsByNic(nic);
      setBookings(data);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to fetch bookings by NIC"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch single booking by ID
  const fetchBookingById = async (id) => {
    try {
      setLoading(true);
      const data = await getBookingById(id);
      setSelectedBooking(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch booking");
    } finally {
      setLoading(false);
    }
  };

  // Create booking
  const addBooking = async (bookingData) => {
    try {
      setLoading(true);
      await createBooking(bookingData);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create booking");
    } finally {
      setLoading(false);
    }
  };

  // Update booking
  const editBooking = async (id, bookingData) => {
    try {
      setLoading(true);
      await updateBooking(id, bookingData);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update booking");
    } finally {
      setLoading(false);
    }
  };

  // Cancel booking
  const cancelBookingById = async (id) => {
    try {
      setLoading(true);
      await cancelBooking(id);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to cancel booking");
    } finally {
      setLoading(false);
    }
  };

  // Approve booking
  const approveBookingById = async (id) => {
    try {
      setLoading(true);
      await approveBooking(id);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to approve booking");
    } finally {
      setLoading(false);
    }
  };

  // Complete booking
  const completeBookingById = async (id) => {
    try {
      setLoading(true);
      await completeBooking(id);
      await fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to complete booking");
    } finally {
      setLoading(false);
    }
  };

  // Auto-fetch on mount (optional)
  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    selectedBooking,
    loading,
    error,
    fetchBookings,
    fetchBookingById,
    fetchBookingsByNic,
    addBooking,
    editBooking,
    cancelBookingById,
    approveBookingById,
    completeBookingById,
  };
};
