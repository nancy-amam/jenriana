'use client';

import { Pencil, Trash2, MapPin, BedDouble, DollarSign, Users, Bath } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import AddEditApartmentModal from '../components/add-apartment';
import { getApartments } from '@/services/api-services';

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
};

interface ApartmentData {
  name: string;
  location: string;
  address: string;
  pricePerNight: number;
  rooms: number;
  bathrooms: number;
  maxGuests: number;
  features: string[];
  rules: string[];
  gallery: string[];
  isTrending: boolean;
}

type ModalState = {
  open: boolean;
  editMode: boolean;
  apartmentData: (ApartmentData & { id?: string }) | undefined;
};

export default function ApartmentsManagementPage() {
  const [modalState, setModalState] = useState<ModalState>({
    open: false,
    editMode: false,
    apartmentData: undefined,
  });

  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

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

  const handleAddApartment = () => {
    setModalState({
      open: true,
      editMode: false,
      apartmentData: undefined,
    });
  };

  const handleEditApartment = (apartment: Apartment) => {
    const transformedApartment: ApartmentData & { id?: string } = {
      id: apartment._id,
      name: apartment.name,
      location: apartment.location,
      address: apartment.address || '',
      pricePerNight: apartment.pricePerNight,
      rooms: apartment.rooms,
      bathrooms: apartment.bathrooms || 0,
      maxGuests: apartment.maxGuests || 1,
      features: apartment.features || [],
      rules: apartment.rules || [],
      gallery: apartment.gallery || [],
      isTrending: apartment.isTrending || false,
    };

    setModalState({
      open: true,
      editMode: true,
      apartmentData: transformedApartment,
    });
  };

  const handleCloseModal = () => {
    setModalState({
      open: false,
      editMode: false,
      apartmentData: undefined,
    });
  };

  const handleSuccess = async () => {
    try {
      const response = await getApartments();
      setApartments(response.data || []);
    } catch (err: any) {
      console.error('Error refreshing apartments:', err);
    }
    handleCloseModal();
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading apartments...</div>
        </div>
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
      <div className="w-full mb-10 h-[82px] bg-white shadow-md rounded-lg flex items-center px-4 gap-4 mt-[-20px]">
        <input
          type="text"
          placeholder="Search by apartment name or location"
          className="w-[90%] p-3 rounded-[8px] border border-[#d1d5db]/30 text-sm outline-none"
        />
      </div>

      <div className="hidden md:block w-full bg-white shadow-md rounded-lg p-4 mt-10 overflow-x-auto">
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
                      onClick={() => handleEditApartment(apt)}
                      className="text-blue-600 hover:underline flex items-center gap-1 text-xs"
                    >
                      <Pencil className="w-3 h-3" /> Edit
                    </button>
                    <button className="text-red-600 hover:underline flex items-center gap-1 text-xs">
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
                onClick={() => handleEditApartment(apt)}
                className="flex-1 bg-[#f3f4f6] text-[#374151] text-sm py-2 rounded-md flex items-center justify-center gap-1"
              >
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button className="flex-1 bg-[#fef2f2] text-[#dc2626] text-sm py-2 rounded-md flex items-center justify-center gap-1">
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
          <button className="px-3 py-1 border rounded bg-black text-white">
            1
          </button>
          <button className="px-3 py-1 border rounded">2</button>
          <button className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>

      <AddEditApartmentModal 
        open={modalState.open}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
        editMode={modalState.editMode}
        apartmentData={modalState.apartmentData}
      />
    </div>
  );
}