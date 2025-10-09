import React from "react";
import Modal from "../../components/modal/Modal";
import { QRCodeCanvas } from "qrcode.react";

const BookingViewModal = ({ isOpen, onClose, booking }) => {
  if (!booking) return null;

  const formatDate = (date) => new Date(date).toLocaleString();

  // URL that QR code will encode
  const qrDataUrl = `${window.location.origin}/booking/${booking.id}?token=${booking.qrToken}`;

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

          {/* ✅ Show QR Code if Approved */}
          {booking.status === "Approved" && booking.qrToken && (
            <div className="flex flex-col items-center pt-4">
              <label className="text-sm font-medium text-gray-600 mb-2">
                Booking QR Code
              </label>
              <QRCodeCanvas
                value={qrDataUrl}
                size={160}
                bgColor="#ffffff"
                fgColor="#000000"
                level="M"
                includeMargin={true}
              />
              <p className="text-xs text-gray-500 mt-2 break-all">
                Token: {booking.qrToken}
              </p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default BookingViewModal;
