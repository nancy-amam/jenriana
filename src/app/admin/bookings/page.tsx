'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import Link from 'next/link';
import { getAllBookings } from '@/services/api-services';
import ApartmentLoadingPage from '@/components/loading';

interface Booking {
  _id: string;
  userId: string;
  apartmentId: string;
  checkInDate: string;
  checkOutDate: string;
  guests: number;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  addons: Array<{
    name: string;
    price: number;
    pricingType: string;
    total: number;
  }>;
  serviceCharge: number;
  tax: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  specialRequest?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingsResponse {
  message: string;
  total: number;
  page: number;
  pages: number;
  bookings: Booking[];
  success: boolean;
}

export default function AdminBookingPage() {
  const [search, setSearch] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  const limit = 10;

  const fetchBookings = async (page: number = 1, searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response: BookingsResponse = await getAllBookings(page, limit, searchQuery);
      
      setBookings(response.bookings || []);
      setTotalPages(response.pages || 1);
      setTotalBookings(response.total || 0);
      setCurrentPage(response.page || 1);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(1, search);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchBookings(1, value);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      fetchBookings(page, search);
    }
  };

  const calculateNights = (checkIn: string, checkOut: string) => {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return (
      <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
        <div className="flex justify-center items-center h-64">
          <ApartmentLoadingPage />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
      {/* Search Card */}
      <div className="w-full max-w-[1200px] h-[82px] bg-white rounded-lg shadow-md px-4 py-4 flex items-center gap-4 mb-6 mt-[-20px]">
        <input
          type="text"
          placeholder="Search by booking name or ID"
          className="w-[90%] outline-none p-3 rounded-[8px] text-sm text-gray-700 placeholder:text-gray-400 border border-[#d1d5db]/30"
          value={search}
          onChange={handleSearch}
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block w-full max-w-[1200px] bg-white rounded-lg shadow-md p-4">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#4b5566] uppercase">
            <tr>
              <th className="py-2">Booking ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Amount Paid</th>
              <th>Arrival - Departure</th>
              <th>Booking Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="mt-4">
            {bookings.map((booking) => (
              <tr key={booking._id} className="text-[#111827] text-sm font-normal mt-4">
                <td className="py-3">{booking._id.slice(-8)}</td>
                <td>{booking.customerName}</td>
                <td>{booking.customerEmail}</td>
                <td>₦{booking.totalAmount.toLocaleString()}</td>
                <td>
                  {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                </td>
                <td>{formatDate(booking.createdAt)}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                    {formatStatus(booking.status)}
                  </span>
                </td>
                <td>
                  <Link
                    href={`/admin/bookings/${booking._id}`}
                    className="text-black hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow-md p-4 relative">
            <div className="flex justify-between text-xs font-medium mb-2">
              <span className="text-gray-600">{booking._id.slice(-8)}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(booking.status)}`}>
                {formatStatus(booking.status)}
              </span>
            </div>
            <p className="text-base font-semibold text-[#111827]">{booking.customerName}</p>
            <p className="text-sm text-[#4b5566]">{booking.customerEmail}</p>
            <p className="text-sm text-[#111827] mt-2">
              ₦{booking.totalAmount.toLocaleString()} for {calculateNights(booking.checkInDate, booking.checkOutDate)} nights
            </p>
            <p className="text-sm text-[#4b5566] mt-2">
              {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
            </p>
            
            {/* Action Buttons Row */}
            <div className="mt-4 flex gap-2">
              <Link
                href={`/admin/bookings/${booking._id}`}
                className="w-full text-center bg-[#212121] hover:bg-gray-800 text-white py-2 rounded-lg text-sm font-medium"
              >
                View
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {bookings.length === 0 && !loading && (
        <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No bookings found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalBookings > 0 && (
        <div className="w-full max-w-[1200px] flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-gray-500">
          <span className="mb-2 sm:mb-0">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalBookings)} of {totalBookings} bookings
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, currentPage - 1) + i;
              if (pageNumber > totalPages) return null;
              
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 border rounded ${
                    pageNumber === currentPage ? 'bg-black text-white' : ''
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}