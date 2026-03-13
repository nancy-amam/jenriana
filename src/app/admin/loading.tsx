import AdminContentLoader from "./components/admin-content-loader";

export default function AdminLoading() {
  return (
    <div className="p-4 sm:p-6 bg-white">
      <AdminContentLoader />
    </div>
  );
}
