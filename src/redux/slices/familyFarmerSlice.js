import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// 🚀 Send a family request
export const sendFamilyRequest = createAsyncThunk(
  'family/sendRequest',
  async ({ fromCustomer, toFarmer }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/family-farmer-request/send', { fromCustomer, toFarmer });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 📥 Get requests for a specific farmer
export const getRequestsForFarmer = createAsyncThunk(
  'family/getRequestsForFarmer',
  async (farmerId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/family-farmer-requests/${farmerId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🧑‍🌾 Get requests for a specific customer
export const getRequestsForCustomer = createAsyncThunk(
  'family/getRequestsForCustomer',
  async (customerId, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/customer/family-farmer-requests/${customerId}`);
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// ✅ Accept or reject request
export const updateRequestStatus = createAsyncThunk(
  'family/updateRequestStatus',
  async ({ requestId, status }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/family-farmer-request/status/${requestId}`, { status });
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

//  Cancel a sent request (remove by fromCustomer & toFarmer)
export const cancelFamilyRequest = createAsyncThunk(
  'family/cancelRequest',
  async ({ fromCustomer, toFarmer }, { rejectWithValue }) => {

    try {

      const { data } = await api.delete('/family-request/remove', {
        data: { fromCustomer, toFarmer },
      });
      return { message: data.message, fromCustomer, toFarmer };
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// 🌾 Admin: get all requests
export const getAllFamilyRequests = createAsyncThunk(
  'family/getAllRequests',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/family-farmer-requests/all');
      return data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const familyFarmerSlice = createSlice({
  name: 'familyfarmer',
  initialState: {
    requests: [],
    allRequests: [],
    customerRequests: [],
    loading: false,
    error: null,
    message: null,
  },
  reducers: {
    clearFamilyMessages: (state) => {
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // Send request
      .addCase(sendFamilyRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(sendFamilyRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(sendFamilyRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Get farmer requests
      .addCase(getRequestsForFarmer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRequestsForFarmer.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })
      .addCase(getRequestsForFarmer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Get customer requests
      .addCase(getRequestsForCustomer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getRequestsForCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customerRequests = action.payload;
      })
      .addCase(getRequestsForCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Cancel request
      .addCase(cancelFamilyRequest.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelFamilyRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;

        // Remove from customerRequests based on fromCustomer and toFarmer
        state.customerRequests = state.customerRequests.filter(
          (req) =>
            !(
              req.fromCustomer._id === action.payload.fromCustomer &&
              req.toFarmer._id === action.payload.toFarmer
            )
        );
      })
      .addCase(cancelFamilyRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Update request status
      .addCase(updateRequestStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
      })
      .addCase(updateRequestStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      })

      // Admin: Get all
      .addCase(getAllFamilyRequests.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllFamilyRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.allRequests = action.payload;
      })
      .addCase(getAllFamilyRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message;
      });
  },
});

export const { clearFamilyMessages } = familyFarmerSlice.actions;
export default familyFarmerSlice.reducer;
