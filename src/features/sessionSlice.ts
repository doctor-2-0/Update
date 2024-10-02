import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

// Define the state type
interface SessionState {
  session: any;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SessionState = {
  session: null,
  loading: false,
  error: null,
};

// Thunk to fetch session data
export const fetchSession = createAsyncThunk(
  "session/fetchSession",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`/auth/session`, {
        headers: { Authorization: `${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice for managing the session state
const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSession.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchSession.fulfilled, (state, action) => {
      state.session = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchSession.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default sessionSlice.reducer;
