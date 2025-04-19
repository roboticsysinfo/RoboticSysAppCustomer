import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// Fetch all shops with pagination
export const fetchShops = createAsyncThunk(
  'shop/fetchShops',
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await api.get("/farmer-shops", { params: { page, limit } });
      return response.data.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


// Get shop by farmer ID
export const fetchShopById = createAsyncThunk(
  'shop/fetchShopById',
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/farmer-shop/${farmerId}`);
      if (!response.data || !response.data.data) {
        return rejectWithValue("Shop not found");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

// Get shop by shop ID
export const fetchShopByShopId = createAsyncThunk(
  'shop/fetchShopByShopId',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/shop/${id}`);
      return response.data.shop;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);


export const fetchProductsByShopId = createAsyncThunk(
  "shop/fetchProductsByShopId",
  async (shopId, { rejectWithValue }) => {
    try {


      const response = await api.get(`/shop-products/${shopId}`);
      

      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      return rejectWithValue(error.response?.data?.message || "Something went wrong");
    }
  }
);


// Fetch Shop by Location
export const fetchShopsByLocation = createAsyncThunk(
  "shop/fetchShopsByLocation",
  async (city_district, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/shop-by-location?city_district=${city_district}`
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch shops"
      );
    }
  }
);


const shopSlice = createSlice({
  name: 'shop',
  initialState: {
    shops: [],
    shop: null,            // for farmer-profile-specific shop
    selectedShop: null,    // ✅ used for shop detail screen
    products: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearSelectedShop: (state) => {
      state.selectedShop = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all shops
      .addCase(fetchShops.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shops = action.payload;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // fetch shop by farmer ID
      .addCase(fetchShopById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShopById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.shop = action.payload?.data || null;
      })
      .addCase(fetchShopById.rejected, (state, action) => {
        state.status = 'failed';
        state.shop = null;
        state.error = action.payload;
      })

      // fetch shop by shop ID
      .addCase(fetchShopByShopId.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchShopByShopId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedShop = action.payload;
      })
      .addCase(fetchShopByShopId.rejected, (state, action) => {
        state.status = 'failed';
        state.selectedShop = null;
        state.error = action.payload;
      })

      // Fetch products by shop ID
      .addCase(fetchProductsByShopId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByShopId.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload; // ✅ Store products in state
      })
      .addCase(fetchProductsByShopId.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });

      builder
      .addCase(fetchShopsByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShopsByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.shops = action.payload.shops || []; // Ensure shops is an array
        state.error = null;
      })
      .addCase(fetchShopsByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // Store the error message
      });

      

  },
});

export const { clearSelectedShop } = shopSlice.actions;
export default shopSlice.reducer;
