// ShopsScreen.js
import React, { useCallback, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByShopId, fetchShopByShopId, fetchShopsByLocation } from '../../redux/slices/shopSlice';
import ShopCard from '../../components/ShopCard';
import MainLayout from '../../components/MainLayout';
import { COLORS } from '../../../theme';
import noshops from "../../assets/no_notification.png";
import { useFocusEffect } from '@react-navigation/native';
import { fetchReviews } from '../../redux/slices/reviewSlice';

const ShopsScreen = () => {


  const dispatch = useDispatch();
  const { shops, loading, error } = useSelector(state => state.shop);

  const shopId = shops.length > 0 ? shops[0]._id : null;

  const getLocationAndFetchShops = useCallback(async () => {
    try {
      
      const locationData = await AsyncStorage.getItem('selectedDistrict');
      let city_district;

      try {
        const parsed = JSON.parse(locationData);
        city_district = parsed.city || parsed.district;
      } catch (jsonErr) {
        city_district = locationData;
      }

      if (city_district) {
        dispatch(fetchShopsByLocation(city_district));
      }
    } catch (err) {
      console.log("Error fetching location:", err);
    }
  }, [dispatch]);

  useEffect(() => {
    getLocationAndFetchShops();
  }, [getLocationAndFetchShops]);

  useFocusEffect(
    useCallback(() => {
      getLocationAndFetchShops();

      if (shopId) {
        dispatch(fetchShopByShopId(shopId));
        dispatch(fetchProductsByShopId(shopId));
        dispatch(fetchReviews(shopId));
      }
    }, [dispatch, shopId, getLocationAndFetchShops])
  );

  const upgradedFirstShops = [...shops].sort((a, b) => {
    if (a.isFarmerUpgraded === b.isFarmerUpgraded) return 0;
    return a.isFarmerUpgraded ? -1 : 1;
  });

  return (
    <MainLayout>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primaryColor} style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>{error}</Text>
      ) : (
        <ScrollView>
          {shops.length > 0 ? (
            upgradedFirstShops.map((shop, index) => (
              <ShopCard key={shop._id || index} shop={shop} />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Image source={noshops} style={styles.image} />
              <Text style={styles.emptyTitle}>No Shops Found</Text>
              <Text style={styles.emptySubtitle}>
                No shops found for this location.
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </MainLayout>
  );
};

export default ShopsScreen;

const styles = StyleSheet.create({
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: 200, height: 200, marginBottom: 16, resizeMode: "contain", marginTop: 100 },
  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },
  emptySubtitle: { fontSize: 14, color: "gray", textAlign: "center", paddingHorizontal: 40 },
});
