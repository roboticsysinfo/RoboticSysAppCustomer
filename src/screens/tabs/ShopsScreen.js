import React, { useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShopsByLocation } from '../../redux/slices/shopSlice';
import ShopCard from '../../components/ShopCard';
import MainLayout from '../../components/MainLayout';
import { COLORS } from '../../../theme';
import noshops from "../../assets/no_notification.png";

const ShopsScreen = () => {
  const dispatch = useDispatch();
  const { shops, loading, error } = useSelector(state => state.shop);

  useEffect(() => {
    const getLocationAndFetchShops = async () => {
      try {
        const locationData = await AsyncStorage.getItem('selectedDistrict');

        let city_district;

        // Try parsing as JSON (in case kabhi object ke form mein store ho)
        try {
          const parsed = JSON.parse(locationData);
          city_district = parsed.city || parsed.district;
        } catch (jsonErr) {
          // If not JSON, assume it's plain string
          city_district = locationData;
        }


        if (city_district) {
          dispatch(fetchShopsByLocation(city_district));
        }
      } catch (err) {
        console.log("Error fetching location:", err);
      }
    };

    getLocationAndFetchShops();
  }, [dispatch]);

  return (
    <MainLayout>
      {loading ? (
        <ActivityIndicator size="large" color={COLORS.primaryColor} style={{ marginTop: 50 }} />
      ) : error ? (
        <Text style={{ textAlign: 'center', color: 'red', marginTop: 20 }}>{error}</Text>
      ) : (
        <ScrollView>
          {shops.length > 0 ? (
            shops.map((shop, index) => (
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

  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: 200, height: 200, marginBottom: 16, resizeMode: "contain", marginTop: 100 },

  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },

  emptySubtitle: { fontSize: 14, color: "gray", textAlign: "center", paddingHorizontal: 40 },


  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },


  // Description (Message) Styling
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    width: 200,
    lineHeight: 20
  },

  // Time Styling
  time: {
    fontSize: 12,
    color: "gray"
  },


});
