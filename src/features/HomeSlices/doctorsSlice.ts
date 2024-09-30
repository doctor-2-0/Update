import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  speciality: string;
  bio: string;
  imageUrl: string;
  locationLatitude: number;
  locationLongitude: number;
  email: any;
}

interface DoctorsState {
  allDoctors: Doctor[];
  searchedDoctors: Doctor[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: DoctorsState = {
  allDoctors: [],
  searchedDoctors: [],
  status: "idle",
  error: null,
};

export const fetchDoctors = createAsyncThunk(
  "doctors/fetchDoctors",
  async () => {
    const response = await axios.get("/doctors");
    return response.data;
  }
);

export const searchDoctors = createAsyncThunk(
  "doctors/searchDoctors",
  async (
    searchParams: {
      name: string;
      speciality: string;
      available: boolean;
      nearMe: boolean;
      perimeter: number | null;
      latitude?: number;
      longitude?: number;
      coords: { LocationLatitude: number; LocationLongitude: number };
      Email: any;
    },
    { rejectWithValue }
  ) => {
    try {
      const token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
      if (!token) {
        return rejectWithValue("No authentication token found");
      }
      const response = await axios.post(
        "/doctors/searchDoctors",
        searchParams,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data);
      }
      return rejectWithValue("An unexpected error occurred");
    }
  }
);

const doctorsSlice = createSlice({
  name: "doctors",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allDoctors = action.payload;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to fetch doctors";
      })
      .addCase(searchDoctors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(searchDoctors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.searchedDoctors = action.payload;
      })
      .addCase(searchDoctors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message || "Failed to search doctors";
      });
  },
});

export default doctorsSlice.reducer;
