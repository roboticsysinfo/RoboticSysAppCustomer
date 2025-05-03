import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


// Fetch products by city
export const fetchProductsByCity = createAsyncThunk(
  "products/fetchProductsByCity",
  async (city, { rejectWithValue }) => {
    try {
      const response = await api.get(`/search/products?city=${city}`, {
        params: { city },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products by city");
    }
  }
);

// Fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page, limit, search, filter }) => {
    const response = await api.get("/products", {
      params: { page, limit, search, filter },
    });
    return response.data;
  }
);

// Fetch product by ID
export const getProductById = createAsyncThunk('products/getById', async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/product/${id}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response.data);
  }
});

// Fetch product by farmer ID
export const getProductByFarmerId = createAsyncThunk(
  "products/getByFarmerId",
  async (farmerId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/farmer-products/${farmerId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Fetch products by Category ID
export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`);
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
    }
  }
);

// get category product by location and category id

export const getProductsByCategoryLocation = createAsyncThunk(
  'products/getByCategoryLocation',
  async ({ categoryId, city }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/category/${categoryId}?city=${city}`);
      return response.data.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch products'
      );
    }
  }
);



// Slice
const productSlice = createSlice({
  name: 'products',
  initialState: {
    data: [],  // All products
    product: null,  // Selected product
    productByCity: [],  // Products by city
    categoryProducts: [],  // Category-wise products
    productByFarmer: null,
    totalPages: 0,
    currentPage: 1,
    status: "idle",
    productcategoryStatus: "idle", // Status for category products
    error: null,
    addProductStatus: "idle",
    addProductError: null,
    fetchProductByFarmerStatus: "idle",
    deleteProductStatus: "idle",
    selectedProduct: null, // Selected Product
  },
  reducers: {
    // Clear category products
    clearCategoryProducts: (state) => {
      state.categoryProducts = [];
      state.productcategoryStatus = "idle";
      state.error = null;
    },
    resetAddProductState: (state) => {
      state.addProductStatus = "idle";
      state.addProductError = null;
    },
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload; // Select product to store in modal
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products by city
      .addCase(fetchProductsByCity.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByCity.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.productByCity = action.payload;  // Update state with products by city
      })
      .addCase(fetchProductsByCity.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
        state.productByCity = [];
      })

      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload.products;  // Correctly update state
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch product by ID
      .addCase(getProductById.fulfilled, (state, action) => {
        state.product = action.payload;  // Update selected product
        state.status = 'succeeded';
      })

      // Fetch products by farmer ID
      .addCase(getProductByFarmerId.fulfilled, (state, action) => {
        state.productByFarmer = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getProductByFarmerId.rejected, (state, action) => {
        state.error = action.payload;
        state.status = 'failed';
        state.productByFarmer = [];
      })

      // Fetch products by category
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.productcategoryStatus = "loading";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.productcategoryStatus = "succeeded";
        state.categoryProducts = action.payload; // Update category products
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.productcategoryStatus = "failed";
        state.error = action.payload;
      })

      .addCase(getProductsByCategoryLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductsByCategoryLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.categoryProducts = action.payload;
      })
      .addCase(getProductsByCategoryLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

  },
});

export const { clearCategoryProducts, resetAddProductState, setSelectedProduct } = productSlice.actions;

export default productSlice.reducer;
