import { apiHandler } from "@/utils/api-handler";
import { SignInData, SignUpData, ApartmentData, AnalyticsResponse, CancelBookingResponse, ActivityResponse } from "@/lib/interface";

export async function signIn(data: SignInData) {
  return apiHandler("/api/auth/signin", {
    method: "POST",
    body: data,
  });
}

export async function signUp(data: SignUpData) {
  return apiHandler("/api/auth/signup", {
    method: "POST",
    body: data,
  });
}

export async function addApartment(
  apartmentData: ApartmentData,
  images: File[] = []
): Promise<any> {
  try {
    // Validation
    if (!apartmentData.name?.trim()) {
      throw new Error("Apartment name is required");
    }
    if (!apartmentData.location?.trim()) {
      throw new Error("Location is required");
    }
    if (!apartmentData.address?.trim()) {
      throw new Error("Address is required");
    }
    if (!apartmentData.pricePerNight || apartmentData.pricePerNight <= 0) {
      throw new Error("Price per night must be greater than 0");
    }
    if (!apartmentData.maxGuests || apartmentData.maxGuests <= 0) {
      throw new Error("Max guests must be greater than 0");
    }
    if (apartmentData.addons?.length) {
      apartmentData.addons.forEach((addon, index) => {
        if (!addon.name?.trim()) {
          throw new Error(`Addon ${index + 1} name is required`);
        }
        if (!addon.price || addon.price <= 0) {
          throw new Error(`Addon ${index + 1} price must be greater than 0`);
        }
        if (!addon.pricingType || !['perNight', 'oneTime'].includes(addon.pricingType)) {
          throw new Error(`Addon ${index + 1} pricing type must be 'perNight' or 'oneTime'`);
        }
      });
    }

    // Prepare FormData
    const formData = new FormData();

    // Append all fields (except gallery, which will come from images)
    formData.append("name", apartmentData.name.trim());
    formData.append("location", apartmentData.location.trim());
    formData.append("address", apartmentData.address.trim());
    formData.append("pricePerNight", String(apartmentData.pricePerNight));
    formData.append("rooms", String(apartmentData.rooms || 0));
    formData.append("bathrooms", String(apartmentData.bathrooms || 0));
    formData.append("maxGuests", String(apartmentData.maxGuests));
    formData.append("isTrending", String(apartmentData.isTrending || false));

    // Append features array
    if (apartmentData.features?.length) {
      apartmentData.features.forEach((feature) => {
        formData.append("features", feature);
      });
    }

    // Append rules array
    if (apartmentData.rules?.length) {
      apartmentData.rules.forEach((rule) => {
        formData.append("rules", rule);
      });
    }

    // Append addons array
    if (apartmentData.addons?.length) {
      formData.append("addons", JSON.stringify(apartmentData.addons));
    }

    // Append images if provided
    if (images.length > 0) {
      images.forEach((file) => {
        formData.append("gallery", file); // key name must match backend
      });
    }

    // Send request
    const response = await apiHandler("/api/apartment", {
      method: "POST",
      body: formData,
      // Don't set Content-Type manually — browser will handle it
    });

    return response;
  } catch (error: any) {
    console.error("Failed to add apartment:", error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to add apartment. Please check your data and try again."
    );
  }
}

export async function getAdminApartments(page: number = 1, limit: number = 10, location?: string): Promise<any> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (location?.trim()) {
      params.append('location', location.trim());
    }

    const response = await apiHandler(`/api/admin/apartment?${params.toString()}`, {
      method: 'GET',
    });

    if (response.success && Array.isArray(response.data)) {
      response.data = response.data.map((apt: any) => ({
        ...apt,
        id: apt._id,
      }));
    }

    return response;
  } catch (error: any) {
    console.error('Failed to fetch apartments:', {
      message: error.message,
      status: error.status,
      details: error,
    });

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message || 'Failed to fetch apartments. Please try again later.'
    );
  }
}

export async function getApartmentById(apartmentId: string): Promise<any> {
  try {
    if (!apartmentId?.trim()) {
      throw new Error("Apartment ID is required");
    }

    const response = await apiHandler(`/api/apartment/${apartmentId}`, {
      method: "GET",
    });

    if (!response.success || !response.data) {
      throw new Error("Invalid response from server");
    }

     // 🔥 normalize _id → id
    response.data = {
      ...response.data,
      id: response.data._id,
    };

    return response;
  } catch (error: any) {
    console.error(`Failed to fetch apartment with ID ${apartmentId}:`, error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to fetch apartment. Please try again later."
    );
  }
}

