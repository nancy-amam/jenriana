import { apiHandler } from "@/utils/api-handler";
import { SignInData, SignUpData, ApartmentData } from "@/lib/interface";

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

    console.log(`Initiating checkout for booking ID: ${bookingId} with payment method: ${paymentMethod}`);

    if (paymentMethod === 'bank-transfer') {
      return {
        success: true,
        bankDetails: {
          bankName: "Jenrianna Bank",
          accountName: "Jenrianna Apartments",
          accountNumber: "1234567890",
          note: "Your booking will be confirmed upon receipt of payment."
        }
      };
    }

    const response = await apiHandler(`/api/booking/${bookingId}/checkout`, {
      method: "POST",
      data: { paymentMethod },
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