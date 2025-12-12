"use client";

import { useEffect, useState } from "react";
import { getFeedbacks, updateFeedbackPublish } from "@/services/api-services";

export default function FeedbackTable() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selected, setSelected] = useState<any>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getFeedbacks();
      setFeedbacks(res.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const togglePublish = async (id: string, current: boolean) => {
    try {
      setUpdatingId(id);
      await updateFeedbackPublish(id, !current);
      fetchData();
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-white mt-10 rounded-lg shadow-md h-[200px] animate-pulse flex items-center justify-center text-gray-400">
        Loading feedback...
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block container mx-auto w-full bg-white shadow-md rounded-lg p-4 mt-10 overflow-x-auto">
        <table className="w-full text-sm font-normal text-left table-fixed">
          <thead className="text-xs text-[#4b5566] uppercase">
            <tr>
              <th className="py-2 w-[20%] min-w-[200px]">Name</th>
              <th className="w-[15%] min-w-[150px]">Contact</th>
              <th className="w-[10%] min-w-[100px]">Booking</th>
              <th className="w-[10%] min-w-[100px]">Cleanliness</th>
              <th className="w-[10%] min-w-[100px]">Amenities</th>
              <th className="w-[10%] min-w-[100px]">Customer Service</th>
              <th className="w-[10%] min-w-[100px]">Recommend</th>
              <th className="w-[10%] min-w-[100px]">Publish</th>
              <th className="w-[5%] min-w-[80px]">Action</th>
            </tr>
          </thead>

          <tbody>
            {feedbacks.map((fb: any) => (
              <tr key={fb._id} className="border-b border-gray-100">
                <td className="py-3 cursor-pointer underline" onClick={() => setSelected(fb)}>
                  {fb.name}
                </td>

                <td className="py-3 truncate">{fb.contact}</td>

                <td className="py-3">{fb.bookingProcess || "-"}</td>
                <td className="py-3">{fb.cleanliness || "-"}</td>
                <td className="py-3">{fb.amenitiesComfort || "-"}</td>
                <td className="py-3">{fb.customerService || "-"}</td>

                <td className="py-3 font-medium">
                  {fb.recommend === "Yes" ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs">Yes</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs">No</span>
                  )}
                </td>

                <td className="py-3">
                  {fb.publish ? (
                    <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 text-xs">Published</span>
                  ) : (
                    <span className="px-2 py-1 rounded-full bg-gray-200 text-gray-800 text-xs">Hidden</span>
                  )}
                </td>

                <td className="py-3">
                  <button
                    onClick={() => togglePublish(fb._id, fb.publish)}
                    disabled={updatingId === fb._id}
                    className="text-blue-600 text-xs underline disabled:opacity-40"
                  >
                    {updatingId === fb._id ? "Updating…" : fb.publish ? "Unpublish" : "Publish"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <FeedbackModal open={!!selected} feedback={selected} onClose={() => setSelected(null)} />
    </>
  );
}

function FeedbackModal({ open, onClose, feedback }: any) {
  if (!open || !feedback) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-xl p-6 shadow-xl animate-[fadeIn_.25s_ease]">
        <h2 className="text-lg font-semibold mb-4">Feedback Details</h2>

        <div className="space-y-3 text-sm">
          <p>
            <span className="font-medium">Name:</span> {feedback.name}
          </p>
          <p>
            <span className="font-medium">Contact:</span> {feedback.contact}
          </p>

          <p>
            <span className="font-medium">Booking Process:</span> {feedback.bookingProcess || "-"}
          </p>
          <p>
            <span className="font-medium">Cleanliness:</span> {feedback.cleanliness || "-"}
          </p>
          <p>
            <span className="font-medium">Amenities:</span> {feedback.amenitiesComfort || "-"}
          </p>
          <p>
            <span className="font-medium">Customer Service:</span> {feedback.customerService || "-"}
          </p>
          <p>
            <span className="font-medium">Value for Money:</span> {feedback.valueForMoney || "-"}
          </p>

          <div>
            <p className="font-medium mb-1">Enjoyed Most(Experience):</p>
            <p className="text-gray-600 whitespace-pre-line">{feedback.enjoyedMost || "-"}</p>
          </div>

          <div>
            <p className="font-medium mb-1">Improvements:</p>
            <p className="text-gray-600 whitespace-pre-line">{feedback.improvements || "-"}</p>
          </div>

          <p>
            <span className="font-medium">Recommend:</span>{" "}
            <span className={feedback.recommend === "Yes" ? "text-green-600" : "text-red-600"}>
              {feedback.recommend || "-"}
            </span>
          </p>

          <p className="text-xs text-gray-400 mt-4">Submitted: {new Date(feedback.createdAt).toLocaleString()}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 py-3 rounded-lg bg-black text-white text-sm hover:bg-gray-800 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
