// SuggestionCard.js

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { sendFamilyRequest } from '../redux/slices/familyFarmerSlice';
import { COLORS } from '../../theme';
import { REACT_APP_BASE_URI } from "@env";
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';
import Toast from 'react-native-toast-message';

const SuggestionCard = ({ person }) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [isRequestSent, setIsRequestSent] = useState(false);

  useEffect(() => {
    const fetchRequestStatus = async () => {
      try {
        const res = await api.get(`/customer/family-farmer/request/status/${currentUser._id}/${person._id}`);
        const status = res.data?.status;
        setIsRequestSent(status === 'pending' || status === 'accepted');
      } catch (error) {
        console.error("Failed to fetch request status", error);
        setIsRequestSent(false);
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
        Toast.show({
          type: 'success',
          text1: 'Request Sent!',
          text2: 'You’ll be notified once accepted 👨‍🌾',
        });
      })
      .catch((err) => {
        console.error("Failed to send request:", err);
        Toast.show({
          type: 'error',
          text1: 'Request Failed',
          text2: 'Please try again later.',
        });
      });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={() => navigation.navigate("FarmerDetails", { farmerId: person._id })}>
      <Image
        source={{ uri: person?.profileImg ? `${REACT_APP_BASE_URI}/${person.profileImg}` : "https://avatar.iran.liara.run/public" }}
        style={styles.avatar}
      />

      {person?.isUpgraded && (
        <View style={styles.upgradedBadge}>
          <Text style={styles.upgradedText}>🌟 Upgraded</Text>
        </View>
      )}

      <View style={styles.nameRow}>
        <Text style={styles.name}>{person?.name || "N/A"}</Text>
        {person?.isKYCVerified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✔</Text>
          </View>
        )}
      </View>

      <Text style={styles.headline}>{person?.city_district}</Text>
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

export default SuggestionCard;

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: 'center',
    margin: 5,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#ddd",
    position: 'relative'
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
  requestSentBtn: {
    backgroundColor: '#bbb',
  },
  connectText: {
    color: '#fff',
    fontSize: 12,
  },
  verifiedBadge: {
    backgroundColor: COLORS.primaryColor,
    borderRadius: 10,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginTop: 4
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  upgradedBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: '#FFD700',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  upgradedText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#333',
  },
});
