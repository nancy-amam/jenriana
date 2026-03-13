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
      <div className="w-full overflow-hidden rounded-xl border border-black/10 bg-white mt-4 h-[280px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin" />
          <p className="text-sm text-slate-500">Loading feedback...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="hidden md:block w-full overflow-hidden rounded-xl border border-black/10 bg-white mt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-gray-200">
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Name
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Contact
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Booking
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Cleanliness
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Amenities
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Service
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Recommend
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Publish
                </th>
                <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {feedbacks.map((fb: any) => (
                <tr key={fb._id} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-5 py-4">
                    <button
                      onClick={() => setSelected(fb)}
                      className="text-sm font-medium text-slate-900 hover:text-blue-600 underline-offset-2 hover:underline text-left"
                    >
                      {fb.name}
                    </button>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600 truncate max-w-[140px]">{fb.contact}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{fb.bookingProcess || "—"}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{fb.cleanliness || "—"}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{fb.amenitiesComfort || "—"}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{fb.customerService || "—"}</td>
                  <td className="px-5 py-4">
                    {fb.recommend === "Yes" ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                        No
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    {fb.publish ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                        Hidden
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => togglePublish(fb._id, fb.publish)}
                      disabled={updatingId === fb._id}
                      className="text-sm font-medium text-blue-600 hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {updatingId === fb._id ? "Updating…" : fb.publish ? "Unpublish" : "Publish"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden mt-4 space-y-4">
        {feedbacks.map((fb: any) => (
          <div
            key={fb._id}
            onClick={() => setSelected(fb)}
            className="bg-white rounded-xl border border-black/10 p-4 space-y-3 cursor-pointer active:bg-slate-50/50 transition"
          >
            <div className="flex justify-between items-start">
              <p className="font-medium text-slate-900">{fb.name}</p>
              <div className="flex gap-2">
                {fb.recommend === "Yes" ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Yes</span>
                ) : (
                  <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">No</span>
                )}
                {fb.publish ? (
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Published</span>
                ) : (
                  <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">Hidden</span>
                )}
              </div>
            </div>
            <p className="text-sm text-slate-600 truncate">{fb.contact}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">{fb.bookingProcess || "—"} / {fb.cleanliness || "—"}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePublish(fb._id, fb.publish);
                }}
                disabled={updatingId === fb._id}
                className="text-xs font-medium text-blue-600"
              >
                {updatingId === fb._id ? "Updating…" : fb.publish ? "Unpublish" : "Publish"}
              </button>
            </div>
          </div>
        ))}
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
