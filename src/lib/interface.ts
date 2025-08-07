export interface Apartment {
  id: string
  imageUrl: string
  name: string
  location: string
  price: number
  rating: number
  guests: number
  beds: number
  baths: number
  description?: string // Added for detailed view
  amenities?: Amenity[] // Added for detailed view
  galleryImages?: GalleryImage[] // Added for detailed view
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
