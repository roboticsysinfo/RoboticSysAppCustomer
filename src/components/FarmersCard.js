import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { sendFamilyRequest } from '../redux/slices/familyFarmerSlice';
import { COLORS } from '../../theme';
import { REACT_APP_BASE_URI } from "@env";

const SuggestionCard = ({ person }) => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user); // assuming you store the logged-in user in auth slice

  const handleSendRequest = () => {
    if (!currentUser?._id) {
      console.warn("Customer not logged in");
      return;
    }

    dispatch(sendFamilyRequest({
      fromCustomer: currentUser._id,
      toFarmer: person._id
    }));
  };

  return (

    <View style={styles.card}>
      <Image
        source={{
          uri: person?.profileImg ? `${REACT_APP_BASE_URI}/${person.profileImg}` : "https://avatar.iran.liara.run/public"
        }}
        style={styles.avatar}
      />


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
        style={styles.connectBtn}
        onPress={handleSendRequest}
        disabled={isRequestSent}  // Disable the button once request is sent
      >
        <Text style={styles.connectText}>
          {isRequestSent ? 'Request Sent' : '+ Family Farmer'}
        </Text>
      </TouchableOpacity>
    </View>

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
    position: 'relative',
    elevation: 2,
    marginBottom: 10,
    borderWidth: 1
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
});
