import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Dimensions, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBanners } from '../redux/slices/bannersSlice';
import { COLORS } from '../../theme';
import Carousel from 'react-native-reanimated-carousel';
import { REACT_APP_BASE_URI_SEC } from "@env"
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');


const BannerCard = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  // Fetching banners data from Redux store
  const { banners, status, error } = useSelector((state) => state.banners);

  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);


  // Check if banners are valid
  const isValidBanners = Array.isArray(banners) && banners.length > 0;

  return (
    <View style={styles.container}>
      {status === 'loading' && <ActivityIndicator size="large" color={COLORS.primaryColor} />}
      {status === 'failed' && <Text style={{ color: 'red' }}>{error}</Text>}

      {/* Display banners if available */}
      {status === 'succeeded' && isValidBanners && (
        <Carousel
          loop
          width={screenWidth} // You can adjust this based on your design
          height={200} // Adjust the height for banners
          data={banners}
          scrollAnimationDuration={5000}
          autoPlay={true}
          renderItem={({ item }) => (
            <View style={styles.bannerContainer}>
              <View style={styles.textSection}>
                <Text style={styles.bannerText}>{item.title}</Text>
                <Button
                  mode="contained"
                  style={styles.button}
                  onPress={() => navigation.navigate("Category Products", { categoryId: item.category })}
                >Shop Now</Button>
              </View>
              <View style={styles.imageSection}>
                <Image source={{ uri: `${REACT_APP_BASE_URI_SEC}/${item.banner_image}` }} style={styles.bannerImage} />
              </View>
            </View>
          )}
        />
      )}

      {/* Display a message if no banners */}
      {status === 'succeeded' && !isValidBanners && (
        <Text style={{ textAlign: 'center', color: 'gray' }}>No banners available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginTop: 15
  },
  bannerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#84BA87', // Light version of dark green
    padding: 15,
    borderRadius: 10,
    margin: 10,
    marginRight: 30,
    elevation: 2
  },
  textSection: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  bannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10
  },
  imageSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  bannerImage: {
    width: 160,
    height: 150,
    resizeMode: 'contain',
  },
});

export default BannerCard;
