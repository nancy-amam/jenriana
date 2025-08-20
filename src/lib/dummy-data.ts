import type {  LocationFeature, Testimonial } from "./interface"


export const locationFeatures: LocationFeature[] = [
  {
    id: "loc-001",
    src: "/images/image5.jpg",
    alt: "Lagos city skyline",
    locationName: "Ikeja",
    apartmentCount: 120,
    colSpan: 1,
  },
  {
    id: "loc-002",
    src: "/images/image9.jpg",
    alt: "Abuja city view",
    locationName: "Magodo",
    apartmentCount: 85,
    colSpan: 1,
  },
  {
    id: "loc-003",
    src: "/images/image14.jpg",
    alt: "Ikorodu waterfront",
    locationName: "Ikorodu",
    apartmentCount: 50,
    colSpan: 2,
  },
  {
    id: "loc-004",
    src: "/images/image14.jpg",
    alt: "Enugu green landscape",
    locationName: "Victoria Isalnd",
    apartmentCount: 30,
    colSpan: 2,
  },
  {
    id: "loc-005",
    src: "/images/image3.jpg",
    alt: "Calabar carnival street",
    locationName: "Lekki",
    apartmentCount: 40,
    colSpan: 1,
  },
  {
    id: "loc-006",
    src: "/images/image2.jpg",
    alt: "Ibadan brown roofs",
    locationName: "Badagry",
    apartmentCount: 60,
    colSpan: 1,
  },
]

export const testimonials: Testimonial[] = [
  {
    id: "test-001",
    rating: 5,
    text: "The apartment was absolutely stunning and exceeded all our expectations. Clean, spacious, and perfectly located. Highly recommend Jenrianna-apartments!",
    authorName: "Aisha Bello",
    authorImage: "/placeholder.svg?height=40&width=40&text=Aisha",
  },
  {
    id: "test-002",
    rating: 5,
    text: "Seamless booking process and a fantastic stay. The amenities were top-notch, and the host was incredibly responsive. Will definitely book again!",
    authorName: "Chukwudi Okoro",
    authorImage: "/placeholder.svg?height=40&width=40&text=Chukwudi",
  },
  {
    id: "test-003",
    rating: 5,
    text: "A true home away from home! The apartment was beautifully furnished and had everything we needed. Great value for money and a comfortable experience.",
    authorName: "Fatima Adebayo",
    authorImage: "/placeholder.svg?height=40&width=40&text=Fatima",
  },
]

