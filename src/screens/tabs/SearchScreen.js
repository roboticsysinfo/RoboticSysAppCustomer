// SearchScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchResults } from '../../redux/slices/searchSlice';
import MainLayout from '../../components/MainLayout';
import { COLORS } from '../../../theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { query, filter, city } = route.params;

  const dispatch = useDispatch();
  const { results, loading, error } = useSelector(state => state.search);

  useEffect(() => {
    console.log("🔍 Search Params =>", { query, filter, city });
    dispatch(fetchSearchResults({ query, filter, city }));
  }, [query, filter, city, dispatch]);



  const handleNavigation = (item) => {

    if (item.name || item.product_image) {
      // Product ke liye
      navigation.navigate("Product Detail", { productId: item._id });
    } else if (item.shop_name || item.shop_profile_image) {
      // Shop ke liye
      navigation.navigate("Shop Details", { shopId: item._id });
    } else if (item.name && item.profileImg) {
      // Farmer ke liye (name aur profileImg dono honge)
      navigation.navigate("FarmerDetails", { farmerId: item._id });
    } else {
      return null
    }
  };


  // 🔁 Image picker with fallback
  const getImageSource = (item) => {
    let image = "https://placehold.jp/150x150.png";
    if (item.shop_profile_image) image = item.shop_profile_image;
    else if (item.product_image) image = item.product_image;
    else if (item.profileImg) image = item.profileImg;

    console.log("🖼️ Image for item:", image);
    return image;
  };

  // 🔁 Render search item
  const renderItem = ({ item }) => {
    console.log("👉 Rendering Search Item:", item);

    return (
      <TouchableOpacity onPress={() => handleNavigation(item)}>
        <View style={styles.item}>
          {/* Left: Image */}
          <Image
            source={{ uri: getImageSource(item) }}
            style={styles.itemImage}
          />
          {/* Right: Bold text */}
          <Text style={styles.itemTextBold}>
            {item.name || item.shop_name || item.product_name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <MainLayout>
      <View style={styles.container}>
        {loading && <ActivityIndicator size={'large'} color={COLORS.primaryColor} style={{ marginTop: 50 }} />}
        {error && <Text>Error: {error}</Text>}

        <FlatList
          data={results}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      </View>

      <TouchableOpacity
        style={styles.backToHome}
        onPress={() => navigation.navigate("Main")}
      >
        <Text style={styles.backToHomeText}><Icon name="home" size={20} /> Back to Home</Text>
      </TouchableOpacity>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    alignItems: "center"
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#efefef',
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
    elevation: 1
  },
  itemImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "#eee"
  },
  itemTextBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  backToHome: {
    backgroundColor: COLORS.primaryColor,
    marginBottom: 30,
    padding: 15,
    width: 200,
    borderRadius: 16,
    alignSelf: 'center',
  },
  backToHomeText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});

export default SearchScreen;
