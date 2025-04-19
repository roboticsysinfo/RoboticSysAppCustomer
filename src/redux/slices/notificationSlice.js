import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


//  Fetch Notifications API Call
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/notifications');

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch notifications");
    }
  }
);


//  Mark Notification as Read API Call
export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (notificationId, { rejectWithValue }) => {
    try {

      const response = await api.put(`/notification/read/${notificationId}`);

      return notificationId;
    } catch (error) {
      console.log("❌ Error marking as read:", error);
      return rejectWithValue(error.response?.data || "Failed to mark as read");
    }
  }
);



const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    items: [],
    loading: false,
    error: null,
    unreadCount: 0, // ✅ Add unread count
  },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
      if (!action.payload.read) {
        state.unreadCount += 1;
      }
    },
    clearNotifications: (state) => {
      state.items = [];
      state.unreadCount = 0; // ✅ Reset count
    },
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;

        // ✅ Update unread count
        state.unreadCount = action.payload.filter(n => !n.read).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // 🔹 Mark as Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.items = state.items.map((notif) =>
          notif._id === action.payload ? { ...notif, read: true } : notif
        );

        // ✅ Decrease unread count
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      });
  },
});

export const { addNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
