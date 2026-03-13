// Shared dummy data for partner apartments (list + detail)

export type ApartmentStatus = "active" | "inactive" | "maintenance";

export interface PartnerApartment {
  _id: string;
  name: string;
  location: string;
  address?: string;
  pricePerNight: number;
  rooms: number;
  bathrooms: number;
  maxGuests: number;
  gallery: string[];
  status: ApartmentStatus;
  occupied: boolean;
  features?: string[];
  rules?: string[];
  description?: string;
}

export const MOCK_APARTMENTS: PartnerApartment[] = [
  {
    _id: "1",
    name: "Lekki Waterside",
    location: "Lekki Phase 1, Lagos",
    address: "12 Admiralty Way, Lekki Phase 1",
    pricePerNight: 62000,
    rooms: 3,
    bathrooms: 2,
    maxGuests: 6,
    gallery: ["/images/partner-login-img.png"],
    status: "active",
    occupied: true,
    features: ["WiFi", "Parking", "Pool", "Security", "Generator"],
    rules: ["No smoking", "No parties", "Check-in after 2pm"],
    description: "Spacious waterfront apartment with modern amenities and a relaxing view.",
  },
  {
    _id: "2",
    name: "Victoria Island View",
    location: "Victoria Island, Lagos",
    address: "45 Adeola Odeku Street, Victoria Island",
    pricePerNight: 80000,
    rooms: 4,
    bathrooms: 3,
    maxGuests: 8,
    gallery: ["/images/partner-login-img.png"],
    status: "active",
    occupied: false,
    features: ["WiFi", "Parking", "Pool", "Gym", "Security", "Generator", "CCTV"],
    rules: ["No smoking", "No pets", "Check-in after 3pm", "Quiet hours 10pm–7am"],
    description: "Luxury apartment in the heart of Victoria Island with premium finishes.",
  },
  {
    _id: "3",
    name: "Ikoyi Heights",
    location: "Ikoyi, Lagos",
    address: "8 Bourdillon Road, Ikoyi",
    pricePerNight: 105000,
    rooms: 3,
    bathrooms: 2,
    maxGuests: 5,
    gallery: [] as string[],
    status: "maintenance",
    occupied: true,
    features: ["WiFi", "Parking", "Security", "Generator"],
    rules: ["No smoking", "Check-in after 2pm"],
    description: "Elegant apartment in a quiet, upscale Ikoyi neighbourhood.",
  },
];

export function getApartmentById(id: string): PartnerApartment | undefined {
  return MOCK_APARTMENTS.find((a) => a._id === id);
}

export function formatMoney(n: number) {
  return `₦${n.toLocaleString()}`;
}
