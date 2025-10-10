import React, { useState, useEffect } from "react";
import Modal from "../../components/modal/Modal";
import { QRCodeCanvas } from "qrcode.react";
import { useBookings } from "../../hooks/useBookings";

const BookingViewModal = ({ isOpen, onClose, bookingId }) => {
  const { fetchBookingWithDetailsById } = useBookings();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!bookingId || !isOpen) return;

    const fetchBooking = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchBookingWithDetailsById(bookingId);
        setBooking(data);
      } catch (err) {
        setError("Failed to load booking details");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, isOpen]);

  useEffect(() => {
    if (!isOpen) setBooking(null);
  }, [isOpen]);

  const formatDate = (date) => (date ? new Date(date).toLocaleString() : "");

  const qrDataUrl =
    booking && booking.qrToken
      ? `${window.location.origin}/booking/${booking.id}?token=${booking.qrToken}`
      : "";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Booking Details">
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      )}

      {error && <div className="text-red-600 text-center py-4">{error}</div>}

      {!loading && !error && booking && (
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
                Station Name
              </label>
              <p className="text-base text-gray-900 mt-1">
                {booking.stationName}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Slot Name
              </label>
              <p className="text-base text-gray-900 mt-1">{booking.slotCode}</p>
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
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
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
      )}

      {!loading && !error && !booking && (
        <div className="text-center py-6 text-gray-600">
          No booking details available.
        </div>
      )}
    </Modal>
  );
};

export default BookingViewModal;
