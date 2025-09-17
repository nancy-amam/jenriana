"use client";

import { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { getAllUsers, deleteUser } from "@/services/api-services";
import ApartmentLoadingPage from "@/components/loading";
import DeleteUserModal from "../components/delete-user";

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
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  const fetchUsers = async (page: number = 1, searchQuery?: string) => {
    try {
      setLoading(true);
      setError(null);

      const response: UsersResponse = await getAllUsers(page, limit, searchQuery?.trim() || undefined);

      if (!response.users || !Array.isArray(response.users)) {
        throw new Error("Invalid response: users array is missing or not an array");
      }

      setUsers(response.users);
      setTotalPages(response.pagination?.pages || 1);
      setTotalUsers(response.pagination?.total || 0);
      setCurrentPage(response.pagination?.page || page);
    } catch (err: any) {
      const errorMessage = err.message || "Failed to fetch users";
      setError(errorMessage);
      setUsers([]);
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

  if (loading && users.length === 0) {
    return <ApartmentLoadingPage />;
  }

  if (error) {
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
      <div className="w-full max-w-[1200px] h-[82px] bg-white rounded-lg shadow-md px-4 py-4 flex items-center gap-4 md:mb-6 mt-[-20px]">
        <input
          type="text"
          placeholder="Search by guest name or email"
          className="w-[90%] outline-none p-3 rounded-[8px] text-sm text-gray-700 placeholder:text-gray-400 border border-[#d1d5db]/30"
          value={search}
          onChange={handleSearch}
        />
        {loading && <div className="text-gray-500 text-sm">Searching...</div>}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block w-full max-w-[1200px] bg-white rounded-lg shadow-md p-4">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-[#4b5566] uppercase">
            <tr>
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Phone Number</th>
              <th>Total Bookings</th>
              {/* <th>Actions</th> */}
            </tr>
          </thead>
          <tbody>
            {memoizedUsers.map((user) => (
              <tr key={user._id} className="text-[#111827] text-sm font-normal">
                <td className="py-3 font-medium">{user.fullname}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.totalBookings}</td>
                {/* <td className="flex gap-3 items-center py-2">
                  <button className="text-blue-600 hover:underline cursor-pointer flex items-center gap-1">
                    <Pencil className="w-4 h-4" /> Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(user._id)}
                    className="text-red-600 hover:underline flex cursor-pointer items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
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

      {/* Delete Confirmation Modal */}
      <DeleteUserModal
        isOpen={isModalOpen}
        loading={loading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Empty State */}
      {memoizedUsers.length === 0 && !loading && (
        <div className="w-full max-w-[1200px] bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500">No users found.</p>
        </div>
      )}

      {/* Pagination */}
      {totalUsers > 0 && (
        <div className="w-full max-w-[1200px] bottom-0 flex flex-col sm:flex-row items-center justify-between mt-6 text-sm text-gray-500">
          <span className="mb-2 sm:mb-0">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
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
    </div>
  );
}
