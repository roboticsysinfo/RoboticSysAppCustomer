import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Image, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { REACT_APP_BASE_URI } from '@env';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { fetchProductsByShopId } from '../redux/slices/shopSlice';

const ProductsTab = ({ shopId }) => {
  const dispatch = useDispatch();

  const { products, status, error } = useSelector((state) => state.shop);

  useEffect(() => {
    if (shopId) {
      dispatch(fetchProductsByShopId(shopId));
    }
  }, [dispatch, shopId]);

  if (status === 'loading') {
    return (
      <View style={styles.emptyContainer}>
        <ActivityIndicator size="large" color="green" />
        <Text>Loading products...</Text>
      </View>
    );
  }

  if (status === 'failed') {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ color: 'red' }}>Error loading products: {error || 'Unknown error'}</Text>
      </View>
    );
  }

  if (!products || !Array.isArray(products) || products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text>No products available.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={styles.productsGrid}>
        {products.map((product, i) => {
          const imageUri = product?.product_image
            ? `${REACT_APP_BASE_URI}/${product.product_image}`
            : 'https://via.placeholder.com/150';

          return (
            <View key={product._id || i} style={styles.productCard}>
              <Image
                source={{ uri: imageUri }}
                style={styles.product_image}
                onError={() => console.log('Image load failed:', imageUri)}
              />
              <Text style={styles.product_title}>{product.name || 'No name'}</Text>
              <Text style={styles.product_price}>
                ₹ {product.price_per_unit || 'N/A'} / {product.unit || 'unit'}
              </Text>
              {product.harvest_date && (
                <Text style={styles.harvest_date}>
                  <Icon name="calendar" size={16} /> {product.harvest_date.slice(0, 10)}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default ProductsTab;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    padding: 10,
  },
  productCard: {
    width: 150,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  product_image: {
    height: 120,
    width: '100%',
    borderRadius: 8,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  product_title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  product_price: {
    fontSize: 14,
    marginTop: 4,
  },
  harvest_date: {
    marginTop: 4,
    fontSize: 12,
    color: 'gray',
  },
});
