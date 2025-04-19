// redux/slices/adminSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";

// ✅ Get All Messages (Public for app)
export const fetchAdminMessages = createAsyncThunk(
  "adminMessages/fetchAdminMessages",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/messages");
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch messages");
    }
  }
);


// Submit Help & Support Ticket
export const createHelpSupportTicket = createAsyncThunk(
  "admin/createHelpSupportTicket",
  async ({ subject, message }, thunkAPI) => {
    try {
      const res = await api.post("/help-support", { subject, message });
      return res.data.message; // success message
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to submit ticket");
    }
  }
);


const adminSlice = createSlice({
  name: "adminData",
  initialState: {
    messages: [],
    status: "idle",
    error: null,
    ticketStatus: "idle", // idle | loading | succeeded | failed
    ticketMessage: null,
  },
  reducers: {
    clearTicketMessage: (state) => {
      state.ticketMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchAdminMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

    builder
      .addCase(createHelpSupportTicket.pending, (state) => {
        state.ticketStatus = "loading";
        state.ticketMessage = null;
      })
      .addCase(createHelpSupportTicket.fulfilled, (state, action) => {
        state.ticketStatus = "succeeded";
        state.ticketMessage = action.payload;
      })
      .addCase(createHelpSupportTicket.rejected, (state, action) => {
        state.ticketStatus = "failed";
        state.ticketMessage = action.payload;
      });

  },
});

export const { clearTicketMessage } = adminSlice.actions;
export default adminSlice.reducer;
