import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MainLayout from '../components/MainLayout';
import { Divider } from 'react-native-paper';
import { COLORS } from '../../theme';
import { fetchFarmersByCity } from '../redux/slices/farmerSlice';
import farmernotfound from '../assets/farmernotfound.png';
import { REACT_APP_BASE_URI } from "@env";
import { sendFamilyRequest } from '../redux/slices/familyFarmerSlice';
import Toast from 'react-native-toast-message';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import api from '../services/api';

const SuggestionCard = ({ person }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [isRequestSent, setIsRequestSent] = useState(false);
  const [requestStatus, setRequestStatus] = useState(null);

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const res = await api.get(
          `/customer/family-farmer/request/status/${currentUser._id}/${person._id}`
        );
        const status = res.data?.status;
        if (status === "pending" || status === "accepted") {
          setIsRequestSent(true);
          setRequestStatus(status);
        } else {
          setIsRequestSent(false);
          setRequestStatus(null);
        }
      } catch (error) {
        console.error("Failed to fetch request status", error);
        setIsRequestSent(false);
        setRequestStatus(null);
      }
    };

    if (currentUser?._id && person?._id) {
      fetchRequestStatus();
    }
  }, [person._id, currentUser?._id]);

  const handleSendRequest = () => {
    if (!currentUser?._id) return;

    dispatch(sendFamilyRequest({
      fromCustomer: currentUser._id,
      toFarmer: person._id
    }))
      .unwrap()
      .then(() => {
        setIsRequestSent(true);
        AsyncStorage.setItem(`requestSent_${person._id}`, 'true');
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: 'Request Sent!',
          text2: 'You’ll be notified once accepted 👨‍🌾',
          visibilityTime: 4000,
          bottomOffset: 60,
        });
      })
      .catch((err) => {
        console.error("Failed to send request:", err);
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Request Failed',
          text2: 'Please try again later.',
        });
      });
  };

  return (
    <TouchableOpacity style={styles.card}
      onPress={() => navigation.navigate("FarmerDetails", { farmerId: person._id })}>
      <Image
        source={{ uri: person.profileImg ? `${REACT_APP_BASE_URI}/${person.profileImg}` : "https://avatar.iran.liara.run/public" }}
        style={styles.avatar}
      />
      <View style={styles.nameRow}>
        <Text style={styles.name}>{person.name}</Text>
        {person.isKYCVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✔</Text>
          </View>
        )}
      </View>
      <Text style={styles.headline}>{person.city_district}</Text>
      <Divider style={{ marginVertical: 5 }} />
      <TouchableOpacity
        style={[styles.connectBtn, isRequestSent && styles.requestSentBtn]}
        onPress={handleSendRequest}
        disabled={isRequestSent}
      >
        <Text style={styles.connectText}>
          {isRequestSent ? 'Request Sent' : '+ Family Farmer'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const FarmersScreen = () => {
  const dispatch = useDispatch();
  const { farmers, loading } = useSelector((state) => state.farmers);

  useFocusEffect(
    React.useCallback(() => {
      const getDistrictAndFetch = async () => {
        try {
          const selectedDistrict = await AsyncStorage.getItem('selectedDistrict');
          if (selectedDistrict) {
            dispatch(fetchFarmersByCity(selectedDistrict));
          }
        } catch (error) {
          console.log("Error reading district from storage:", error);
        }
      };
      getDistrictAndFetch();
    }, [dispatch])
  );

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator size="large" color={COLORS.primaryColor} />;
    }

    const verifiedFarmers = (farmers || [])
      .filter(farmer => farmer.isKYCVerified)
      .sort((a, b) => {
        // Sort upgraded farmers to the top
        if (a.isUpgraded && !b.isUpgraded) return -1;
        if (!a.isUpgraded && b.isUpgraded) return 1;

        // If same upgrade status, sort by latest creation
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

    if (verifiedFarmers.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Image source={farmernotfound} style={styles.image} />
          <Text style={styles.emptyTitle}>No Farmers Found</Text>
          <Text style={styles.emptySubtitle}>
            No KYC verified farmers found for this location.
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.grid}>
        {verifiedFarmers.map((person, index) => (
          <SuggestionCard key={index} person={person} />
        ))}
      </View>
    );
  };

  return (
    <MainLayout>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Family Farmer Suggestions</Text>
        <Text style={styles.subheading}>
          Connect with farmers and send a request to add them to your family circle
        </Text>
        {renderContent()}
      </ScrollView>
    </MainLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    backgroundColor: "#efefef"
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
  },
  subheading: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 15
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'start',
    gap: 8,
  },
  card: {
    width: 150,
    backgroundColor: '#f7f9fa',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    margin: 5,
    position: 'relative',
    elevation: 2
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#efefef"
  },
  nameRow: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  name: {
    fontWeight: '600',
    fontSize: 14,
  },
  headline: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  connectBtn: {
    backgroundColor: COLORS.primaryColor,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  connectText: {
    color: '#fff',
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 16,
    resizeMode: "contain",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    paddingHorizontal: 40,
  },
  verifiedBadge: {
    backgroundColor: COLORS.primaryColor,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  requestSentBtn: {
    backgroundColor: '#d3d3d3',
  },
});

export default FarmersScreen;
