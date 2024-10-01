import axios from "axios";

export const fetchDoctorReviews = async (doctorId: string) => {
  try {
    const response = await axios.get(`/api/doctors/${doctorId}/reviews`);
    return response.data;
  } catch (error) {
    console.error("Error fetching doctor reviews:", error);
    throw error;
  }
};
