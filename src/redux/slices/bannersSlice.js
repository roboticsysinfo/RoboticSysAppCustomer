import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api"; // Make sure api is correctly set up

// Fetch banners data
export const fetchBanners = createAsyncThunk("banners/fetchBanners", async () => {
  const response = await api.get("/site-details/banners");  // Your API endpoint
  return response.data; // Ensure that the response is the expected data format
});

const bannersSlice = createSlice({
  name: "banners",
  initialState: {
    banners: [],  // Start with an empty array for banners
    status: "idle", // Initial loading state
    error: null, // Error state
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchBanners.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchBanners.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.banners = action.payload;  // Populate the banners state with fetched data
      })
      .addCase(fetchBanners.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;  // Store error message if the request fails
      });
  },
});

export default bannersSlice.reducer;
