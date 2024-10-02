import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  role: "Admin" | "Doctor" | "Patient";
  speciality?: string;
  bio?: string;
  meetingPrice?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

// Register action
export const register = createAsyncThunk(
  "auth/register",
  async (userData: Partial<User>, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/auth/register", userData); // API routes for Next.js
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

// Login action
export const login = createAsyncThunk(
  "auth/login",
  async (
    credentials: {
      email?: string;
      username?: string;
      password?: string;
      token?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      let response;
      if (credentials.token) {
        response = await axios.get("/api/auth/session", {
          headers: { Authorization: `Bearer ${credentials.token}` },
        });
      } else {
        response = await axios.post("/api/auth/login", credentials);
      }
      if (response.data.token && typeof window !== "undefined") {
        localStorage.setItem("token", response.data.token);
      }

      return {
        user: response.data.user,
        token: response.data.token,
      };
    } catch (error: any) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Logout action
export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        register.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      )
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.loading = false;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
