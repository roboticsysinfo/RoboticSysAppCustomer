import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../screens/SplashScreen';
import PNLoginScreen from '../screens/PNLoginScreen';
import TabNavigator from './TabNavigator';
import OTPScreen from '../screens/OTPScreen';
import ProductsScreen from '../screens/tabs/ProductsScreen';
import ProductDetailsScreen from '../screens/ProductDetailsScreen';
import SelectLocationScreen from '../screens/SelectLocationScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CategoryProductsScreen from '../screens/CategoryProductsScreen';
import NotificationsScreen from '../screens/tabs/NotificationsScreen';
import ShopDetailsScreen from '../screens/ShopDetailsScreen';
import FarmersScreen from '../screens/FarmersScreen';
import FamilyFarmersScreen from '../screens/FamilyFarmersScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import ManageOrdersScreen from '../screens/ManageOrdersScreen';
import MyReviewsScreen from '../screens/MyReviewsScreen';
import MyDetailsScreen from '../screens/MyDetailsScreen';
import { navigationRef } from '../services/navigationService';
import SearchScreen from '../screens/tabs/SearchScreen';
import { setFarmerDetails } from '../redux/slices/authSlice';
import FarmerDetailsScreen from '../screens/FarmerDetailsScreen';
import ReferAndEarnScreen from '../screens/ReferAndEarnScreen';
import PointTransactionScreen from '../screens/PointTransactionScreen';
import RegisterScreen from '../screens/RegisterScreen';
import MyRedeemProductsScreen from '../screens/MyRedeemProductsScreen';
import RegisterOTPScreen from '../screens/RegisterOTPScreen';
import UpgradePointsScreen from '../screens/UpgradePointsScreen';
import HelpSupportScreen from '../screens/HelpSupportScreen';
import ReferralListScreen from '../screens/ReferralListScreen';


const Stack = createStackNavigator();

const AppNavigator = () => {

  return (

    <NavigationContainer ref={navigationRef}>

      <Stack.Navigator initialRouteName="SplashScreen">

        <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={PNLoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OTP" component={OTPScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="Products" component={ProductsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Product Detail" component={ProductDetailsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="SelectLocation" component={SelectLocationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Categories" component={CategoriesScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Category Products" component={CategoryProductsScreen} options={{ headerShown: true }} />
        <Stack.Screen name="Shop Details" component={ShopDetailsScreen} options={{ headerShown: true }} />

        <Stack.Screen name="Search" component={SearchScreen} options={{ headerShown: false }} />

        <Stack.Screen name="Farmers" component={FarmersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Family Farmers" component={FamilyFarmersScreen} options={{ headerShown: true }} />

        <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
        <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ManageOrders" component={ManageOrdersScreen} options={{ headerShown: false }} />

        <Stack.Screen name="MyReviews" component={MyReviewsScreen} options={{ headerShown: false }} />

        <Stack.Screen name="RedeemProducts" component={MyRedeemProductsScreen} options={{ headerShown: false }} />

        <Stack.Screen name="MyDetails" component={MyDetailsScreen} options={{ headerShown: false }} />

        <Stack.Screen name="FarmerDetails" component={FarmerDetailsScreen} options={{ headerShown: false }} />

        <Stack.Screen name="ReferandEarn" component={ReferAndEarnScreen} options={{ headerShown: false }} />

        <Stack.Screen name="Points Transactions" component={PointTransactionScreen} options={{ headerShown: true }} />

        <Stack.Screen name="RegisterOTPScreen" component={RegisterOTPScreen} options={{ headerShown: false }} />

        <Stack.Screen name="UpgradePoints" component={UpgradePointsScreen} options={{ headerShown: false }} />

        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} options={{ headerShown: false }} />

        <Stack.Screen name="ReferralList" component={ReferralListScreen} options={{ headerShown: false }} />


      </Stack.Navigator>

    </NavigationContainer>

  );

};

export default AppNavigator;