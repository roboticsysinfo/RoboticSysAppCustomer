import React from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ProductCard from './ProductCard';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const ProductSlider = ({ title = "Featured Products" }) => {
  const navigation = useNavigation();
  const { productByCity, status } = useSelector((state) => state.products);

  const handleViewAll = () => {
    navigation.navigate("Products"); // Navigate to the Products screen (change route if needed)
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.heading}>{title}</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text style={styles.viewAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {/* Ensure that 'productByCity' exists and is an array */}
      {productByCity && productByCity.length > 0 ? (
        <FlatList
          data={productByCity}
          keyExtractor={(item) => item._id.toString()} // Ensure toString() for non-string keys
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <ProductCard product={item} />}
        />
      ) : (
        <Text style={{ textAlign: 'center', marginTop: 20, color: 'gray' }}>No products available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
    paddingHorizontal: 8
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginBottom: 8,
    alignItems: 'center',
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAllText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3CB043', // Adjust according to your theme
  },
  list: {
    paddingHorizontal: 10,
  },
});

export default ProductSlider;
