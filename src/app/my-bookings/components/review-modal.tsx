import React, { useState } from "react";
import Image from "next/image";
import { StarIcon } from "lucide-react";

interface Review {
  rating: number;
  comment: string;
  userImage: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostReview: (apartmentId: string, rating: number, comment: string) => Promise<void>;
  apartmentId: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ isOpen, onClose, onPostReview, apartmentId }) => {
  const [rating, setRating] = useState(4);
  const [comment, setComment] = useState("");
  const [postedReview, setPostedReview] = useState<Review | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handlePostReview = async () => {
    setIsSubmitting(true);
    try {
      await onPostReview(apartmentId, rating, comment);
      setPostedReview({
        rating,
        comment,
        userImage: "/images/user.png",
      });
    } catch (error) {
      console.error("Failed to post review:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(4);
    setComment("");
    setPostedReview(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[20px] p-6 w-[500px] max-h-[600px] flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-normal text-[#111827]">Rating</h2>
          <button onClick={handleClose} className="text-[#4b5566] hover:text-black text-xl">
            ✕
          </button>
        </div>

        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <StarIcon
              key={star}
              className={`w-4 h-4 cursor-pointer ${star <= rating ? "text-shadow-yellow-500" : "text-gray-300"}`}
              fill={star <= rating ? "#FFD700" : "none"}
              onClick={() => setRating(star)}
            />
          ))}
        </div>

        <div className="text-sm font-normal text-[#111827]">Your Review</div>

        <textarea
          placeholder="Share your experience"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full h-[120px] p-3 border border-gray-300 rounded-lg text-black focus:outline-none focus:ring-2 focus:ring-black resize-none"
          disabled={isSubmitting}
        />

        <button
          onClick={handlePostReview}
          disabled={isSubmitting}
          className="w-[150px] h-[50px] rounded-lg bg-black text-white px-4 py-3 text-base font-normal hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Posting..." : "Post Review"}
        </button>

        {postedReview && (
          <div className="flex items-start gap-3 mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="relative w-10 h-10">
              <Image src="/images/user.png" alt="User" fill className="rounded-full object-cover" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-[#111827]">Your Review</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-4 h-4 ${star <= postedReview.rating ? "text-[#FFD700]" : "text-gray-300"}`}
                      fill={star <= postedReview.rating ? "#FFD700" : "none"}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-[#374151]">{postedReview.comment}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewModal;
