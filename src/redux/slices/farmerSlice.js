// redux/farmersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';


export const fetchFarmers = createAsyncThunk('farmers/fetchFarmers', async () => {
    try {
        const response = await api.get('/farmers');
        return response.data;
    } catch (error) {
        throw new Error(error.message);
    }
});


// Get Farmer by ID (Separate state for farmer details)
export const getFarmerById = createAsyncThunk(
    "auth/getFarmerById",
    async (farmerId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/farmer/get/${farmerId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch farmer" });
        }
    }
);


// Fetch farmers by city_district
export const fetchFarmersByCity = createAsyncThunk(
    'farmers/fetchFarmersByCity',
    async (city_district) => {
        const res = await api.get(`/farmers/by-city?city_district=${city_district}`);
        return res.data;
    }
);



const farmersSlice = createSlice({
    name: 'farmers',
    initialState: {
        farmers: [],
        farmerDetails: null,
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFarmers.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFarmers.fulfilled, (state, action) => {
                state.loading = false;
                state.farmers = action.payload;
            })
            .addCase(fetchFarmers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Get Farmer by ID (Separating from user)
            .addCase(getFarmerById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getFarmerById.fulfilled, (state, action) => {
                state.loading = false;
                state.farmerDetails = action.payload;
            })
            .addCase(getFarmerById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch farmer";
            })

            // 🔽 Handle fetchFarmersByCity
            .addCase(fetchFarmersByCity.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFarmersByCity.fulfilled, (state, action) => {
                state.loading = false;
                state.farmers = action.payload;
            })
            .addCase(fetchFarmersByCity.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });


    },
});

export default farmersSlice.reducer;
