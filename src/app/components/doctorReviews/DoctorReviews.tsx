import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchDoctorReviews } from "../../api/reviews/route";

function DoctorReviews() {
  const router = useRouter();
  const { doctorId } = router.query;
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadReviews = async () => {
      if (!doctorId) return;

      try {
        setLoading(true);
        const fetchedReviews = await fetchDoctorReviews(doctorId as string);
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
          {reviews.map(
            (review: { id: string; rating: number; comment: string }) => (
              <li key={review.id}>
                <p>Rating: {review.rating}/5</p>
                <p>{review.comment}</p>
                {/* <p>Date: {new Date(review.date).toLocaleDateString()}</p> */}
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

export default DoctorReviews;
