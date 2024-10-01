import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchDoctorReviews } from "../../api/reviews/route";

// Define a type for the review
type Review = {
  id: string;
  rating: number;
  comment: string;
  // Uncomment if date is available
  // date: string; 
};

function DoctorReviews() {
  const router = useRouter();
  const { id: doctorId } = router.query; // {{ edit_1 }} Use 'id' for clarity
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      const id = Array.isArray(doctorId) ? doctorId[0] : doctorId; // Ensure doctorId is a string
      if (!id) return; // Handle undefined case

      try {
        setLoading(true);
        const fetchedReviews = await fetchDoctorReviews(id);
        console.log(fetchedReviews);
        setReviews(fetchedReviews);
      } catch (err) {
        setError((err as Error).message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    loadReviews();
  }, [doctorId]);

  if (loading) return <p>Loading reviews...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="doctor-reviews">
      <h2>Patient Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((review) => (
            <li key={review.id}>
              <p>Rating: {review.rating}/5</p>
              <p>{review.comment}</p>
              {/* <p>Date: {new Date(review.date).toLocaleDateString()}</p> */} {/* Uncomment if date is available */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DoctorReviews;