import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../services/api";


// ✅ Create Help Support
export const createHelpSupport = createAsyncThunk(
  "helpSupport/create",
  async (formData, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/create/help-support", formData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// ✅ Get All Help Support (Admin)
export const getAllHelpSupport = createAsyncThunk(
  "helpSupport/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/get/help-support");
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// ✅ Update Help Support (Admin)
export const updateHelpSupport = createAsyncThunk(
  "helpSupport/update",
  async ({ id, updatedData }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/update/help-support/${id}`, updatedData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


// ✅ Delete Help Support (Admin)
export const deleteHelpSupport = createAsyncThunk(
  "helpSupport/delete",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await api.delete(`/delete/help-support/${id}`);
      return { message: data.message, id };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);


const customerHelpSupportSlice = createSlice({
  name: "customerHelpSupport",
  initialState: {
    supports: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearHelpSupportMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createHelpSupport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createHelpSupport.fulfilled, (state, action) => {
        state.loading = false;
        state.supports.unshift(action.payload.support);
        state.successMessage = action.payload.message;
      })
      .addCase(createHelpSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get All
      .addCase(getAllHelpSupport.pending, (state) => {
        state.loading = true;
      })
      .addCase(getAllHelpSupport.fulfilled, (state, action) => {
        state.loading = false;
        state.supports = action.payload;
      })
      .addCase(getAllHelpSupport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateHelpSupport.fulfilled, (state, action) => {
        const index = state.supports.findIndex(s => s._id === action.payload.support._id);
        if (index !== -1) state.supports[index] = action.payload.support;
        state.successMessage = action.payload.message;
      })
      .addCase(updateHelpSupport.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteHelpSupport.fulfilled, (state, action) => {
        state.supports = state.supports.filter(s => s._id !== action.payload.id);
        state.successMessage = action.payload.message;
      })
      .addCase(deleteHelpSupport.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearHelpSupportMessages } = customerHelpSupportSlice.actions;
export default customerHelpSupportSlice.reducer;
