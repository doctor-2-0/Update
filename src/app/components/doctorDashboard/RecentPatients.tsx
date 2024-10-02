import React from "react";
import { useSelector } from "react-redux";
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
import { RootState } from "@/lib/store";
import { fetchUsers } from "@/features/userSlice";
import { GetServerSideProps } from "next";
import { store } from "@/lib/store";

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

const RecentPatients: React.FC<{ users: User[]; loading: boolean; error: string | null }> = ({ users, loading, error }) => {
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
              user.PatientAppointments.map((appointment) => (
                <TableRow key={appointment.AppointmentID}>
                  <TableCell component="th" scope="row">
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Avatar
                        src={`https://i.pravatar.cc/150?img=${index + 20}`}
                        sx={{ marginRight: 2 }}
                      />
                      {`${user.FirstName} ${user.LastName}`}
                    </div>
                  </TableCell>
                  <TableCell>{appointment.AppointmentID}</TableCell>
                  <TableCell>
                    {new Date(appointment.AppointmentDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{user.Gender}</TableCell>
                  <TableCell>{user.Disease}</TableCell>
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

export const getServerSideProps: GetServerSideProps = async () => {
  const dispatch = store.dispatch;
  await dispatch(fetchUsers());

  const state = store.getState();
  const { users, loading, error } = state.users;

  return {
    props: {
      users,
      loading,
      error,
    },
  };
};

export default RecentPatients;
