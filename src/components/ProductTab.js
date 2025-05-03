import React from 'react';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { REACT_APP_BASE_URI } from '@env';
import { useNavigation } from '@react-navigation/native';

const ProductsTab = ({ product }) => {
  const navigation = useNavigation();

  const imageUri = product?.product_image
    ? `${REACT_APP_BASE_URI}${product.product_image}`
    : 'https://via.placeholder.com/150';

  return (
    <Pressable onPress={() => navigation.navigate('Product Detail', { productId: product._id })}>
      <View style={styles.productCard}>
        <Image
          source={{ uri: imageUri }}
          style={styles.product_image}
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
    </Pressable>
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
    justifyContent: 'center', // This should be in contentContainerStyle
    alignItems: 'center', // This should be in contentContainerStyle
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
    margin: 10
  },
  product_image: {
    height: 80,
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
