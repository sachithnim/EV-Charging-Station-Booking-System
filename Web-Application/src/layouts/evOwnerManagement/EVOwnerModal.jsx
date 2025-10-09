import Modal from "../../components/modal/Modal";
import Button from "../../components/button/Button";

export default function EVOwnerViewModal({
  isOpen,
  onClose,
  owner,
  loading,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="EV Owner Details">
      {loading ? (
        <div className="flex justify-center items-center py-8">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : owner ? (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-800 to-primary-600 rounded-full flex items-center justify-center text-white text-xl font-semibold">
              {owner.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {owner.name}
              </h2>
              <p
                className={`text-sm font-medium ${
                  owner.isActive ? "text-green-600" : "text-red-600"
                }`}
              >
                {owner.isActive ? "Active" : "Inactive"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <p>
              <span className="font-semibold text-gray-900">Email:</span>{" "}
              {owner.email}
            </p>
            <p>
              <span className="font-semibold text-gray-900">NIC:</span>{" "}
              {owner.nic}
            </p>
            <p>
              <span className="font-semibold text-gray-900">Phone:</span>{" "}
              {owner.phone}
            </p>
            <p className="col-span-2">
              <span className="font-semibold text-gray-900">Address:</span>{" "}
              {owner.address || "—"}
            </p>
          </div>

          <div className="flex justify-end">
            <Button variant="secondary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No owner details found.</p>
      )}
    </Modal>
  );
}