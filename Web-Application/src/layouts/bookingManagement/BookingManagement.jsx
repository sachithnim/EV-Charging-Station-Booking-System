import React, { useState } from "react";
import { useBookings } from "../../hooks/useBookings";
import Table from "../../components/table/Table";
import Button from "../../components/button/Button";

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

  const columns = [
    { header: "#", key: "index" },
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
          className={`border text-sm rounded px-2 py-1 ${
            row.status === "Pending"
              ? "bg-yellow-50 text-yellow-700 border-yellow-200"
              : row.status === "Approved"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : row.status === "Completed"
              ? "bg-green-50 text-green-700 border-green-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Completed">Completed</option>
        </select>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Booking Management
      </h1>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="bg-white rounded-lg shadow">
        <Table
          columns={columns}
          data={bookings.map((b, i) => ({ ...b, index: i + 1 }))}
        />
      </div>
    </div>
  );
};

export default BookingManagement;
