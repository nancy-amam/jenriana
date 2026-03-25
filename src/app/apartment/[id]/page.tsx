import ApartmentDetailClient from "./apartment-detail-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ApartmentDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <ApartmentDetailClient id={id} />;
}
