// src/redux/slices/customerSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// ✅ Fetch customer by ID
export const fetchCustomerById = createAsyncThunk(
  "customer/fetchCustomerById",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/customer/${customerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch customer");
    }
  }
);


// ✅ Update customer details
export const updateCustomer = createAsyncThunk(
  "customer/updateCustomer",
  async ({ customerId, customerData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/update-customer/${customerId}`, customerData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to update customer");
    }
  }
);


// ✅ Fetch customer redeem product history
export const fetchCustomerRedeemHistory = createAsyncThunk(
  "customer/fetchRedeemHistory",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/customer/redeem-history/${customerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch redeem history");
    }
  }
);


// fetch customer referral details
export const fetchCustomerReferralDetails = createAsyncThunk(
  "customer/fetchReferralDetails",
  async (customerId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/customer/referral-details/${customerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch referral details");
    }
  }
);



const customerslice = createSlice({
  name: "customer",
  initialState: {
    customer: null,
    referralDetails: null,
    loading: false,
    error: null,
    redeemHistory: [],
    redeemLoading: false,
    redeemError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Customer fetch
      .addCase(fetchCustomerById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerById.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload;
      })
      .addCase(fetchCustomerById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Customer update
      .addCase(updateCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.loading = false;
        state.customer = action.payload.customer;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ✅ Redeem product history
      .addCase(fetchCustomerRedeemHistory.pending, (state) => {
        state.redeemLoading = true;
        state.redeemError = null;
      })
      .addCase(fetchCustomerRedeemHistory.fulfilled, (state, action) => {
        state.redeemLoading = false;
        state.redeemHistory = action.payload;
      })
      .addCase(fetchCustomerRedeemHistory.rejected, (state, action) => {
        state.redeemLoading = false;
        state.redeemError = action.payload;
      })

      // fetch customer referral detials
      .addCase(fetchCustomerReferralDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerReferralDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.referralDetails = action.payload;
      })
      .addCase(fetchCustomerReferralDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


  },
});

export default customerslice.reducer;
