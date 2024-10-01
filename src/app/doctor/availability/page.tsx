import DoctorAvailability from "@/app/components/doctorDashboard/DoctorAvailability";
import { getServerSession } from "next-auth/next";

const DoctorAvailabilityPage = async () => {
  const session = await getServerSession();
  return <DoctorAvailability session={session} />;
};

export default DoctorAvailabilityPage;
