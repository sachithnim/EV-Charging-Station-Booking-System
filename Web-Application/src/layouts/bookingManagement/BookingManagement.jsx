import React, { useState, useMemo } from "react";
import { useBookings } from "../../hooks/useBookings";
import Table from "../../components/table/Table";
import Input from "../../components/input/Input";
import Modal from "../../components/modal/Modal";
import {
  Search,
  Filter,
  Calendar,
  MapPin,
  CheckCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const BookingManagement = () => {
  const {
    bookings,
    loading,
    error,
    approveBookingById,
    cancelBookingById,
    completeBookingById,
  } = useBookings();

  const [updatingId, setUpdatingId] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stationFilter, setStationFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleStatusChange = async (id, newStatus) => {
    setUpdatingId(id);
    try {
      if (newStatus === "Approved") await approveBookingById(id);
      else if (newStatus === "Cancelled") await cancelBookingById(id);
      else if (newStatus === "Completed") await completeBookingById(id);
    } catch (err) {
      console.error("Status update failed", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (date) => new Date(date).toLocaleString();
  const formatDateOnly = (date) => new Date(date).toLocaleDateString();

  // Get unique station IDs for filter dropdown
  const uniqueStations = useMemo(() => {
    const stations = [...new Set(bookings.map((b) => b.stationId))];
    return stations.sort();
  }, [bookings]);

  // Filter bookings based on all filters
  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      // Search filter (name or NIC)
      const matchesSearch =
        searchTerm === "" ||
        booking.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.nic?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus =
        statusFilter === "All" || booking.status === statusFilter;

      // Station filter
      const matchesStation =
        stationFilter === "All" || booking.stationId === stationFilter;

      // Date filter
      const matchesDate =
        dateFilter === "" ||
        formatDateOnly(booking.startTime) === formatDateOnly(dateFilter);

      return matchesSearch && matchesStatus && matchesStation && matchesDate;
    });
  }, [bookings, searchTerm, statusFilter, stationFilter, dateFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBookings = useMemo(() => {
    return filteredBookings.slice(startIndex, endIndex);
  }, [filteredBookings, startIndex, endIndex]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, stationFilter, dateFilter]);

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  const columns = [
    { header: "#", key: "index" },
    { header: "Name", key: "name" },
    { header: "NIC", key: "nic" },
    { header: "Station", key: "stationId" },
    { header: "Slot", key: "slotId" },
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
              ? "bg-yellow-50 text-yellow-700 border-yellow-300 hover:bg-yellow-100"
              : row.status === "Approved"
              ? "bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100"
              : row.status === "Completed"
              ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
              : "bg-red-50 text-red-700 border-red-300 hover:bg-red-100"
          } ${updatingId === row.id ? "opacity-50 cursor-not-allowed" : ""}`}
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
            handleViewBooking(row);
          }}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
          title="View Details"
        >
          <Eye className="w-4 h-4" />
          View
        </button>
      ),
    },
  ];

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setStationFilter("All");
    setDateFilter("");
    setCurrentPage(1);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Management
        </h1>
        <p className="text-gray-600">
          Manage and monitor all charging station bookings
        </p>
      </div>

      {/* Filters Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Name or NIC
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <div className="relative">
              <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Station Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Station ID
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={stationFilter}
                onChange={(e) => setStationFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors appearance-none bg-white cursor-pointer"
              >
                <option value="All">All Stations</option>
                {uniqueStations.map((station) => (
                  <option key={station} value={station}>
                    {station}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Filter Summary and Reset */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredBookings.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {bookings.length}
            </span>{" "}
            bookings
          </p>
          {(searchTerm ||
            statusFilter !== "All" ||
            stationFilter !== "All" ||
            dateFilter) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Loading and Error States */}
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

      {/* Table */}
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

          {/* Pagination */}
          {filteredBookings.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-4 p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Items per page selector */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Show:</label>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => {
                      setItemsPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-600">
                    entries per page
                  </span>
                </div>

                {/* Page info */}
                <div className="text-sm text-gray-600">
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredBookings.length)} of{" "}
                  {filteredBookings.length} entries
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      currentPage === 1
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="flex gap-1">
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span
                          key={`ellipsis-${index}`}
                          className="px-3 py-2 text-gray-400"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 rounded-lg border-2 font-medium transition-colors ${
                            currentPage === page
                              ? "bg-blue-600 text-white border-blue-600"
                              : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg border-2 transition-colors ${
                      currentPage === totalPages
                        ? "border-gray-200 text-gray-400 cursor-not-allowed"
                        : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-300"
                    }`}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* View Booking Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Booking Details"
      >
        {selectedBooking && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Name
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {selectedBooking.name}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">NIC</label>
                <p className="text-base text-gray-900 mt-1">
                  {selectedBooking.nic}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Station ID
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {selectedBooking.stationId}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Slot ID
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {selectedBooking.slotId}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Start Time
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {formatDate(selectedBooking.startTime)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  End Time
                </label>
                <p className="text-base text-gray-900 mt-1">
                  {formatDate(selectedBooking.endTime)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Status
                </label>
                <p className="mt-1">
                  <span
                    className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      selectedBooking.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedBooking.status === "Approved"
                        ? "bg-blue-100 text-blue-800"
                        : selectedBooking.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedBooking.status}
                  </span>
                </p>
              </div>
              {selectedBooking.qrToken && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    QR Token
                  </label>
                  <p className="text-xs text-gray-900 mt-1 font-mono break-all">
                    {selectedBooking.qrToken}
                  </p>
                </div>
              )}
            </div>

            {selectedBooking.createdAt && (
              <div className="pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Created At
                    </label>
                    <p className="text-sm text-gray-900 mt-1">
                      {formatDate(selectedBooking.createdAt)}
                    </p>
                  </div>
                  {selectedBooking.updatedAt && (
                    <div>
                      <label className="text-sm font-medium text-gray-600">
                        Updated At
                      </label>
                      <p className="text-sm text-gray-900 mt-1">
                        {formatDate(selectedBooking.updatedAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BookingManagement;
