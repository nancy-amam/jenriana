
// Base interface for entities with an ID
export interface BaseEntity {
  id: string;
}

// Reusable image interface
export interface Image {
  src: string;
  alt: string;
}

// Base apartment fields shared across Apartment, ApartmentData, and ApartmentResponse
export interface BaseApartment {
  name: string;
  location: string;
  address: string;
  pricePerNight: number;
  rooms: number;
  bathrooms: number;
  maxGuests: number;
  features: string[];
  gallery: string[];
  rules: string[];
  isTrending?: boolean;
}

// Full Apartment interface with additional metadata
export interface Apartment extends BaseApartment, BaseEntity {
  averageRating: number;
  ratings: any[]; // Consider typing this more strictly if possible
  feedbackCount: number;
  feedbacks: string; // Consider typing as an array if it represents multiple feedbacks
  createdAt: string;
  updatedAt: string;
  __v: number;
  imageUrl?: string;
  beds: number;
  baths: number;
  addons?: Addon[];
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
  description: string;
}

// Addon interface
export interface Addon extends BaseService {
  pricingType: string;
  active: boolean;
}

// Service interface
export interface Service extends BaseService {
  unit: string; // e.g., "/night", "/stay", "/person"
}

// Location feature interface
export interface LocationFeature extends BaseEntity, Image {
  locationName: string;
  apartmentCount: number;
  colSpan: number;
  imageUrl?: string; 
   altText: string
}

// Testimonial interface
export interface Testimonial extends BaseEntity {
  rating: number;
  text: string;
  authorName: string;
  authorImage: string;
  
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
  paymentMethod: 'card' | 'bank-transfer';
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