export async function getApartments(
  page: number = 1,
  limit: number = 10,
  location?: string
): Promise<any> {
  try {
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (location?.trim()) {
      params.append("location", location.trim());
    }

    const response = await apiHandler(
      `/api/apartment?${params.toString()}`,
      { method: "GET" }
    );

    if (response.success && Array.isArray(response.data)) {
      response.data = response.data.map((apt: any) => ({
        ...apt,
        id: apt._id,
      }));
    }

    return response;
  } catch (error: any) {
    console.error("Failed to fetch apartments:", {
      message: error.message,
      status: error.status,
      details: error,
    });

    throw new Error(
      error.message || "Failed to fetch apartments. Please try again later."
    );
  }
}


export async function updateApartment(
  apartmentId: string,
  apartmentData: ApartmentData,
  images: File[] = []
): Promise<any> {
  try {
    if (!apartmentId?.trim()) {
      throw new Error("Apartment ID is required for update");
    }

    // Validation
    if (!apartmentData.name?.trim()) {
      throw new Error("Apartment name is required");
    }
    if (!apartmentData.location?.trim()) {
      throw new Error("Location is required");
    }
    if (!apartmentData.address?.trim()) {
      throw new Error("Address is required");
    }
    if (!apartmentData.pricePerNight || apartmentData.pricePerNight <= 0) {
      throw new Error("Price per night must be greater than 0");
    }
    if (!apartmentData.maxGuests || apartmentData.maxGuests <= 0) {
      throw new Error("Max guests must be greater than 0");
    }
    if (apartmentData.addons?.length) {
      apartmentData.addons.forEach((addon, index) => {
        if (!addon.name?.trim()) {
          throw new Error(`Addon ${index + 1} name is required`);
        }
        if (!addon.price || addon.price <= 0) {
          throw new Error(`Addon ${index + 1} price must be greater than 0`);
        }
        if (!addon.pricingType || !['perNight', 'oneTime'].includes(addon.pricingType)) {
          throw new Error(`Addon ${index + 1} pricing type must be 'perNight' or 'oneTime'`);
        }
      });
    }

    // Prepare FormData for sending updated data
    const formData = new FormData();

    formData.append("name", apartmentData.name.trim());
    formData.append("location", apartmentData.location.trim());
    formData.append("address", apartmentData.address.trim());
    formData.append("pricePerNight", String(apartmentData.pricePerNight));
    formData.append("rooms", String(apartmentData.rooms || 0));
    formData.append("bathrooms", String(apartmentData.bathrooms || 0));
    formData.append("maxGuests", String(apartmentData.maxGuests));
    formData.append("isTrending", String(apartmentData.isTrending || false));

    // Append features array
    if (apartmentData.features?.length) {
      apartmentData.features.forEach((feature) => {
        formData.append("features", feature);
      });
    }

    // Append rules array
    if (apartmentData.rules?.length) {
      apartmentData.rules.forEach((rule) => {
        formData.append("rules", rule);
      });
    }

    // Append addons array
    if (apartmentData.addons?.length) {
      formData.append("addons", JSON.stringify(apartmentData.addons));
    }

    // Append images if provided
    if (images.length > 0) {
      images.forEach((file) => {
        formData.append("gallery", file);
      });
    }

    // Send request to update apartment
    const response = await apiHandler(`/api/apartment/${apartmentId}`, {
      method: "PUT",
      body: formData,
    });

    return response;
  } catch (error: any) {
    console.error("Failed to update apartment:", error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to update apartment. Please check your data and try again."
    );
  }
}

export async function deleteApartment(apartmentId: string): Promise<any> {
  try {
    if (!apartmentId?.trim()) {
      throw new Error("Apartment ID is required for deletion");
    }

    const response = await apiHandler(`/api/apartment/${apartmentId}`, {
      method: "DELETE",
    });

    return response;
  } catch (error: any) {
    console.error("Failed to delete apartment:", error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message || "Failed to delete apartment. Please try again."
    );
  }
}

