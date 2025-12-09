"use client";

import { Pencil, Trash2, MapPin, BedDouble, Bath, Users, Plus } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import AddEditApartmentModal from "../components/add-apartment";
import DeleteApartmentModal from "../components/delete-modal";
import {
  getAdminApartments,
  deleteApartment,
  getApartmentById,
  createTrendingApartment,
  getTrendingApartments,
  deleteTrendingApartment,
} from "@/services/api-services";
import ApartmentLoadingPage from "@/components/loading";
import { useApartmentModal } from "@/context/apartment-context";
import { toast } from "sonner";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

type Apartment = {
  _id: string;
  id: string;
  name: string;
  location: string;
  address?: string;
  pricePerNight: number;
  rooms: number;
  bathrooms?: number;
  maxGuests?: number;
  features?: string[];
  rules?: string[];
  isTrending?: boolean;
  gallery?: string[];
  ratings?: number[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
  addons?: any[];
  status?: string;
};

type ApartmentsResponse = {
  data: Apartment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type DeleteModalState = {
  open: boolean;
  apartmentId: string | null;
  apartmentName: string;
  isDeleting: boolean;
};

export default function ApartmentsManagementPage() {
  const { modalState, openAddModal, openEditModal, closeModal } = useApartmentModal();
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  const [editLoading, setEditLoading] = useState<string | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<DeleteModalState>({
    open: false,
    apartmentId: null,
    apartmentName: "",
    isDeleting: false,
  });
  const [location, setLocation] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalApartments, setTotalApartments] = useState(0);
  const limit = 10;
  const debouncedLocation = useDebounce(location, 500);
  const [activeTab, setActiveTab] = useState<"all" | "trending">("all");
  const [trendingList, setTrendingList] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const fetchApartments = async (page: number = 1, locationQuery?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response: ApartmentsResponse = await getAdminApartments(page, limit, locationQuery?.trim());
      if (!Array.isArray(response.data)) {
        throw new Error("Invalid response: data array is missing or not an array");
      }
      if (
        !response.pagination ||
        typeof response.pagination.total !== "number" ||
        typeof response.pagination.totalPages !== "number"
      ) {
        throw new Error("Invalid pagination data in response");
      }

      // Parse malformed features and rules arrays
      const parsedData = response.data.map((apartment) => ({
        ...apartment,
        features:
          typeof apartment.features?.[0] === "string" && apartment.features?.[0].startsWith("[")
            ? JSON.parse(apartment.features[0])
            : apartment.features || [],
        rules:
          typeof apartment.rules?.[0] === "string" && apartment.rules?.[0].startsWith("[")
            ? JSON.parse(apartment.rules[0])
            : apartment.rules || [],
      }));

      // Sort by createdAt descending (newest first)
      const sortedData = parsedData.sort(
        (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );

      setApartments(sortedData);
      setTotalPages(response.pagination.totalPages);
      setTotalApartments(response.pagination.total);
      setCurrentPage(Math.min(page, response.pagination.totalPages) || 1);
    } catch (err: any) {
      const errorMessage =
        err.status === 404
          ? "Apartments API endpoint not found (/api/admin/apartment). Please verify the backend configuration."
          : err.status === 500
          ? "Server error while fetching apartments. Please try again later."
          : err.message || "Failed to fetch apartments. Please try again later.";
      setError(errorMessage);
      setApartments([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchTrending = async () => {
    try {
      setLoadingTrending(true);
      const response = await getTrendingApartments();
      console.log(response.data);
      setTrendingList(response.data || []);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoadingTrending(false);
    }
  };

  useEffect(() => {
    fetchApartments(currentPage, debouncedLocation);
  }, [debouncedLocation, currentPage]);

  useEffect(() => {
    if (activeTab === "trending") fetchTrending();
  }, [activeTab]);

  const handleSuccess = async () => {
    try {
      const response = await getAdminApartments(currentPage, debouncedLocation as any);
      // Parse and sort as in fetchApartments
      const parsedData = response.data.map((apartment: any) => ({
        ...apartment,
        features:
          typeof apartment.features?.[0] === "string" && apartment.features?.[0].startsWith("[")
            ? JSON.parse(apartment.features[0])
            : apartment.features || [],
        rules:
          typeof apartment.rules?.[0] === "string" && apartment.rules?.[0].startsWith("[")
            ? JSON.parse(apartment.rules[0])
            : apartment.rules || [],
      }));
      const sortedData = parsedData.sort(
        (a: any, b: any) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setApartments(sortedData || []);
      setTotalPages(response.pagination.totalPages);
      setTotalApartments(response.pagination.total);
      setCurrentPage(Math.min(currentPage, response.pagination.totalPages) || 1);
    } catch (err: any) {
      setError(err.message || "Failed to refresh apartments after adding/editing");
    } finally {
      closeModal();
    }
  };

  const handleEditClick = async (apartmentId: string) => {
    try {
      setEditLoading(apartmentId);
      const response = await getApartmentById(apartmentId);
      const fullApartmentData = response.data;

      // Parse features and rules for edit modal
      const parsedFeatures =
        typeof fullApartmentData.features?.[0] === "string" && fullApartmentData.features?.[0].startsWith("[")
          ? JSON.parse(fullApartmentData.features[0])
          : fullApartmentData.features || [];
      const parsedRules =
        typeof fullApartmentData.rules?.[0] === "string" && fullApartmentData.rules?.[0].startsWith("[")
          ? JSON.parse(fullApartmentData.rules[0])
          : fullApartmentData.rules || [];

      const modalData = {
        id: fullApartmentData._id,
        _id: fullApartmentData._id,
        name: fullApartmentData.name,
        location: fullApartmentData.location,
        address: fullApartmentData.address || "",
        pricePerNight: fullApartmentData.pricePerNight,
        rooms: fullApartmentData.rooms,
        bathrooms: fullApartmentData.bathrooms || 0,
        maxGuests: fullApartmentData.maxGuests || 1,
        features: parsedFeatures,
        rules: parsedRules,
        gallery: fullApartmentData.gallery || [],
        isTrending: fullApartmentData.isTrending || false,
        ratings: fullApartmentData.ratings || fullApartmentData.averageRating || 0,
        createdAt: fullApartmentData.createdAt,
        updatedAt: fullApartmentData.updatedAt,
        __v: fullApartmentData.__v,
        averageRating: fullApartmentData.averageRating || 0,
        feedbackCount: fullApartmentData.feedbackCount || 0,
        feedbacks: fullApartmentData.feedbacks || [],
        addons: fullApartmentData.addons || [],
        imageUrl: fullApartmentData.gallery?.[0] || "/placeholder.svg",
        price: fullApartmentData.pricePerNight,
        guests: fullApartmentData.maxGuests || 1,
        beds: fullApartmentData.rooms || 1,
        baths: fullApartmentData.bathrooms || 1,
        rating: fullApartmentData.ratings || fullApartmentData.averageRating || 4.8,
        galleryImages: (fullApartmentData.gallery || []).map((src: string, index: number) => ({
          id: `${fullApartmentData._id}-${index}`,
          src,
          alt: `${fullApartmentData.name} image ${index + 1}`,
        })),
        amenities: parsedFeatures.map((feature: string, index: number) => ({
          id: `amenity-${index}`,
          name: feature,
          icon: getIconForFeature(feature),
        })),
      };
      openEditModal(modalData);
    } catch (err: any) {
      alert("Failed to load apartment details for editing");
    } finally {
      setEditLoading(null);
    }
  };

  const getIconForFeature = (feature: string): string => {
    const featureIconMap: { [key: string]: string } = {
      wifi: "Wifi",
      "air-conditioning": "AirVent",
      kitchen: "Utensils",
      "smart-tv": "Tv",
      "laptop friendly": "Laptop",
      gym: "Dumbbell",
      parking: "ParkingSquare",
      "24-7-security": "ShieldCheck",
      "washing-machine": "WashingMachine",
      generator: "Zap",
    };
    const lowerFeature = feature.toLowerCase();
    return featureIconMap[lowerFeature] || "Info";
  };

  const handleDeleteClick = (apartment: Apartment) => {
    setDeleteModalState({
      open: true,
      apartmentId: apartment._id,
      apartmentName: apartment.name,
      isDeleting: false,
    });
  };

  const handleCloseDeleteModal = () => {
    if (!deleteModalState.isDeleting) {
      setDeleteModalState({
        open: false,
        apartmentId: null,
        apartmentName: "",
        isDeleting: false,
      });
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalState.apartmentId) return;
    try {
      setDeleteModalState((prev) => ({ ...prev, isDeleting: true }));
      await deleteApartment(deleteModalState.apartmentId);
      await fetchApartments(currentPage, debouncedLocation);
      handleCloseDeleteModal();
    } catch (err: any) {
      alert(err.message || "Failed to delete apartment");
    } finally {
      setDeleteModalState((prev) => ({ ...prev, isDeleting: false }));
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading && apartments.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
        <ApartmentLoadingPage />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  const handleAddToTrending = async (id: string) => {
    try {
      const response = await createTrendingApartment(id);
      console.log(response);
      toast.success(response.message);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
      <div className="w-full mb-10 h-[82px] bg-white shadow-md rounded-lg flex items-center px-4 gap-4 mt-[-20px]">
        <input
          type="text"
          placeholder="Search by location (e.g., Lekki)"
          className="w-[90%] p-3 rounded-[8px] border border-[#d1d5db]/30 text-sm outline-none"
          value={location}
          onChange={handleSearch}
        />
      </div>

      <div className="flex gap-4 mt-[-20px] mb-6">
        <button
          onClick={() => setActiveTab("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "all" ? "bg-black text-white" : "bg-white text-black border border-black/20"
          }`}
        >
          All Apartments
        </button>

        <button
          onClick={() => setActiveTab("trending")}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === "trending" ? "bg-black text-white" : "bg-white text-black border border-black/20"
          }`}
        >
          Trending Apartments
        </button>
      </div>

      {activeTab === "all" && (
        <div className="hidden md:block container mx-auto w-full bg-white shadow-md rounded-lg p-4 mt-10 overflow-x-auto">
          <table className="w-full text-sm font-normal text-left table-fixed">
            <thead className="text-xs text-[#4b5566] uppercase">
              <tr>
                <th className="py-2 w-[25%] min-w-[250px]">Apartment</th>
                <th className="w-[12%] min-w-[100px]">Location</th>
                <th className="w-[12%] min-w-[100px]">Price/Night</th>
                <th className="w-[8%] min-w-[60px]">Rooms</th>
                <th className="w-[20%] min-w-[150px]">Features</th>
                <th className="w-[10%] min-w-[80px]">Status</th>
                <th className="w-[13%] min-w-[120px]">Action</th>
              </tr>
            </thead>
            <tbody className="mt-4">
              {apartments.map((apt) => (
                <tr key={apt._id} className="text-[#111827] text-sm font-normal border-b border-gray-100">
                  <td className="py-3 font-medium">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={apt.gallery?.[0] || "/images/default-apartment.png"}
                          alt={apt.name}
                          fill
                          className="rounded object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium truncate pe-3">{apt.name}</div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                          Added {apt.createdAt ? new Date(apt.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="truncate" title={apt.location}>
                      {apt.location}
                    </div>
                  </td>
                  <td className="py-3 whitespace-nowrap">₦{apt.pricePerNight?.toLocaleString() || "0"}</td>
                  <td className="py-3 text-center">{apt.rooms}</td>
                  <td className="py-3">
                    <div className="truncate" title={apt.features?.join(", ") || "N/A"}>
                      {apt.features?.join(", ") || "N/A"}
                    </div>
                  </td>
                  <td className="py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex gap-2 items-center">
                      <button
                        onClick={() => handleEditClick(apt._id)}
                        disabled={editLoading === apt._id}
                        className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1 text-xs disabled:opacity-50"
                      >
                        {editLoading === apt._id ? (
                          <>
                            <div className="w-3 h-3 border border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <Pencil className="w-3 h-3" /> Edit
                          </>
                        )}
                      </button>
                      <button
                        className="text-red-600 hover:underline cursor-pointer flex items-center gap-1 text-xs"
                        onClick={() => handleDeleteClick(apt)}
                      >
                        <Trash2 className="w-3 h-3" /> Delete
                      </button>

                      <button
                        className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1 text-xs"
                        onClick={() => handleAddToTrending(apt._id)}
                      >
                        <Plus className="w-3 h-3" /> Trending
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "all" && (
        <div className="md:hidden space-y-4">
          {apartments.map((apt) => (
            <div key={apt._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
              <div className="flex gap-3">
                <div className="relative w-20 h-12 rounded-md overflow-hidden flex-shrink-0">
                  <Image
                    src={apt.gallery?.[0] || "/images/default-apartment.png"}
                    alt={apt.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-[#111827]">{apt.name}</p>
                </div>
              </div>
              <div className="text-sm text-[#374151] space-y-2">
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> {apt.location}
                </p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <BedDouble className="w-3 h-3" />
                    <span>{apt.rooms} rooms</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-3 h-3" />
                    <span>{apt.bathrooms || 0} baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{apt.maxGuests || 1} guests</span>
                  </div>
                  <div className="flex items-center gap-1 text-green-600 font-semibold">
                    <span>₦{apt.pricePerNight?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Status:</span>
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">Features:</span>
                    <span>{apt.features?.slice(0, 2).join(", ") || "N/A"}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-4 mt-2">
                <button
                  onClick={() => handleEditClick(apt._id)}
                  disabled={editLoading === apt._id}
                  className="flex-1 bg-[#f3f4f6] text-[#374151] cursor-pointer text-sm py-2 rounded-md flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  {editLoading === apt._id ? (
                    <>
                      <div className="w-4 h-4 border border-gray-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Pencil className="w-4 h-4" /> Edit
                    </>
                  )}
                </button>
                <button
                  className="flex-1 bg-[#fef2f2] text-[#dc2626] cursor-pointer text-sm py-2 rounded-md flex items-center justify-center gap-1"
                  onClick={() => handleDeleteClick(apt)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop trending */}
      {activeTab === "trending" && (
        <div className="w-full bg-white shadow-md rounded-lg p-4 mt-10 overflow-x-auto">
          {loadingTrending ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : trendingList.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No trending apartments yet</p>
          ) : (
            <table className="w-full text-sm font-normal text-left table-fixed">
              <thead className="text-xs text-[#4b5566] uppercase">
                <tr>
                  <th className="py-2 w-[25%] min-w-[250px]">Apartment</th>
                  <th className="w-[12%] min-w-[100px]">Location</th>
                  <th className="w-[12%] min-w-[100px]">Price/Night</th>
                  <th className="w-[10%] min-w-[120px] text-center">Action</th>
                </tr>
              </thead>

              <tbody>
                {trendingList.map((item) => (
                  <tr key={item._id} className="text-[#111827] text-sm border-b border-gray-100">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 flex-shrink-0">
                          <Image
                            src={item.apartmentId?.gallery?.[0] || "/placeholder.svg"}
                            alt={item.apartmentId?.name}
                            fill
                            className="rounded object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-medium truncate">{item.apartmentId?.name}</div>
                          <div className="text-xs text-gray-500">Trending ID: {item._id.slice(-6)}</div>
                        </div>
                      </div>
                    </td>

                    <td>{item.apartmentId?.location}</td>

                    <td>₦{item.apartmentId?.pricePerNight?.toLocaleString()}</td>

                    <td className="text-center">
                      <button
                        onClick={async () => {
                          try {
                            await deleteTrendingApartment(item._id);
                            toast.success("Removed from trending");
                            fetchTrending();
                          } catch (err: any) {
                            toast.error(err.message);
                          }
                        }}
                        className="text-red-600 hover:underline text-xs flex items-center justify-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Mobile trending */}
      {activeTab === "trending" && (
        <div className="md:hidden space-y-4 mt-6">
          {loadingTrending ? (
            <div className="flex justify-center py-10">
              <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : trendingList.length === 0 ? (
            <p className="text-center py-6 text-gray-500">No trending apartments yet</p>
          ) : (
            trendingList.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
                <div className="flex gap-3">
                  <div className="relative w-20 h-12 rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={item.apartment?.gallery?.[0] || "/placeholder.svg"}
                      alt={item.apartment?.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <p className="text-base font-semibold">{item.apartment?.name}</p>
                    <p className="text-sm text-gray-500">{item.apartment?.location}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-black font-semibold text-sm">
                    ₦{item.apartment?.pricePerNight?.toLocaleString()}
                  </span>

                  <button
                    onClick={async () => {
                      try {
                        await deleteTrendingApartment(item._id);
                        toast.success("Removed from trending");
                        fetchTrending();
                      } catch (err: any) {
                        toast.error(err.message);
                      }
                    }}
                    className="text-red-600 text-sm flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {totalApartments > 0 && (
        <div className="w-full max-w-[1200px] bottom-0 flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-gray-500">
          <span className="mb-2 sm:mb-0">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalApartments)} of{" "}
            {totalApartments} apartments
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Prev
            </button>
            {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
              const pageNumber = Math.max(1, currentPage - 1) + i;
              if (pageNumber > totalPages) return null;
              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-3 py-1 border rounded ${pageNumber === currentPage ? "bg-black text-white" : ""}`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Use the new DeleteApartmentModal component */}
      <DeleteApartmentModal
        isOpen={deleteModalState.open}
        apartmentName={deleteModalState.apartmentName}
        isDeleting={deleteModalState.isDeleting}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
      />

      <AddEditApartmentModal
        open={modalState.open}
        onClose={closeModal}
        onSuccess={handleSuccess}
        editMode={modalState.editMode}
        apartmentData={modalState.apartmentData}
      />
    </div>
  );
}
