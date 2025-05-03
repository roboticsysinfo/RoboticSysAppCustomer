import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Appbar, Avatar, Title, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { getFarmerDetailsById } from '../redux/slices/farmerSlice';
import { useRoute, useNavigation } from '@react-navigation/native';
import { sendFamilyRequest } from '../redux/slices/familyFarmerSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { COLORS } from '../../theme';
import { REACT_APP_BASE_URI } from "@env"

const FarmerDetailsScreen = () => {
  
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { farmerId } = route.params;

  const { farmerDetails, loading, error } = useSelector((state) => state.farmers);
  const currentUser = useSelector((state) => state.auth.user);
  const [isRequestSent, setIsRequestSent] = useState(false);

console.log("farmer details", farmerDetails)

  useEffect(() => {
    if (farmerId) {
      dispatch(getFarmerDetailsById(farmerId));
    }
  }, [dispatch, farmerId]);

  useEffect(() => {
    const checkRequestStatus = async () => {
      const status = await AsyncStorage.getItem(`requestSent_${farmerId}`);
      if (status === 'true') {
        setIsRequestSent(true);
      }
    };
    checkRequestStatus();
  }, [farmerId]);


  const handleSendRequest = () => {

    if (!currentUser?._id) {
      console.warn("Customer not logged in");
      return;
    }

    dispatch(sendFamilyRequest({
      fromCustomer: currentUser._id,
      toFarmer: farmerId
    }))
      .unwrap()
      .then(() => {
        setIsRequestSent(true);
        AsyncStorage.setItem(`requestSent_${farmerId}`, 'true');
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Request Sent!',
          text2: 'You’ll be notified once accepted 👨‍🌾',
          visibilityTime: 4000,
          bottomOffset: 60,
        });
      })
      .catch(() => {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Request Failed',
          text2: 'Please try again later.',
        });
      });
  };

  return (
    <View style={styles.container}>
      <Appbar.Header style={{ backgroundColor: COLORS.primaryColor }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
        <Appbar.Content title="Farmer Details" titleStyle={{ color: 'white' }} />
      </Appbar.Header>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primaryColor} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={{ color: 'red' }}>{error}</Text>
        </View>
      ) : farmerDetails ? (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.avatarContainer}>
            <Avatar.Image
              size={100}
              source={
                farmerDetails.profileImg
                  ? { uri: `${REACT_APP_BASE_URI}/${farmerDetails.profileImg}` }
                  : { uri: "https://avatar.iran.liara.run/public/boy" }
              }
            />
            <Title style={styles.name}>
              {farmerDetails.firstName} {farmerDetails.name}
            </Title>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.detailItem}>
            <Text style={styles.label}>Shop Name:</Text>
            <Text style={styles.value}>{farmerDetails.shop?.shop_name || "Not Available"}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>State:</Text>
            <Text style={styles.value}>{farmerDetails.state}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>City/District:</Text>
            <Text style={styles.value}>{farmerDetails.city_district}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>{farmerDetails.address || 'N/A'}</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.label}>Verified:</Text>
            <Text style={styles.value}>
              {farmerDetails.isKYCVerified ? 'Verified' : 'UnVerified'}
            </Text>
          </View>

          {/* ➕ Make Family Farmer Button */}
          <TouchableOpacity
            style={[styles.connectBtn, isRequestSent && styles.requestSentBtn]}
            onPress={handleSendRequest}
            disabled={isRequestSent}
          >
            <Text style={styles.connectText}>
              {isRequestSent ? 'Request Sent' : '+ Make Family Farmer'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      ) : (
        <View style={styles.center}>
          <Text>No details found.</Text>
        </View>
      )}
    </View>
  );
};

export default FarmerDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    padding: 16,
  },
  avatarContainer: {
    alignItems: "center",
    marginVertical: 16,
  },
  name: {
    marginTop: 12,
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 16,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  label: {
    fontWeight: "bold",
    color: "#555",
  },
  value: {
    color: "#333",
  },
  connectBtn: {
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  requestSentBtn: {
    backgroundColor: "#d3d3d3",
  },
  connectText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
