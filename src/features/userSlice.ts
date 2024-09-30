import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { AxiosError } from "axios";

interface UpdateStatusPayload {
  id: number;
  status: string;
}

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

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk(
  "users/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<User[]>(
        "http://localhost:5000/api/patient/getUsers"
      );
      return response.data;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

export const updateStatus = createAsyncThunk(
  "appointments/updateStatus",
  async (payload: UpdateStatusPayload, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/patient/updateStatus",
        payload
      );
      return response.data.appointment;
    } catch (err) {
      const error = err as AxiosError;
      if (error.response) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue(error.message);
      }
    }
  }
);

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        const updatedAppointment = action.payload;
        const userIndex = state.users.findIndex((user) =>
          user.PatientAppointments.some(
            (app) => app.AppointmentID === updatedAppointment.AppointmentID
          )
        );
        if (userIndex !== -1) {
          const appointmentIndex = state.users[
            userIndex
          ].PatientAppointments.findIndex(
            (app) => app.AppointmentID === updatedAppointment.AppointmentID
          );
          if (appointmentIndex !== -1) {
            state.users[userIndex].PatientAppointments[appointmentIndex] =
              updatedAppointment;
          }
        }
      });
  },
});

export default userSlice.reducer;
