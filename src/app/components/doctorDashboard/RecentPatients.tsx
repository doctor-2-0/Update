import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CircularProgress,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Avatar,
} from "@mui/material";
import { RootState, AppDispatch } from "@/lib/store";
import { fetchUsers } from "@/features/userSlice";

interface User {
  UserID: number;
  FirstName: string;
  LastName: string;
  Gender: string;
  Disease: string;
  PatientAppointments: Array<{
    AppointmentID: number;
    AppointmentDate: string;
    Status: string;
  }>;
}

const RecentPatients: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Recent Patients
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Visit Id</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Disease</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, index) =>
              user.patientAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell component="th" scope="row">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=${index + 20}`}
                        sx={{ marginRight: 2 }}
                      />
                      {`${user.firstName} ${user.lastName}`}
                    </div>
                  </TableCell>
                  <TableCell>{appointment.id}</TableCell>
                  <TableCell>
                    {new Date(appointment.appointmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.disease}</TableCell>
                  <TableCell>{appointment.Status}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default RecentPatients;
