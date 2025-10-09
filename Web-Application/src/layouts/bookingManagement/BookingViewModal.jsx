import React from "react";
import Modal from "../../components/modal/Modal";

const BookingViewModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const formatDate = (date) => new Date(date).toLocaleString();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Name</label>
            <p className="text-base text-gray-900 mt-1">{booking.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">NIC</label>
            <p className="text-base text-gray-900 mt-1">{booking.nic}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Station ID
            </label>
            <p className="text-base text-gray-900 mt-1">{booking.stationId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Slot ID</label>
            <p className="text-base text-gray-900 mt-1">{booking.slotId}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              Start Time
            </label>
            <p className="text-base text-gray-900 mt-1">
              {formatDate(booking.startTime)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">
              End Time
            </label>
            <p className="text-base text-gray-900 mt-1">
              {formatDate(booking.endTime)}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Status</label>
            <p className="mt-1">
              <span
                className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                  booking.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : booking.status === "Approved"
                    ? "bg-blue-100 text-blue-800"
                    : booking.status === "Completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {booking.status}
              </span>
            </p>
          </div>
          {booking.qrToken && (
            <div>
              <label className="text-sm font-medium text-gray-600">
                QR Token
              </label>
              <p className="text-xs text-gray-900 mt-1 font-mono break-all">
                {booking.qrToken}
              </p>
            </div>
          )}
        </div>

        {booking.createdAt && (
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Created At
                </label>
                <p className="text-sm text-gray-900 mt-1">
                  {formatDate(booking.createdAt)}
                </p>
              </div>
              {booking.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Updated At
                  </label>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(booking.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default BookingViewModal;
