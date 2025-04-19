import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import Toast from 'react-native-toast-message';


// 🔄 Thunk to increment referral share & get updated points
export const incrementReferralShare = createAsyncThunk(
  'reward/incrementReferralShare',
  async (farmerId, { rejectWithValue }) => {
    try {
      const res = await api.post('/farmer/referral-share', { farmerId });

      // ✅ Show Toast on success
      Toast.show({
        type: 'success',
        text1: 'You Earned 5+ points for share 🎉',
        position: 'top',
        visibilityTime: 3000,
        autoHide: true,
        topOffset: 50,
      });

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data.message || 'Something went wrong');
    }
  }
);


// 🔄 Thunk to fetch point transactions by farmerId
export const fetchPointTransactions = createAsyncThunk(
  "pointTransactions/fetch",
  async (farmerId, { rejectWithValue }) => {
    try {
      const res = await api.get(`/farmer/points-transaction/${farmerId}`);

      console.log("points transaction history", res.data)

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const rewardSlice = createSlice({
  name: 'reward',
  initialState: {
    points: 0,
    pointsTransactions: [],
    loading: false,
    error: null,
    message: null
  },
  reducers: {
    clearRewardMessage: (state) => {
      state.message = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(incrementReferralShare.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(incrementReferralShare.fulfilled, (state, action) => {
        state.loading = false;
        state.points = action.payload.points;
        state.message = action.payload.message;
      })
      .addCase(incrementReferralShare.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchPointTransactions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPointTransactions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pointsTransactions = action.payload;
      })
      .addCase(fetchPointTransactions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload?.message || "Something went wrong";
      });

  }
});

export const { clearRewardMessage } = rewardSlice.actions;
export default rewardSlice.reducer;
