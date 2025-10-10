import React, { useState, useMemo } from "react";
import { useBookings } from "../../hooks/useBookings";
import Table from "../../components/table/Table";
import { Eye } from "lucide-react";
import BookingFilters from "./BookingFilters";
import BookingViewModal from "./BookingViewModal";

const BookingManagement = () => {
  const {
    bookings,
    loading,
    error,
    approveBookingById,
    cancelBookingById,
    completeBookingById,
    fetchBookingsWithDetails,
  } = useBookings();

  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stationFilter, setStationFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const formatDate = (date) => new Date(date).toLocaleString();
  const formatDateOnly = (date) => new Date(date).toLocaleDateString();

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      if (newStatus === "Approved") await approveBookingById(id);
      else if (newStatus === "Cancelled") await cancelBookingById(id);
      else if (newStatus === "Completed") await completeBookingById(id);

      await fetchBookingsWithDetails();
    } finally {
      setUpdatingId(null);
    }
  };

  const uniqueStations = useMemo(() => {
    return [...new Set(bookings.map((b) => b.stationName))].sort();
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const matchesSearch =
        searchTerm === "" ||
        booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.nic?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;
      const matchesStation =
        stationFilter === "All" || booking.stationName === stationFilter;
      const matchesDate =
        dateFilter === "" ||
        formatDateOnly(booking.startTime) === formatDateOnly(dateFilter);
      return matchesSearch && matchesStatus && matchesStation && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, stationFilter, dateFilter]);

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedBookings = useMemo(
    () => filteredBookings.slice(startIndex, endIndex),
    [filteredBookings, startIndex, endIndex]
  );

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setStationFilter("All");
    setDateFilter("");
    setCurrentPage(1);
  };

  const columns = [
    { header: "#", key: "index" },
    { header: "Name", key: "name" },
    { header: "NIC", key: "nic" },
    { header: "Station Name", key: "stationName" },
    { header: "Slot Name", key: "slotCode" },
    {
      header: "Start Time",
      key: "startTime",
      render: (row) => formatDate(row.startTime),
    },
    {
      header: "End Time",
      key: "endTime",
      render: (row) => formatDate(row.endTime),
    },
    {
      header: "Status",
      key: "status",
      render: (row) => (
        <select
          disabled={updatingId === row.id}
          value={row.status}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`border text-sm rounded-lg px-3 py-2 font-medium cursor-pointer transition-all ${
            row.status === "Pending"
              ? "bg-yellow-50 text-yellow-700 border-yellow-300"
              : row.status === "Approved"
              ? "bg-blue-50 text-blue-700 border-blue-300"
              : row.status === "Completed"
              ? "bg-green-50 text-green-700 border-green-300"
              : "bg-red-50 text-red-700 border-red-300"
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSelectedBooking(row);
            setIsViewModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg"
        >
          <Eye className="w-4 h-4" /> View
        </button>
      ),
    },
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Booking Management
      </h1>
      <p className="text-gray-600 mb-6">
        Manage and monitor all charging station bookings
      </p>

      <BookingFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        stationFilter={stationFilter}
        setStationFilter={setStationFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        resetFilters={resetFilters}
        filteredCount={filteredBookings.length}
        totalCount={bookings.length}
        uniqueStations={uniqueStations}
      />

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading bookings...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table
              columns={columns}
              data={paginatedBookings.map((b, i) => ({
                ...b,
                index: startIndex + i + 1,
              }))}
            />
          </div>
        </>
      )}

      <BookingViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        bookingId={selectedBooking?.id}
      />
    </div>
  );
};

export default BookingManagement;