export async function createBooking(
  apartmentId: string,
  bookingData: {
    userId: string;
    checkInDate: string;
    checkOutDate: string;
    guests: number;
    paymentMethod: string;
    addons: string[];
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    specialRequest?: string;
  }
): Promise<any> {
  try {
    if (!apartmentId?.trim()) {
      throw new Error("Apartment ID is required");
    }
    if (!bookingData.userId?.trim()) {
      throw new Error("User ID is required");
    }
    if (!bookingData.checkInDate) {
      throw new Error("Check-in date is required");
    }
    if (!bookingData.checkOutDate) {
      throw new Error("Check-out date is required");
    }
    if (!bookingData.guests || bookingData.guests <= 0) {
      throw new Error("Guests must be greater than 0");
    }
    if (!bookingData.paymentMethod?.trim()) {
      throw new Error("Payment method is required");
    }
    if (!bookingData.customerName?.trim()) {
      throw new Error("Customer name is required");
    }
    if (!bookingData.customerEmail?.trim()) {
      throw new Error("Customer email is required");
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingData.customerEmail)) {
      throw new Error("Invalid email format");
    }
    if (!bookingData.customerPhone?.trim()) {
      throw new Error("Customer phone is required");
    }
    if (!/^\+?\d{10,14}$/.test(bookingData.customerPhone.replace(/\s/g, ''))) {
      throw new Error("Invalid phone number");
    }

    const response = await apiHandler(`/api/apartment/${apartmentId}/book`, {
      method: "POST",
      body: bookingData,
    });

    return response;
  } catch (error: any) {
    console.error(`Failed to create booking for apartment ID ${apartmentId}:`, error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to create booking. Please check your data and try again."
    );
  }
}

export async function initiateCheckout(bookingId: string, paymentMethod: 'card' | 'bank-transfer'): Promise<any> {
  try {
    if (!bookingId?.trim()) {
      throw new Error("Booking ID is required");
    }
    
    // Use your production URL instead of localhost
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://jenriana-frontend.vercel.app' 
      : 'http://localhost:3000';
        
    const response = await apiHandler(`/api/booking/${bookingId}/checkout`, {
      method: "POST",
      data: {
        paymentMethod,
        // Include bookingId in the callback URL so it's available after payment
        callback_url: `${baseUrl}/payment-success?bookingId=${bookingId}`
      },
    });
 
    if (!response.success || !response.payment || !response.payment.authorization_url) {
      throw new Error("Invalid checkout response from server");
    }
    return response;
  } catch (error: any) {
    console.error(`Failed to initiate checkout for booking ID ${bookingId}:`, error);
 
    if (error.status && error.message) {
      throw error;
    }
 
    throw new Error(
      error.message ||
        "Failed to initiate checkout. Please try again later."
    );
  }
}
    
export async function getActiveBookings(): Promise<any> {
  try {
    const response = await apiHandler(`/api/booking/user?type=active`, {
      method: "GET",
    });

    // Remove the success check since your API doesn't return a success field
    if (!response.bookings || !Array.isArray(response.bookings)) {
      throw new Error("Invalid response from server");
    }
    return response;
  } catch (error: any) {
    console.error("Failed to fetch active bookings:", error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to fetch active bookings. Please try again later."
    );
  }
}
    
export async function getBookingHistory(): Promise<any> {
  try {
    const response = await apiHandler(`/api/booking/user?type=history`, {
      method: "GET",
    });

    // Remove the success check since your API doesn't return a success field
    if (!response.bookings || !Array.isArray(response.bookings)) {
      throw new Error("Invalid response from server");
    }
    return response;
  } catch (error: any) {
    console.error("Failed to fetch booking history:", error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to fetch booking history. Please try again later."
    );
  }
}

export async function postApartmentComment(apartmentId: string, rating: number, comment: string): Promise<any> {
  try {
    if (!apartmentId?.trim()) {
      throw new Error("Apartment ID is required");
    }
    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Valid rating (1-5) is required");
    }
    if (!comment?.trim()) {
      throw new Error("Comment is required");
    }

    const response = await apiHandler(`/api/apartment/${apartmentId}/comment`, {
      method: "POST",
      data: { rating, comment },
    });

    if (!response.success) {
      throw new Error("Invalid response from server");
    }
    return response;
  } catch (error: any) {
    console.error(`Failed to post comment for apartment ID ${apartmentId}:`, error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to post comment. Please try again later."
    );
  }
}

