import { View, Text, ActivityIndicator, ScrollView } from 'react-native'; // Import ScrollView
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';  // Import useDispatch and useSelector
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainLayout from '../../components/MainLayout';
import Banner from '../../components/BannerCard';
import CategorySlider from '../../components/CategorySlider';
import ProductSlider from '../../components/ProductSlicer'; // Fixed typo in import
import ShopSlider from '../../components/ShopSlider'; // Import ShopSlider component
import { fetchProductsByCity } from '../../redux/slices/productSlice'; // Import fetch action for products
import { fetchShopsByLocation } from '../../redux/slices/shopSlice'; // Import fetch action for shops
import { COLORS } from '../../../theme';
import FarmerCardSlider from '../../components/FarmerCardSlider';
import { fetchFarmersByCity } from '../../redux/slices/farmerSlice';
import { fetchNotifications } from '../../redux/slices/notificationSlice';
import { fetchCustomerById } from '../../redux/slices/customerSlice';

const HomeScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { customer } = useSelector((state) => state.customer);
  const customerId = user?._id;

  const { productByCity, status, error } = useSelector((state) => state.products);  // Select products from Redux store
  const { shops, loading: shopLoading, error: shopError } = useSelector(state => state.shop); // Select shops from Redux store

  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {

    // Fetch selected district from AsyncStorage if needed
    const getSelectedDistrict = async () => {
      const district = await AsyncStorage.getItem('selectedDistrict');
      setSelectedDistrict(district); // Update the state with selectedDistrict
    };

    getSelectedDistrict();
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchProductsByCity(selectedDistrict)); // Fetch products based on district
      dispatch(fetchShopsByLocation(selectedDistrict)); // Fetch shops based on district
      dispatch(fetchFarmersByCity(selectedDistrict));
    }
  }, [dispatch, selectedDistrict]); // Fetch when selectedDistrict changes


  useFocusEffect(
    useCallback(() => {
      dispatch(fetchNotifications());
      dispatch(fetchCustomerById(customerId));
    }, [dispatch])
  );


  return (

    <MainLayout>

      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>


        {/* Banners  */}
        <Banner />


        {/* Categories   */}
        <CategorySlider style={{ width: "100%" }} />


        {/* Products   */}
        {status === 'loading' ? (
          <ActivityIndicator size="large" color={COLORS.primaryColor} />
        ) : status === 'failed' ? (
          <Text style={{ color: 'red' }}>Error: {error}</Text>
        ) : (
          <ProductSlider title="Featured Products" products={productByCity} />
        )}


        {/* Farmers   */}
        <FarmerCardSlider style={{ marginBottom: 10 }} />


        {/* Shops   */}

        {shopLoading ? (
          <ActivityIndicator size="large" color={COLORS.primaryColor} style={{ marginTop: 20 }} />
        ) : shopError ? (
          <Text style={{ color: 'red' }}>Error: {shopError}</Text>
        ) : (
          <ShopSlider shops={shops} title="Featured Shops" />
        )}

        {/* Shops   */}

      </ScrollView>

    </MainLayout>

  );
};

export default HomeScreen;
