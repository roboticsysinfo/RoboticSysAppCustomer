import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Text, Card, IconButton, TextInput } from 'react-native-paper';
import productImage from "../assets/sampleProduct.png";
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome";

const ProductCard = ({ product }) => {
  
  const navigation = useNavigation();

  return (
    
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.content}>
          <TouchableOpacity onPress={() => navigation.navigate('Product Detail', { productId: product._id })}>
            <Image
              source={{ uri: product.product_image }}
              style={styles.image}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text style={styles.title}>{product.name}</Text>
          <Text style={styles.subtitle}>{product.category_id?.name}</Text>

          <View style={styles.footer}>
            <Text style={styles.price}><FIcon name="rupee" size={20} /> {product.price_per_unit}</Text>
            <IconButton
              icon="arrow-right"
              size={20}
              iconColor="#fff"
              containerColor="green"
              style={styles.plusBtn}
              onPress={() => navigation.navigate('Product Detail', { productId: product._id })}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    borderRadius: 12,
    margin: 5,
    backgroundColor: "#fff",
    elevation: 2,
  },
  content: {
    padding: 12,
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  plusBtn: {
    borderRadius: 24,
    margin: 0,
  },
});

export default ProductCard;
