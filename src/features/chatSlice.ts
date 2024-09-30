import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "@/lib/axios";

// Define a generic type for IDs
type ID = string | number;

interface Message {
  id: ID;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatRoom {
  id: ID;
  name: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  rooms: [],
  currentRoom: null,
  loading: false,
  error: null,
};

export const fetchRooms = createAsyncThunk("chat/fetchRooms", async () => {
  const response = await axios.get("/api/chats");
  return response.data;
});

export const fetchRoomMessages = createAsyncThunk(
  "chat/fetchRoomMessages",
  async (roomId: ID) => {
    const response = await axios.get(`/api/chats/${roomId}/messages`);
    return response.data;
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ roomId, content }: { roomId: ID; content: string }) => {
    const response = await axios.post(`/api/chats/${roomId}/messages`, {
      content,
    });
    return response.data;
  }
);

export const createRoom = createAsyncThunk(
  "chat/createRoom",
  async (name: string) => {
    const response = await axios.post("/api/chats", { name });
    return response.data;
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setCurrentRoom: (state, action: PayloadAction<ID>) => {
      state.currentRoom =
        state.rooms.find((room) => room.id === action.payload) || null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRooms.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRooms.fulfilled, (state, action) => {
        state.loading = false;
        state.rooms = action.payload;
      })
      .addCase(fetchRooms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch rooms";
      })
      .addCase(fetchRoomMessages.fulfilled, (state, action) => {
        if (state.currentRoom) {
          state.currentRoom.messages = action.payload;
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        if (state.currentRoom) {
          state.currentRoom.messages.push(action.payload);
        }
      })
      .addCase(createRoom.fulfilled, (state, action) => {
        state.rooms.push(action.payload);
      });
  },
});

export const { setCurrentRoom } = chatSlice.actions;
export default chatSlice.reducer;
