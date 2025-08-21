import { apiHandler } from "@/utils/api-handler";
import { SignInData, SignUpData, ApartmentData, AnalyticsResponse } from "@/lib/interface";

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
    console.log("Adding apartment with data:", apartmentData);

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

    console.log("Apartment added successfully:", response);
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

export async function getApartments(): Promise<any> {
  try {
    console.log("Fetching all apartments...");

    const response = await apiHandler("/api/apartment", {
      method: "GET",
    });

    console.log("Apartments fetched successfully:", response);

     if (response.success && Array.isArray(response.data)) {
      response.data = response.data.map((apt: any) => ({
        ...apt,
        id: apt._id,
      }));
    }

    return response;
  } catch (error: any) {
    console.error("Failed to fetch apartments:", error);

    if (error.status && error.message) {
      throw error;
    }

    throw new Error(
      error.message ||
        "Failed to fetch apartments. Please try again later."
    );
  }
}

export async function getApartmentById(apartmentId: string): Promise<any> {
  try {
    if (!apartmentId?.trim()) {
      throw new Error("Apartment ID is required");
    }

    console.log(`Fetching apartment with ID: ${apartmentId}`);

    const response = await apiHandler(`/api/apartment/${apartmentId}`, {
      method: "GET",
    });

    console.log("Apartment fetched successfully:", response);
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

export async function updateApartment(
  apartmentId: string,
  apartmentData: ApartmentData,
  images: File[] = []
): Promise<any> {
  try {
    if (!apartmentId?.trim()) {
      throw new Error("Apartment ID is required for update");
    }

    console.log(`Updating apartment with ID: ${apartmentId}`);

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

    console.log("Apartment updated successfully:", response);
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

    console.log(`Deleting apartment with ID: ${apartmentId}`);

    const response = await apiHandler(`/api/apartment/${apartmentId}`, {
      method: "DELETE",
    });

    console.log("Apartment deleted successfully:", response);
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

    console.log(`Creating booking for apartment ID: ${apartmentId}`, bookingData);

    const response = await apiHandler(`/api/apartment/${apartmentId}/book`, {
      method: "POST",
      body: bookingData,
    });

    console.log("Booking created successfully:", response);
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
    
    console.log('Initiating checkout with callback URL:', `${baseUrl}/payment-success?bookingId=${bookingId}`);
        
    const response = await apiHandler(`/api/booking/${bookingId}/checkout`, {
      method: "POST",
      data: {
        paymentMethod,
        // Include bookingId in the callback URL so it's available after payment
        callback_url: `${baseUrl}/payment-success?bookingId=${bookingId}`
      },
    });
 
    console.log("Checkout initialized successfully:", response);
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
    console.log("Fetching active bookings");

    const response = await apiHandler(`/api/booking/user?type=active`, {
      method: "GET",
    });

    console.log("Active bookings fetched successfully:", response);
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
    console.log("Fetching booking history");

    const response = await apiHandler(`/api/booking/user?type=history`, {
      method: "GET",
    });

    console.log("Booking history fetched successfully:", response);
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

    console.log(`Posting comment for apartment ID: ${apartmentId}`);

    const response = await apiHandler(`/api/apartment/${apartmentId}/comment`, {
      method: "POST",
      data: { rating, comment },
    });

    console.log("Comment posted successfully:", response);
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
    console.log(`Fetching all bookings - Page: ${page}, Limit: ${limit}`, search ? `Search: ${search}` : '');

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

    console.log("All bookings fetched successfully:", response);
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
    console.log(`Fetching all users - Page: ${page}, Limit: ${limit}`, search ? `Search: ${search}` : '');

    // Build query parameters
    const params = new URLSearchParams({
      page: String(page),
      limit: String(limit),
    });

    if (search?.trim()) {
      params.append('search', search.trim());
    }

    const response = await apiHandler(`/api/users/admin?${params.toString()}`, {
      method: "GET",
    });

    console.log("All users fetched successfully:", response);
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

    console.log(`Verifying payment for booking ID: ${bookingId}, reference: ${reference}`);

    const response = await apiHandler(`/api/payment/verify?reference=${reference}&bookingId=${bookingId}`, {
      method: "GET",
    });

    console.log("Payment verified successfully:", response);
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



