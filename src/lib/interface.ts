export interface Addon {
  _id: string;
  name: string;
  price: number;
  pricingType: string;
  active: boolean;
}

export interface Apartment {
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
  address: string;
  averageRating: number;
  isTrending: boolean;
  ratings: any[];
  createdAt: string;
  feedbackCount: number;
  feedbacks: string;
  updatedAt: string;
  __v: number;
  imageUrl?: string;
  beds: number;
  baths: number;
}

export interface LocationFeature {
  id: string
  imageUrl: string
  altText: string
  locationName: string
  apartmentCount: number
  colSpan: number // To control grid span for layout
}

export interface Testimonial {
  id: string
  rating: number // Assuming 5 stars as requested
  text: string
  authorName: string
  authorImage: string
}

export interface Amenity {
  id: string
  name: string
  icon: string // Name of the Lucide React icon (e.g., "AirVent", "Wifi")
}

export interface GalleryImage {
  id: string
  src: string
  alt: string
  isLarge?: boolean // To indicate if it's the large image in the gallery
}

export interface Service {
  id: string
  name: string
  description: string
  price: number
  unit: string // e.g., "/night", "/stay", "/person"
}

export interface Booking  {
  id: string;
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
};

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  fullname: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}


export interface ApartmentData {
  name: string;
  location: string;
  address: string;
  pricePerNight: number;
  rooms: number;
  bathrooms: number;
  maxGuests: number;
  features: string[]; // Array of lowercase, hyphenated feature names
  gallery: string[]; // Array of image URLs (empty for new apartments)
  rules: string[]; // Array of rule strings (e.g., ['no-smoking', 'pets-allowed'])
  isTrending?: boolean; // Optional, defaults to false
}

export interface ApartmentResponse {
  success: boolean;
  data: {
    _id: string;
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
    ratings: number;
    isTrending: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

