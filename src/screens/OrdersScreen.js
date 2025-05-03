import React, { useEffect } from 'react';
import { View, FlatList, StyleSheet, Image } from 'react-native';
import { Text, Button, Appbar, TouchableRipple } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerOrders } from '../redux/slices/orderSlice';
import { useNavigation } from '@react-navigation/native';
import { REACT_APP_BASE_URI } from "@env";
import { COLORS } from '../../theme';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";

const OrdersScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { customerOrders = [], loading } = useSelector((state) => state.requestOrder);


  useEffect(() => {
    dispatch(fetchCustomerOrders());
  }, [dispatch]);



  const renderItem = ({ item }) => {
    // Set the status style based on the item status
    const statusStyle = item.status === 'cancelled'
      ? { color: 'red', fontWeight: 'bold' }
      : item.status === 'accepted'
        ? { color: 'green', fontWeight: 'bold' }
        : {};

    return (
      <TouchableRipple
        onPress={() => navigation.navigate('OrderDetails', { orderId: item.order_id })}
        style={styles.itemContainer}
        rippleColor="rgba(0, 0, 0, .1)"
      >
        <View style={styles.row}>

          {item.product_image ? (
            <Image
              source={{ uri: `${REACT_APP_BASE_URI}${item.product_image}` }}
              style={styles.imagePlaceholder}
            />
          ) : (
            <Image
              source={{ uri: "https://placehold.jp/150x150.png" }} // fallback image
              style={styles.imagePlaceholder}
            />
          )}


          <View style={styles.infoContainer}>
            <Text style={styles.title}>Order ID: {item.order_id}</Text>
            <Text style={styles.subText}>Product: {item.product_name || 'N/A'}</Text>
            <Text style={styles.subText}>Date: {new Date(item.created_at).toLocaleDateString()}</Text>
            <Text style={styles.subText}>Status: <Text style={statusStyle}>{item.status}</Text></Text>
            <Button
              mode="text"
              onPress={() => navigation.navigate('OrderDetails', { orderId: item.order_id })}
              labelStyle={{ color: '#0a9e57', marginLeft: 'auto', verticalAlign: 'middle' }}
              contentStyle={{ paddingHorizontal: 0 }}
            >
              See Details <FIcon name="arrow-right-long" size={18} />
            </Button>
          </View>
        </View>
      </TouchableRipple>
    );
  };



  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: '#0a9e57' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="My Orders" titleStyle={{ color: 'white' }} />
      </Appbar.Header>

      <FlatList
        data={customerOrders}
        keyExtractor={(item) => item.order_id?.toString() ?? Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No orders found.</Text>}
        refreshing={loading}
        onRefresh={() => dispatch(fetchCustomerOrders())}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#efefef' },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  row: { flexDirection: 'row' },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#ccc',
    borderRadius: 8,
    marginRight: 12,
  },
  infoContainer: { flex: 1 },
  title: { fontSize: 15, fontWeight: 'bold', marginBottom: 6 },
  subText: { color: '#555', fontSize: 13, fontWeight: "bold" },
});

export default OrdersScreen;
