import AdminContentLoader from "../../components/admin-content-loader";

export default function PartnerDetailLoading() {
  return (
    <div className="p-4 sm:p-6 bg-white min-h-screen">
      <div className="h-5 w-32 bg-slate-200 rounded mb-6 animate-pulse" />
      <AdminContentLoader />
    </div>
  );
}
