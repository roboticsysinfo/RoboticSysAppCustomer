import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// Create a request order
export const createRequestOrder = createAsyncThunk(
  "requestOrder/createRequestOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post("/request-order", orderData, {
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Server error");
    }
  }
);


// Cancel Order Request
export const cancelOrderRequest = createAsyncThunk(
  "requestOrder/cancelOrderRequest",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.put(`/cancel/${orderId}`, {}, {
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to cancel order");
    }
  }
);


// Customer orders fetch 
export const fetchCustomerOrders = createAsyncThunk(
  "orders/fetchCustomerOrders",
  async (_, { rejectWithValue }) => {
    try {

      const response = await api.get("/my-orders", {
      });


      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch orders");
    }
  }
);


// Fetch Single Customer Order by Order ID
export const fetchCustomerOrderById = createAsyncThunk(
  "orders/fetchCustomerOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/customer/order/${orderId}`);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch order details");
    }
  }
);



// --------------------------------------------------------

const orderSlice = createSlice({
  name: "requestOrder",
  initialState: {
    requests: [],
    loading: false,
    error: null,
    successMessage: null,
    customerOrderDetail: null,

  },
  reducers: {
    clearMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createRequestOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRequestOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.requests.push(action.payload.request);
        state.successMessage = action.payload.message;
      })
      .addCase(createRequestOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Order Request
      .addCase(cancelOrderRequest.fulfilled, (state, action) => {
        state.requests = state.requests.map((order) =>
          order._id === action.payload.requestOrder._id ? { ...order, status: "cancelled" } : order
        );
        state.successMessage = action.payload.message;
      })
      .addCase(cancelOrderRequest.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ======= Fetch Customer Order =====
      .addCase(fetchCustomerOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.customerOrders = action.payload;
      })
      .addCase(fetchCustomerOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Single Order by ID
      .addCase(fetchCustomerOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomerOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.customerOrderDetail = action.payload;
      })
      .addCase(fetchCustomerOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


  },
});

export const { clearMessages } = orderSlice.actions;
export default orderSlice.reducer;