export async function getAllBookings(page: number = 1, limit: number = 10, search?: string): Promise<any> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search?.trim()) {
      params.append('search', search.trim());
    }

    const response = await apiHandler(`/api/booking/admin?${params.toString()}`, {
      method: "GET",
    });

    return response;
  } catch (error: any) {
    console.error("Failed to fetch all bookings:", error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to fetch bookings. Please try again later."
    );
  }
}

export async function getAllUsers(page: number = 1, limit: number = 10, search?: string): Promise<any> {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search?.trim()) {
      params.append('search', search.trim());
    }

    const response = await apiHandler(`/api/admin/users?${params.toString()}`, {
      method: "GET",
    });

    return response;
  } catch (error: any) {
    console.error("Failed to fetch all users:", error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to fetch users. Please try again later."
    );
  }
}

export async function verifyPayment(reference: string, bookingId: string): Promise<any> {
  try {
    if (!reference?.trim()) {
      throw new Error("Payment reference is required");
    }
    if (!bookingId?.trim()) {
      throw new Error("Booking ID is required");
    }

    const response = await apiHandler(`/api/payment/verify?reference=${reference}&bookingId=${bookingId}`, {
      method: "GET",
    });

    return response;
  } catch (error: any) {
    console.error(`Failed to verify payment for booking ID ${bookingId}:`, error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to verify payment. Please try again later."
    );
  }
}

export async function getAdminAnalytics(): Promise<AnalyticsResponse> {
  try {
    const response = await apiHandler("/api/admin/analytics", {
      method: "GET",
    });
    return response as AnalyticsResponse;
  } catch (error) {
    console.error("Error fetching analytics:", error);
    throw error;
  }
}

export async function getApartmentBookedDates(apartmentId: string): Promise<string[]> {
  try {
    if (!apartmentId?.trim()) {
      throw new Error("Apartment ID is required");
    }

    const response = await apiHandler(`/api/apartment/${apartmentId}/booked-dates`, {
      method: "GET",
    });

    // Validate response structure
    if (!response.bookedDates || !Array.isArray(response.bookedDates)) {
      throw new Error("Invalid response format from server");
    }

    // Return the array of booked date strings
    return response.bookedDates;
  } catch (error: any) {
    console.error(`Failed to fetch booked dates for apartment ID ${apartmentId}:`, error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to fetch booked dates. Please try again later."
    );
  }
}

// Helper function to check if a specific date is booked
export function isDateBooked(date: string, bookedDates: string[]): boolean {
  return bookedDates.includes(date);
}

// Helper function to check if a date range overlaps with any booked dates
export function isDateRangeAvailable(
  checkIn: string, 
  checkOut: string, 
  bookedDates: string[]
): boolean {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  
  // Generate all dates in the range (excluding checkout date)
  const dates = [];
  const currentDate = new Date(startDate);
  
  while (currentDate < endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  // Check if any date in the range is booked
  return !dates.some(date => bookedDates.includes(date));
}

// Helper function to get the next available date after a booked period
export function getNextAvailableDate(fromDate: string, bookedDates: string[]): string {
  const currentDate = new Date(fromDate);
  
  while (bookedDates.includes(currentDate.toISOString().split('T')[0])) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return currentDate.toISOString().split('T')[0];
}

export async function cancelBooking(bookingId: string): Promise<CancelBookingResponse> {
  try {
    const response = await apiHandler(`/api/booking/${bookingId}`, {
      method: "PATCH",
    });
    return response as CancelBookingResponse;
  } catch (error) {
    console.error("Error canceling booking:", error);
    throw error;
  }
}

export async function deleteUser(userId: string): Promise<any> {
  try {
    if (!userId?.trim()) {
      throw new Error("User ID is required for deletion");
    }

    const response = await apiHandler(`/api/admin/users/${userId}`, {
      method: "DELETE",
    });

    return response;
  } catch (error: any) {
    console.error(`Failed to delete user with ID ${userId}:`, error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message || "Failed to delete user. Please try again."
    );
  }
}

export async function getActivity(): Promise<ActivityResponse> {
 try {
   const response = await apiHandler("/api/activity", {
     method: "GET",
   });
   return response as ActivityResponse;
 } catch (error) {
   console.error("Error fetching activity:", error);
   throw error;
 }
}

export async function getApartmentReviews(apartmentId: string) {
  if (!apartmentId) throw new Error("Apartment ID is required");

  return apiHandler(`/apartment/${apartmentId}/comment`, {
    method: "GET",
  });
}
