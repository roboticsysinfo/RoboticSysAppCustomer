import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, TextInput, View } from 'react-native';
import ProductCard from '../../components/ProductCard';
import MainLayout from '../../components/MainLayout';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductsByCity } from '../../redux/slices/productSlice';
import { COLORS } from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductsScreen = () => {
  const dispatch = useDispatch();
  const { productByCity, status } = useSelector((state) => state.products);
  const [selectedDistrict, setSelectedDistrict] = useState(null);  // State to store selected city

  useEffect(() => {
    // Fetch selectedDistrict from AsyncStorage
    const getSelectedDistrict = async () => {
      const district = await AsyncStorage.getItem('selectedDistrict');
      setSelectedDistrict(district); // Update the state with selectedDistrict

    };

    getSelectedDistrict();
  }, []);


  useEffect(() => {
    if (selectedDistrict) {
      dispatch(fetchProductsByCity(selectedDistrict)); // Fetch products by city when selectedDistrict is available
    }
  }, [dispatch, selectedDistrict]);


  return (
    <MainLayout>
      <ScrollView contentContainerStyle={{ padding: 16, flexDirection: 'row', flexWrap: 'wrap' }}>
        {status === 'loading' ? (
          <ActivityIndicator size={'large'} color={COLORS.primaryColor} style={{ margin: "auto", marginTop: 40 }} />
        ) : (
          productByCity.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))
        )}
      </ScrollView>
    </MainLayout>
  );
};

export default ProductsScreen;
