```typescript
import { apiHandler } from "@/utils/api-handler";
import { SignInData, SignUpData, ApartmentData, Apartment } from "@/lib/interface";

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
    console.log("Adding apartment with data:", JSON.stringify(apartmentData, null, 2));

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
    });

    console.log("Apartment added successfully:", JSON.stringify(response, null, 2));
    return response;
  } catch (error: any) {
    console.error("Failed to add apartment:", error);
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

    console.log("Apartments fetched successfully:", JSON.stringify(response, null, 2));
    return response;
  } catch (error: any) {
    console.error("Failed to fetch apartments:", error);
    throw new Error(
      error.message ||
        "Failed to fetch apartments. Please try again later."
    );
  }
}

export async function getApartmentById(apartmentId: string): Promise<Apartment> {
  try {
    if (!apartmentId?.trim()) {
      throw new Error("Apartment ID is required");
    }

    console.log(`Fetching apartment with ID: ${apartmentId}`);

    const response = await apiHandler(`/api/apartment/${apartmentId}`, {
      method: "GET",
    });

    console.log("Apartment fetched successfully:", JSON.stringify(response, null, 2));
    console.log("Addons in response:", JSON.stringify(response.data?.addons || response.data?.addOns || [], null, 2));

    if (!response.data) {
      throw new Error("Invalid response from server: No data field");
    }

    // Map response.data to Apartment interface, handling potential addOns field
    const apartment: Apartment = {
      ...response.data,
      id: response.data._id || response.data.id,
      addons: response.data.addons || response.data.addOns || [],
      addOns: response.data.addOns || response.data.addons || [],
      // Ensure addons have consistent id field
      addons: (response.data.addons || response.data.addOns || []).map((addon: any, index: number) => ({
        ...addon,
        id: addon.id || addon._id || `${Date.now()}-${index}`,
      })),
    };

    return apartment;
  } catch (error: any) {
    console.error(`Failed to fetch apartment with ID ${apartmentId}:`, error);
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

    console.log(`Updating apartment with ID: ${apartmentId}`, JSON.stringify(apartmentData, null, 2));

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

    console.log("Apartment updated successfully:", JSON.stringify(response, null, 2));
    return response;
  } catch (error: any) {
    console.error("Failed to update apartment:", error);
    throw new Error(
      error.message ||
        "Failed to update apartment. Please check your data and try again."
    );
  }
}

// ... (other functions remain unchanged)
```

**Changes**:
- Added specific logging for `addons` in `getApartmentById`:
  ```typescript
  console.log("Addons in response:", JSON.stringify(response.data?.addons || response.data?.addOns || [], null, 2));
  ```
- Enhanced mapping to ensure `addons` have an `id` field:
  ```typescript
  addons: (response.data.addons || response.data.addOns || []).map((addon: any, index: number) => ({
    ...addon,
    id: addon.id || addon._id || `${Date.now()}-${index}`,
  })),
  ```

### Next Steps
1. **Run the Application**:
   - Test opening the modal in edit mode for apartment ID `68a4c2994be949698e0aff48`.
   - Check the console for:
     - `Apartment fetched successfully: {...}` (from `getApartmentById`)
     - `Addons in response: [...]` (from `getApartmentById`)
     - `Opening edit modal with apartment: {...}` (from `ApartmentModalContext`)
     - `useEffect triggered {editMode: true, open: true, apartmentData: {...}}` (from `AddEditApartmentModal`)

2. **Share Logs**:
   - Share the full console output for the above logs, especially the `getApartmentById` response. This will confirm whether `response.data.addons` exists and matches the `getApartments` response.

3. **Inspect Calling Component**:
   - Identify the component calling `openEditModal` (e.g., an admin dashboard). Add a log before the call:
     ```typescript
     console.log('Preparing to open edit modal with apartment:', JSON.stringify(apartment, null, 2));
     useApartmentModal().openEditModal(apartment);
     ```
   - Share this log to confirm the `apartment` object’s state.

4. **Check `apiHandler`**:
   - Share the `apiHandler` code from `utils/api-handler.ts` to rule out any response transformation issues.

5. **Verify Backend**:
   - If `getApartmentById` does not return `addons`, but `getApartments` does, the backend API endpoints (`/api/apartment/${apartmentId}` vs. `/api/apartment`) may be inconsistent. Check the backend code or API documentation for the `/api/apartment/${apartmentId}` response structure.

### Expected Outcome
- If `getApartmentById` shows `response.data.addons` with the four add-ons, the updated mapping should populate `addOns` in the modal.
- If `response.data.addons` is missing, we need to investigate the backend or `apiHandler`.
- The updated `AddEditApartmentModal` will display a clear message if no add-ons are found, improving UX.

Please share the console logs from the debugging steps, and we can pinpoint the exact issue and provide further fixes if needed.