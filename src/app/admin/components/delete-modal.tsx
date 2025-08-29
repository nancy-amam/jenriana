'use client';

import { X } from 'lucide-react';

interface DeleteApartmentModalProps {
  isOpen: boolean;
  apartmentName: string;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteApartmentModal({
  isOpen,
  apartmentName,
  isDeleting,
  onClose,
  onConfirm
}: DeleteApartmentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Delete Apartment</h3>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            Are you sure you want to delete <span className="font-semibold">"{apartmentName}"</span>? 
            This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isDeleting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Deleting...
                </>
              ) : (
                'Delete Apartment'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}