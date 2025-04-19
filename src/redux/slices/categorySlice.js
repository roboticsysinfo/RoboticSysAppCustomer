import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// Define async thunks for API calls
export const fetchCategories = createAsyncThunk('categories/fetchCategories', async () => {
  const response = await  api.get('/categories');
  return response.data;
});


export const fetchCategoryById = createAsyncThunk('categories/fetchCategoryById', async (id) => {
  const response = await  api.get(`/category/${id}`);
  return response.data;
});


// Initial state
const initialState = {
  categories: [],
  category: null,
  status: 'idle',
  error: null,
};

// Create slice
const categorySlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.category = action.payload;
      })

  },
});

export default categorySlice.reducer;
