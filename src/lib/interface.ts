// Base interface for entities with an ID
export interface BaseEntity {
  id: string;
}

// Reusable image interface
export interface Image {
  src: string;
  alt: string;
}

// Addon interface
export interface Addon extends BaseEntity {
  name: string;
  price: number;
  pricingType: "perNight" | "oneTime";
  description?: string;
  active?: boolean;
}

// Base apartment fields shared across Apartment, ApartmentData, and ApartmentResponse
export interface BaseApartment {
  name: string;
  location: string;
  address: string;
  pricePerNight: number;
  rooms?: number;
  bathrooms?: number;
  maxGuests: number;
  features?: string[];
  gallery?: string[];
  rules?: string[];
  isTrending?: boolean;
  addons?: Addon[];
}

// Full Apartment interface with transformed fields
export interface Apartment extends BaseApartment, BaseEntity {
  _id?: string; // original backend ID
  price: number; // for UI display convenience
  beds: number;
  baths: number;
  guests: number;
  rating: number;
  averageRating?: number;
  galleryImages?: { id: string; src: string; alt: string }[];
  amenities?: { id: string; name: string; icon: string }[];
  imageUrl?: string;
}

// Input data for creating/updating an apartment
export interface ApartmentData extends BaseApartment {}

// Response wrapper for apartment data
export interface ApartmentResponse {
  success: boolean;
  data: Apartment;
}

// Base service interface for shared fields
export interface BaseService extends BaseEntity {
  name: string;
  price: number;
  description?: string;
}

// Service interface
export interface Service extends BaseService {
  unit?: string; // e.g., "/night", "/stay", "/person"
}

// Location feature interface
export interface LocationFeature extends BaseEntity, Image {
  locationName: string;
  apartmentCount: number;
  colSpan: number;
}

// Testimonial interface
export interface Testimonial {
  id: string;
  rating: number;
  text: string;
  authorName: string;
  authorImage?: string;
  date?: string;
}

// Amenity interface
export interface Amenity extends BaseEntity {
  name: string;
  icon: string;
}

// Gallery image interface
export interface GalleryImage extends Image, BaseEntity {
  isLarge?: boolean;
}

// Booking interface
export interface Booking extends BaseEntity {
  apartmentId: string;
  apartmentName: string;
  apartmentLocation: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  guests: number;
  totalPrice: number;
  selectedServices: { id: string; name: string; price: number }[];
  paymentMethod: "card" | "bank-transfer";
  bookingDate: string;
}

// Base auth data interface
export interface BaseAuthData {
  email: string;
  password: string;
}

// Sign-in data
export interface SignInData extends BaseAuthData {}

// Sign-up data
export interface SignUpData extends BaseAuthData {
  fullname: string;
  phone: string;
  confirmPassword: string;
}

export interface AnalyticsResponse {
  totalApartments: number;
  totalBookings: number;
  revenueThisMonth: number;
  percentageChange: string;
}

export interface CancelBookingResponse {
  message: string;
  booking: {
    _id: string;
    userId: string;
    apartmentId: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    status: string;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

interface Activity {
  _id: string;
  type: string;
  message: string;
  createdAt: string;
  __v: number;
}

export interface ActivityResponse {
  message: string;
  activities: Activity[];
}
