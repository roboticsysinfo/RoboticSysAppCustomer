import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import Toast from 'react-native-toast-message';


// Thunks Fetch All Products for Redeem
export const fetchRedeemProducts = createAsyncThunk(
  'redeemProducts/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/redeem-products');
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


// Thunk to Redeem a Product
export const redeemProduct = createAsyncThunk(
  'redeemProducts/redeem',
  async ({ farmerId, redeemProductId }, thunkAPI) => {
    try {
      const res = await api.post('/redeem-product', { farmerId, redeemProductId });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);


//Daily 5 points Reward
export const rewardDailyPoints = createAsyncThunk(
  "farmer/rewardDailyPoints",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.post("/farmer/reward-daily");

      // ✅ Show Toast on success
      Toast.show({
        type: 'success',
        text1: '+5 Points Earned 🎉',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);


const redeemProductSlice = createSlice({
  name: 'redeemProducts',
  initialState: {
    rProducts: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearRedeemMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchRedeemProducts.pending, state => {
        state.loading = true;
      })
      .addCase(fetchRedeemProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.rProducts = action.payload;
      })
      .addCase(fetchRedeemProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Redeem product states
      .addCase(redeemProduct.pending, state => {
        state.loading = true;
      })
      .addCase(redeemProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(redeemProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload.message || 'Something went wrong';
      })

      //Daily 5 points Reward
      .addCase(rewardDailyPoints.pending, (state) => {
        state.rewardLoading = true;
        state.rewardError = null;
      })
      .addCase(rewardDailyPoints.fulfilled, (state, action) => {
        state.rewardLoading = false;
        state.points = action.payload.updatedPoints; // assuming backend returns updatedPoints
        Toast.show({
          type: "success",
          text1: "🎉 You've earned 5 points!",
          text2: "Thanks for staying active!",
        });
      })
      .addCase(rewardDailyPoints.rejected, (state, action) => {
        state.rewardLoading = false;
        state.rewardError = action.payload?.message || "Something went wrong";
        Toast.show({
          type: "error",
          text1: "Reward Failed",
          text2: action.payload?.message || "Try again later.",
        });
      });

  }
});



export default redeemProductSlice.reducer;
