import AdminContentLoader from "../components/admin-content-loader";

export default function PartnersLoading() {
  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="h-8 w-48 bg-slate-200 rounded mb-6 animate-pulse" />
      <AdminContentLoader />
    </div>
  );
}
