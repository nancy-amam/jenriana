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
import AdminContentLoader from "../components/admin-content-loader";
import { useApartmentModal } from "@/context/apartment-context";
import { useAdminData } from "@/context/admin-data-context";
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
  const { apartmentsCache, setApartmentsCache } = useAdminData();
  const [apartments, setApartments] = useState<Apartment[]>(apartmentsCache?.apartments ?? []);
  const [loading, setLoading] = useState(apartmentsCache ? false : true);
  const [error, setError] = useState<null | string>(null);
  const [editLoading, setEditLoading] = useState<string | null>(null);
  const [deleteModalState, setDeleteModalState] = useState<DeleteModalState>({
    open: false,
    apartmentId: null,
    apartmentName: "",
    isDeleting: false,
  });
  const [location, setLocation] = useState(apartmentsCache?.location ?? "");
  const [currentPage, setCurrentPage] = useState(apartmentsCache?.currentPage ?? 1);
  const [totalPages, setTotalPages] = useState(apartmentsCache?.totalPages ?? 1);
  const [totalApartments, setTotalApartments] = useState(apartmentsCache?.totalApartments ?? 0);
  const limit = 10;
  const debouncedLocation = useDebounce(location, 500);
  const [activeTab, setActiveTab] = useState<"all" | "trending">("all");
  const [trendingList, setTrendingList] = useState<any[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(false);

  const fetchApartments = async (page: number = 1, locationQuery?: string) => {
    try {
      setLoading(apartments.length === 0);
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

      const nextPage = Math.min(page, response.pagination.totalPages) || 1;
      const nextLocation = locationQuery?.trim() ?? location;

      setApartments(sortedData);
      setTotalPages(response.pagination.totalPages);
      setTotalApartments(response.pagination.total);
      setCurrentPage(nextPage);
      setApartmentsCache({
        apartments: sortedData,
        totalPages: response.pagination.totalPages,
        totalApartments: response.pagination.total,
        currentPage: nextPage,
        location: nextLocation,
      });
    } catch (err: any) {
      const errorMessage =
        err.status === 404
          ? "Apartments API endpoint not found (/api/admin/apartment). Please verify the backend configuration."
          : err.status === 500
          ? "Server error while fetching apartments. Please try again later."
          : err.message || "Failed to fetch apartments. Please try again later.";
      setError(errorMessage);
      setApartments([]);
      setApartmentsCache(null);
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

  if (error && apartments.length === 0) {
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
      <div className="w-full mb-6 bg-white rounded-xl border border-gray-200/80 shadow-sm flex items-center px-5 py-4">
        <input
          type="text"
          placeholder="Search by location (e.g., Lekki)"
          className="flex-1 p-3 rounded-lg border border-gray-200 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400/30 transition"
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

      {loading && apartments.length === 0 ? (
        <AdminContentLoader />
      ) : (
        <>
      {activeTab === "all" && (
        <div className="hidden md:block w-full overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm mt-4">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-gray-200">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Apartment
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Location
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Price/Night
                  </th>
                  <th className="px-5 py-4 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Rooms
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Features
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {apartments.map((apt) => (
                  <tr key={apt._id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                          <Image
                            src={apt.gallery?.[0] || "/images/default-apartment.png"}
                            alt={apt.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-slate-900 truncate max-w-[180px]">{apt.name}</div>
                          <div className="text-xs text-slate-500">
                            {apt.createdAt ? new Date(apt.createdAt).toLocaleDateString() : "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 truncate max-w-[120px]" title={apt.location}>
                      {apt.location}
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-900 whitespace-nowrap">
                      ₦{apt.pricePerNight?.toLocaleString() || "0"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                        {apt.rooms}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 max-w-[160px]">
                      <span className="line-clamp-2" title={apt.features?.join(", ") || "—"}>
                        {apt.features?.slice(0, 2).join(", ") || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        Active
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-2 items-center justify-end">
                        <button
                          onClick={() => handleEditClick(apt._id)}
                          disabled={editLoading === apt._id}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 disabled:opacity-50 transition"
                        >
                          {editLoading === apt._id ? (
                            <>
                              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              Loading
                            </>
                          ) : (
                            <>
                              <Pencil className="w-3.5 h-3.5" /> Edit
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleAddToTrending(apt._id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
                        >
                          <Plus className="w-3.5 h-3.5" /> Trending
                        </button>
                        <button
                          onClick={() => handleDeleteClick(apt)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
        <div className="w-full overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm mt-4">
          {loadingTrending ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
            </div>
          ) : trendingList.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-500 text-sm">No trending apartments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-gray-200">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Apartment
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Location
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Price/Night
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {trendingList.map((item) => (
                    <tr key={item._id} className="transition-colors hover:bg-slate-50/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-11 h-11 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100">
                            <Image
                              src={item.apartmentId?.gallery?.[0] || "/placeholder.svg"}
                              alt={item.apartmentId?.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{item.apartmentId?.name}</div>
                            <div className="text-xs text-slate-500">ID: {item._id.slice(-6)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">{item.apartmentId?.location}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-slate-900">
                        ₦{item.apartmentId?.pricePerNight?.toLocaleString()}
                      </td>
                      <td className="px-5 py-4 text-right">
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
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1">
          <p className="text-sm text-slate-600">
            Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * limit, totalApartments)}</span> of{" "}
            <span className="font-medium">{totalApartments}</span> apartments
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Previous
            </button>
            <div className="flex items-center gap-1 mx-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const start = Math.max(1, currentPage - 2);
                const pageNumber = Math.min(start + i, totalPages);
                if (pageNumber < 1) return null;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => handlePageChange(pageNumber)}
                    className={`min-w-[36px] px-3 py-2 text-sm font-medium rounded-lg transition ${
                      pageNumber === currentPage
                        ? "bg-slate-900 text-white"
                        : "text-slate-600 bg-white border border-gray-200 hover:bg-slate-50"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-gray-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

        </>
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
