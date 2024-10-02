import { RootState } from "@/lib/store";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const DoctorDetails = () => {
  const router = useRouter();
  const { UserID } = router.query;

  const doctor = useSelector((state: RootState) =>
    state.selectedDoctor.UserID === Number(UserID) ? state.selectedDoctor : null
  );

  if (!doctor) return <div>Loading...</div>;

  return (
    <div>
      <h1>
        {doctor.FirstName} {doctor.LastName}
      </h1>
      <p>Speciality: {doctor.Speciality}</p>
      <p>Bio: {doctor.Bio}</p>
    </div>
  );
};

export default DoctorDetails;
