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

    if (apartmentData.features?.length) {
      apartmentData.features.forEach((feature) => {
        formData.append("features", feature);
      });
    }

    if (apartmentData.rules?.length) {
      apartmentData.rules.forEach((rule) => {
        formData.append("rules", rule);
      });
    }

    if (images.length > 0) {
      images.forEach((file) => {
        formData.append("gallery", file);
      });
    }

    // Send request to update apartment
    const response = await apiHandler(`/api/apartment/${apartmentId}`, {
      method: "PUT", // assuming PUT is used for full updates
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
        throw new Error("Apartment ID is required for deletion")
      }

         console.log(`Deleting apartment with ID: ${apartmentId}`);

       const response = await apiHandler(`/api/apartment/${apartmentId}`, {
        method: 'DELETE',
       }) 
        console.log("Apartment deleted successfully:", response);
       return response 
     } catch (error: any) {
       console.error('failed to delete apartment:', error);

       if (error.status && error.message) {
        throw error;
       }

       throw new Error(error.message || 'failed to delete apartment. Please try again')
     }
}