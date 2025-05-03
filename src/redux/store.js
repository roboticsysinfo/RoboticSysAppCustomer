import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/slices/authSlice";
import productsReducer from "../redux/slices/productSlice";
import requestOrderReducer from "../redux/slices/orderSlice";
import shopReducer from "../redux/slices/shopSlice";
import categoryReducer from "../redux/slices/categorySlice";
import notificationsReducer from "../redux/slices/notificationSlice"
import reviewReducer from "../redux/slices/reviewSlice"
import adminReducer from "../redux/slices/adminSlice";
import redeemProductsReducer from "../redux/slices/redeemProductSlice";
import rewardReducer from "../redux/slices/rewardSlice";
import familyFarmerReducer from "../redux/slices/familyFarmerSlice";
import farmersReducer from "../redux/slices/farmerSlice";
import customerReducer from "../redux/slices/customerSlice";
import searchReducer from "../redux/slices/searchSlice";
import bannersReducer from "../redux/slices/bannersSlice"
import customerHelpSupportReducer from "../redux/slices/customerHelpSupportSlice"
import AsyncStorage from "@react-native-async-storage/async-storage";

import { persistStore, persistReducer } from "redux-persist";


// 🔹 Persist Config
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ['auth'],
};


// 🔹 Wrap Reducers with PersistReducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);


const store = configureStore({

  reducer: {
    auth: persistedAuthReducer, // Auth reducer persist 
    products: productsReducer,
    requestOrder: requestOrderReducer,
    shop: shopReducer,
    categories: categoryReducer,
    notifications: notificationsReducer,
    reviews: reviewReducer,
    adminData: adminReducer,
    redeemProducts: redeemProductsReducer,
    reward: rewardReducer,
    familyfarmer: familyFarmerReducer,
    farmers: farmersReducer,
    customer: customerReducer,
    search: searchReducer,
    banners: bannersReducer,
    customerHelpSupport: customerHelpSupportReducer
  },
  
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Persist ke errors ko avoid karne ke liye
    }),
});

const persistor = persistStore(store);

export { store, persistor };
