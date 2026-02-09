"use client";

import { useState, useEffect, useMemo } from "react";
import { getAllUsers, deleteUser } from "@/services/api-services";
import AdminContentLoader from "../components/admin-content-loader";
import DeleteUserModal from "../components/delete-user";
import { useAdminData } from "@/context/admin-data-context";

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface User {
  _id: string;
  email: string;
  fullname: string;
  phone: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  totalBookings: number;
}

interface UsersResponse {
  message: string;
  users: User[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

export default function AdminGuestsPage() {
  const { guestsCache, setGuestsCache } = useAdminData();
  const [search, setSearch] = useState(guestsCache?.search ?? "");
  const [users, setUsers] = useState<User[]>(guestsCache?.users ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(guestsCache?.currentPage ?? 1);
  const [totalPages, setTotalPages] = useState(guestsCache?.totalPages ?? 1);
  const [totalUsers, setTotalUsers] = useState(guestsCache?.totalUsers ?? 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  const fetchUsers = async (page: number = 1, searchQuery?: string) => {
    try {
      setLoading(users.length === 0);
      setError(null);

      const response: UsersResponse = await getAllUsers(page, limit, searchQuery?.trim() || undefined);

      if (!response.users || !Array.isArray(response.users)) {
        throw new Error("Invalid response: users array is missing or not an array");
      }

      const nextUsers = response.users;
      const nextTotalPages = response.pagination?.pages || 1;
      const nextTotalUsers = response.pagination?.total || 0;
      const nextPage = response.pagination?.page || page;
      const nextSearch = searchQuery?.trim() ?? search;

      setUsers(nextUsers);
      setTotalPages(nextTotalPages);
      setTotalUsers(nextTotalUsers);
      setCurrentPage(nextPage);
      setGuestsCache({
        users: nextUsers,
        totalPages: nextTotalPages,
        totalUsers: nextTotalUsers,
        currentPage: nextPage,
        search: nextSearch,
      });
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch users";
      setError(errorMessage);
      setUsers([]);
      setGuestsCache(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (userId: string) => {
    setUserToDelete(userId);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;

    try {
      setLoading(true);
      await deleteUser(userToDelete);
      await fetchUsers(currentPage, debouncedSearch);
      setIsModalOpen(false);
      setUserToDelete(null);
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setUserToDelete(null);
  };

  useEffect(() => {
    fetchUsers(currentPage, debouncedSearch);
  }, [debouncedSearch, currentPage]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const memoizedUsers = useMemo(() => users, [users]);

  if (error && users.length === 0) {
    return (
      <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-red-600">Error: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-[#f1f1f1] min-h-screen">
      {/* Search */}
      <div className="w-full h-[82px] bg-white rounded-lg shadow-md px-4 py-4 flex items-center gap-4 md:mb-6 mt-[-20px]">
        <input
          type="text"
          placeholder="Search by guest name or email"
          className="w-[90%] outline-none p-3 rounded-[8px] text-sm text-gray-700 placeholder:text-gray-400 border border-[#d1d5db]/30"
          value={search}
          onChange={handleSearch}
        />
        {loading && <div className="text-gray-500 text-sm">Searching...</div>}
      </div>

      {/* Initial load: show compact loader in content area only */}
      {loading && users.length === 0 ? (
        <AdminContentLoader />
      ) : (
        <>
      {/* Desktop Table */}
      <div className="hidden lg:block w-full overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-200">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Name
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Email
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Phone Number
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Total Bookings
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {memoizedUsers.map((user) => (
                <tr key={user._id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-5 py-4 text-sm font-medium text-slate-900">{user.fullname}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{user.email}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{user.phone || "—"}</td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                      {user.totalBookings}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4 mt-6">
        {memoizedUsers.map((user) => (
          <div key={user._id} className="bg-white rounded-lg shadow-md p-4 relative">
            <p className="text-sm font-semibold text-gray-800">{user.fullname}</p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-600">{user.phone}</p>
            <p className="text-sm text-gray-700 mt-1">Total Bookings: {user.totalBookings}</p>
            {/* <div className="flex gap-4 mt-4">
              <button className="flex-1 bg-[#f3f4f6] text-[#374151] py-2 cursor-pointer rounded-md text-sm font-medium flex items-center justify-center gap-1">
                <Pencil className="w-4 h-4" /> Edit
              </button>
              <button
                onClick={() => handleDeleteClick(user._id)}
                className="flex-1 bg-[#fef2f2] text-[#dc2626] py-2 cursor-pointer rounded-md text-sm font-medium flex items-center justify-center gap-1"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div> */}
          </div>
        ))}
      </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={isModalOpen}
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Empty State */}
      {memoizedUsers.length === 0 && !loading && (
        <div className="w-full overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-sm p-12 text-center">
          <p className="text-slate-500 text-sm">No users found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalUsers > 0 && (
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-1">
          <p className="text-sm text-slate-600">
            Showing <span className="font-medium">{(currentPage - 1) * limit + 1}</span> to{" "}
            <span className="font-medium">{Math.min(currentPage * limit, totalUsers)}</span> of{" "}
            <span className="font-medium">{totalUsers}</span> users
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
    </div>
  );
}
