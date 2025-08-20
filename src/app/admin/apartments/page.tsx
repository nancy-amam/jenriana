'use client';

import { Pencil, Trash2, MapPin, BedDouble, DollarSign, Users, Bath, X, Home, Plus } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import AddEditApartmentModal from '../components/add-apartment';
import { getApartments, deleteApartment, getApartmentById } from '@/services/api-services';
import ApartmentLoadingPage from '@/components/loading';
import { useApartmentModal } from '@/context/apartment-context'

type Apartment = {
  _id: string;
  name: string;
  location: string;
  address?: string;
  pricePerNight: number;
  rooms: number;
  bathrooms?: number;
  maxGuests?: number;
  features?: string[];
  rules?: string[];
  isTrending?: boolean;
  gallery?: string[];
  ratings?: number;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  addons?: any[]; // Add this field
};

type DeleteModalState = {
  open: boolean;
  apartmentId: string | null;
  apartmentName: string;
  isDeleting: boolean;
};

export default function ApartmentsManagementPage() {
  const { modalState, openAddModal, openEditModal, closeModal } = useApartmentModal();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [editLoading, setEditLoading] = useState<string | null>(null); // Track which apartment is loading
  const [deleteModalState, setDeleteModalState] = useState<DeleteModalState>({
    open: false,
    apartmentId: null,
    apartmentName: '',
    isDeleting: false,
  });

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        setLoading(true);
        const response = await getApartments();
        setApartments(response.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message);
        console.error('Error fetching apartments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, []);

  const handleSuccess = async () => {
    try {
      const response = await getApartments();
      setApartments(response.data || []);
    } catch (err: any) {
      console.error('Error refreshing apartments:', err);
    }
    closeModal();
  };

  // Fixed function to handle edit with complete apartment data
  const handleEditClick = async (apartmentId: string) => {
    try {
      setEditLoading(apartmentId);
      console.log('Fetching complete apartment data for:', apartmentId);
      
      // Fetch complete apartment data including addons
      const response = await getApartmentById(apartmentId);
      const fullApartmentData = response.data;
      
      console.log('Complete apartment data:', fullApartmentData);
      
      // Transform the data to match what the modal expects
      const modalData = {
        id: fullApartmentData._id,
        _id: fullApartmentData._id,
        name: fullApartmentData.name,
        location: fullApartmentData.location,
        address: fullApartmentData.address || '',
        pricePerNight: fullApartmentData.pricePerNight,
        rooms: fullApartmentData.rooms,
        bathrooms: fullApartmentData.bathrooms || 0,
        maxGuests: fullApartmentData.maxGuests || 1,
        features: fullApartmentData.features || [],
        rules: fullApartmentData.rules || [],
        gallery: fullApartmentData.gallery || [],
        isTrending: fullApartmentData.isTrending || false,
        ratings: fullApartmentData.ratings || fullApartmentData.averageRating || 0,
        createdAt: fullApartmentData.createdAt,
        updatedAt: fullApartmentData.updatedAt,
        __v: fullApartmentData.__v,
        averageRating: fullApartmentData.averageRating || 0,
        feedbackCount: fullApartmentData.feedbackCount || 0,
        feedbacks: fullApartmentData.feedbacks || [],
        // THIS IS THE KEY - include addons from the API response
        addons: fullApartmentData.addons || [],
        
        // Extra fields that the modal might use
        imageUrl: fullApartmentData.gallery?.[0] || "/placeholder.svg",
        price: fullApartmentData.pricePerNight,
        guests: fullApartmentData.maxGuests || 1,
        beds: fullApartmentData.rooms || 1,
        baths: fullApartmentData.bathrooms || 1,
        rating: fullApartmentData.ratings || fullApartmentData.averageRating || 4.8,
        galleryImages: (fullApartmentData.gallery || []).map(
          (src: string, index: number) => ({
            id: `${fullApartmentData._id}-${index}`,
            src,
            alt: `${fullApartmentData.name} image ${index + 1}`,
          })
        ),
        amenities: (fullApartmentData.features || []).map(
          (feature: string, index: number) => ({
            id: `amenity-${index}`,
            name: feature,
            icon: getIconForFeature(feature),
          })
        ),
      };
      
      console.log('Opening edit modal with data:', modalData);
      openEditModal(modalData);
    } catch (err: any) {
      console.error('Error fetching apartment details for edit:', err);
      alert('Failed to load apartment details for editing');
    } finally {
      setEditLoading(null);
    }
  };

  // Helper function for feature icons (you might need to adjust this based on your needs)
  const getIconForFeature = (feature: string): string => {
    const featureIconMap: { [key: string]: string } = {
      wifi: "Wifi",
      "air conditioning": "AirVent",
      kitchen: "Utensils",
      tv: "Tv",
      "laptop friendly": "Laptop",
      gym: "Dumbbell",
      parking: "ParkingSquare",
      security: "ShieldCheck",
    };

    const lowerFeature = feature.toLowerCase();
    return featureIconMap[lowerFeature] || "Info";
  };

  const handleDeleteClick = (apartment: Apartment) => {
    setDeleteModalState({
      open: true,
      apartmentId: apartment._id,
      apartmentName: apartment.name,
      isDeleting: false,
    });
  };

  const handleCloseDeleteModal = () => {
    if (!deleteModalState.isDeleting) {
      setDeleteModalState({
        open: false,
        apartmentId: null,
        apartmentName: '',
        isDeleting: false,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.apartmentId) return;

    try {
      setDeleteModalState(prev => ({ ...prev, isDeleting: true }));
      await deleteApartment(deleteModalState.apartmentId);
      setApartments(prev => prev.filter(apt => apt._id !== deleteModalState.apartmentId));
      handleCloseDeleteModal();
      console.log('Apartment deleted successfully');
    } catch (err: any) {
      console.error('Error deleting apartment:', err);
      alert(err.message || 'Failed to delete apartment');
    } finally {
      setDeleteModalState(prev => ({ ...prev, isDeleting: false }));
    }
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
        <ApartmentLoadingPage />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
      <div className="w-full max-w-[1200px] mb-10 h-[82px] bg-white shadow-md rounded-lg flex items-center px-4 gap-4 mt-[-20px]">
        <input
          type="text"
          placeholder="Search by apartment name or location"
          className="w-[90%] p-3 rounded-[8px] border border-[#d1d5db]/30 text-sm outline-none"
        />
      </div>

      <div className="hidden md:block w-full max-w-[1200px] bg-white shadow-md rounded-lg p-4 mt-10 overflow-x-auto">
        <table className="w-full text-sm font-normal text-left table-fixed">
          <thead className="text-xs text-[#4b5566] uppercase">
            <tr>
              <th className="py-2 w-[25%] min-w-[250px]">Apartment</th>
              <th className="w-[12%] min-w-[100px]">Location</th>
              <th className="w-[12%] min-w-[100px]">Price/Night</th>
              <th className="w-[8%] min-w-[60px]">Rooms</th>
              <th className="w-[20%] min-w-[150px]">Features</th>
              <th className="w-[10%] min-w-[80px]">Status</th>
              <th className="w-[13%] min-w-[120px]">Action</th>
            </tr>
          </thead>
          <tbody className="mt-4">
            {apartments.map((apt) => (
              <tr key={apt._id} className="text-[#111827] text-sm font-normal border-b border-gray-100">
                <td className="py-3 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={apt.gallery?.[0] || '/images/default-apartment.png'}
                        alt={apt.name}
                        fill
                        className="rounded object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-medium truncate">{apt.name}</div>
                      <div className="text-xs text-gray-500 whitespace-nowrap">
                        Added {apt.createdAt ? new Date(apt.createdAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <div className="truncate" title={apt.location}>
                    {apt.location}
                  </div>
                </td>
                <td className="py-3 whitespace-nowrap">₦{apt.pricePerNight?.toLocaleString() || '0'}</td>
                <td className="py-3 text-center">{apt.rooms}</td>
                <td className="py-3">
                  <div className="truncate" title={apt.features?.join(', ') || 'N/A'}>
                    {apt.features?.join(', ') || 'N/A'}
                  </div>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    apt.isTrending 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {apt.isTrending ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3">
                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={() => handleEditClick(apt._id)}
                      disabled={editLoading === apt._id}
                      className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1 text-xs disabled:opacity-50"
                    >
                      {editLoading === apt._id ? (
                        <>
                          <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          Loading...
                        </>
                      ) : (
                        <>
                          <Pencil className="w-3 h-3" /> Edit
                        </>
                      )}
                    </button>
                    <button 
                      className="text-red-600 hover:underline cursor-pointer flex items-center gap-1 text-xs"
                      onClick={() => handleDeleteClick(apt)}
                    >
                      <Trash2 className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden space-y-4">
        {apartments.map((apt) => (
          <div key={apt._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="flex gap-3">
              <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                <Image
                  src={apt.gallery?.[0] || '/images/default-apartment.png'}
                  alt={apt.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="text-base font-semibold text-[#111827]">{apt.name}</p>
              </div>
            </div>
            <div className="text-sm text-[#374151] space-y-2">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4" /> {apt.location}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <BedDouble className="w-3 h-3" />
                  <span>{apt.rooms} rooms</span>
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="w-3 h-3" />
                  <span>{apt.bathrooms || 0} baths</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>{apt.maxGuests || 1} guests</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 font-semibold">
                  <span>₦{apt.pricePerNight?.toLocaleString() || '0'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Status:</span>
                  <span>{apt.isTrending ? 'Active' : 'Inactive'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-medium">Features:</span>
                  <span>{apt.features?.slice(0, 2).join(', ') || 'N/A'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <button
                onClick={() => handleEditClick(apt._id)}
                disabled={editLoading === apt._id}
                className="flex-1 bg-[#f3f4f6] text-[#374151] cursor-pointer text-sm py-2 rounded-md flex items-center justify-center gap-1 disabled:opacity-50"
              >
                {editLoading === apt._id ? (
                  <>
                    <div className="w-4 h-4 border border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </>
                ) : (
                  <>
                    <Pencil className="w-4 h-4" /> Edit
                  </>
                )}
              </button>
              <button 
                className="flex-1 bg-[#fef2f2] text-[#dc2626] cursor-pointer text-sm py-2 rounded-md flex items-center justify-center gap-1"
                onClick={() => handleDeleteClick(apt)}
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full bottom-0 flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-gray-500">
        <span className="mb-2 sm:mb-0">Showing 1 to {apartments.length} of {apartments.length} apartments</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border rounded">Prev</button>
          <button className="px-3 py-1 border rounded bg-black text-white">1</button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      {deleteModalState.open && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900 cursor-pointer">Delete Apartment</h3>
              <button
                onClick={handleCloseDeleteModal}
                disabled={deleteModalState.isDeleting}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to delete <span className="font-semibold">"{deleteModalState.apartmentName}"</span>? 
                This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCloseDeleteModal}
                  disabled={deleteModalState.isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleteModalState.isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleteModalState.isDeleting ? (
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
      )}

      <AddEditApartmentModal 
        open={modalState.open}
        onClose={closeModal}
        onSuccess={handleSuccess}
        editMode={modalState.editMode}
        apartmentData={modalState.apartmentData}
      />
    </div>
  );
}