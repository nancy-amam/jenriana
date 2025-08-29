import React from 'react';

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmCancel: () => void;
  bookingId: string;
}

const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  isOpen,
  onClose,
  onConfirmCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[20px] p-6 w-[480px] max-w-full flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-[#111827]">Cancel Booking</h2>
          <button
            onClick={onClose}
            className="text-[#4b5566] hover:text-black text-xl"
          >
            ✕
          </button>
        </div>
        
        <div className="text-base text-[#374151] leading-relaxed">
          <p className="mb-4">
            Are you sure you want to cancel this booking?
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-[#8B5A00] mb-2 font-medium">
              Important Notice:
            </p>
            <p className="text-sm text-[#8B5A00] mb-2">
              • Please contact support to discuss refund options before canceling
            </p>
            <p className="text-sm text-[#8B5A00]">
              • A cancellation fee applies
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 h-[50px] rounded-lg border border-gray-300 px-4 py-3 text-base font-normal text-[#374151] bg-white hover:bg-gray-50 transition-colors"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirmCancel}
            className="flex-1 h-[50px] rounded-lg bg-red-600 text-white px-4 py-3 text-base font-medium hover:bg-red-700 transition-colors"
          >
            Cancel Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default CancelBookingModal;