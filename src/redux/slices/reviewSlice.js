import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// ✅ 1. Get All Reviews for a Shop
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (shopId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/review/${shopId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch reviews");
    }
  }
);


// ✅ 2. Delete Review
export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {

      const response = await api.delete(`/delete_review/${reviewId}`);

      return { id: reviewId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete review");
    }
  }
);


// ✅ Fetch Reviews by Customer ID
export const fetchReviewsByCustomerId = createAsyncThunk(
  "reviews/fetchReviewsByCustomerId",
  async (customerId, { rejectWithValue }) => {
    try {

      const response = await api.get(`/reviews/${customerId}`);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Error fetching customer reviews");
    }
  }
);


const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    reviews: [],
    averageRating: 0,
    loading: false,
    error: null,
  },
  reducers: {
    resetReviews: (state) => {
      state.reviews = [];
      state.averageRating = 0;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Fetch Reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.reviews;
        state.averageRating = action.payload.averageRating;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Review
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.reviews = state.reviews.filter((rev) => rev._id !== action.payload.id);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ✅ Fetch Reviews by Customer ID
      .addCase(fetchReviewsByCustomerId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchReviewsByCustomerId.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchReviewsByCustomerId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

  },
});

export const { resetReviews } = reviewSlice.actions;

export default reviewSlice.reducer;
