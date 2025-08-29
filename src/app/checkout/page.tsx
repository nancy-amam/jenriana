'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';
import ApartmentLoadingPage from '@/components/loading';
import GuestInfoForm from './components/guest-info';
import AddonSelection from './components/adds-on';
import BookingSummary from './components/booking-summary';
import { getApartmentById, createBooking } from '@/services/api-services';

// Define interfaces
interface Addon {
  _id: string;
  name: string;
  price: number;
  pricingType: 'perNight' | 'oneTime';
  active: boolean;
  description?: string;
}

interface Apartment {
  _id: string;
  name: string;
  location: string;
  pricePerNight: number;
  rooms: number;
  bathrooms: number;
  maxGuests: number;
  features: string[];
  gallery: string[];
  rules: string[];
  addons?: Addon[];
  residentialAddress: string;
  averageRating: number | null;
  isTrending: boolean;
  ratings: any[];
  createdAt: string;
  updatedAt: string;
  __v: number;
  imageUrl?: string;
  beds: number;
  baths: number;
}

interface GuestInfo {
  name: string;
  email: string;
  phone: string;
  residentialAddress: string;
  specialRequest: string;
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const apartmentId = searchParams.get('apartmentId');
  const nights = Number(searchParams.get('nights'));
  const guests = Number(searchParams.get('guests'));
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const price = Number(searchParams.get('price'));
  const passedImage = searchParams.get('image');

  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [guestInfo, setGuestInfo] = useState<GuestInfo>({
    name: '',
    email: '',
    phone: '',
    residentialAddress: '',
    specialRequest: '',
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    async function fetchApartment() {
      if (!apartmentId) {
        setError('No apartment selected.');
        setLoading(false);
        return;
      }
      try {
        const res = await getApartmentById(apartmentId);
        console.log('CheckoutPage: Apartment data:', res.data);
        setApartment({
          ...res.data,
          beds: res.data.rooms,
          baths: res.data.bathrooms,
          imageUrl: decodeURIComponent(passedImage || res.data.gallery?.[0] || '/images/placeholder.svg'),
        });
      } catch (err: any) {
        console.error('CheckoutPage: Failed to fetch apartment:', err);
        setError('Failed to load apartment details.');
      } finally {
        setLoading(false);
      }
    }
    fetchApartment();
  }, [apartmentId, passedImage]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!guestInfo.name.trim()) errors.name = 'Full name is required';
    if (!guestInfo.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      errors.email = 'Invalid email format';
    }
    if (!guestInfo.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\+?\d{10,14}$/.test(guestInfo.phone.replace(/\s/g, ''))) {
      errors.phone = 'Invalid phone number';
    }
    if (!guestInfo.residentialAddress.trim()) errors.address = 'Address is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        setError('Please sign in to continue booking.');
        router.push('/login');
        return;
      }
      const bookingData = {
        userId,
        checkInDate: checkIn!,
        checkOutDate: checkOut!,
        guests,
        paymentMethod: 'card',
        addons: selectedServices,
        customerName: guestInfo.name,
        customerEmail: guestInfo.email,
        customerPhone: guestInfo.phone,
        residentialAddress: guestInfo.residentialAddress,
        specialRequest: guestInfo.specialRequest || undefined,
      };
      const response = await createBooking(apartmentId!, bookingData);
      console.log('CheckoutPage: Booking created:', response);

      localStorage.setItem(`booking_${response.bookingId}`, JSON.stringify({
        ...response.booking,
        apartmentName: apartment?.name || 'Unknown Apartment',
        apartmentLocation: apartment?.location || 'Unknown Location',
      }));

      router.push(`/booking-engine?bookingId=${response.bookingId}&image=${encodeURIComponent(apartment?.imageUrl || '')}`);
    } catch (err: any) {
      console.error('CheckoutPage: Booking creation failed:', err);
      setError(err.message || 'Failed to create booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckboxChange = (addonId: string) => {
    setSelectedServices((prevSelected) =>
      prevSelected.includes(addonId)
        ? prevSelected.filter((id) => id !== addonId)
        : [...prevSelected, addonId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <ApartmentLoadingPage />
      </div>
    );
  }

  if (error || !apartment || isNaN(nights) || isNaN(guests) || !checkIn || !checkOut || isNaN(price)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        {error || 'Invalid booking information'}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white px-4 py-12 md:px-16 overflow-hidden">
      <Image
        src={apartment.imageUrl || '/images/image20.png'}
        alt="Apartment background"
        fill
        className="object-cover z-0"
        unoptimized
      />
      <div className="absolute inset-0 bg-black/80 z-10"></div>
      <div className="relative z-20 max-w-7xl mx-auto">
        <h1 className="text-[36px] font-normal mb-2">Confirm Your Booking</h1>
        <p className="mb-10 text-base font-normal">Just a few more details to confirm your stay</p>
        <div className="flex flex-col md:flex-row gap-8 w-full items-start">
          <div className="bg-white text-black rounded-[12px] p-6 space-y-6 w-full md:flex-1 max-w-3xl">
            <h2 className="text-2xl font-medium mb-2" style={{ color: '#111827' }}>
              Guest Information
            </h2>
            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <GuestInfoForm
                guestInfo={guestInfo}
                setGuestInfo={setGuestInfo}
                formErrors={formErrors}
                isSubmitting={isSubmitting}
              />
              <AddonSelection
                apartment={apartment}
                selectedServices={selectedServices}
                handleCheckboxChange={handleCheckboxChange}
                isSubmitting={isSubmitting}
                nights={nights}
              />
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-md transition cursor-pointer flex items-center justify-center gap-2 ${
                  isSubmitting 
                    ? 'bg-gray-600 text-white cursor-not-allowed' 
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Confirming...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </form>
          </div>
          <BookingSummary
            apartment={apartment}
            basePrice={price}
            nights={nights}
            selectedServices={selectedServices}
            checkIn={checkIn}
            checkOut={checkOut}
          />
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-white">
          <ApartmentLoadingPage />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}