import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import {
  getRequestsForCustomer,
  cancelFamilyRequest,
} from '../redux/slices/familyFarmerSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FIcon from 'react-native-vector-icons/FontAwesome6';


const FamilyFarmersScreen = () => {
  const dispatch = useDispatch();
  const { customerRequests, loading, error } = useSelector(
    (state) => state.familyfarmer
  );
  const { user } = useSelector((state) => state.auth);
  const customerId = user._id;

  useEffect(() => {
    if (customerId) {
      dispatch(getRequestsForCustomer(customerId));
    }
  }, [dispatch, customerId]);

  const acceptedRequests = customerRequests?.filter(
    (req) => req.status === 'accepted'
  );

  // Inside the handleRemove function
  const handleRemove = (toFarmerId) => {
    Alert.alert(
      'Confirm',
      'Are you sure you want to remove this family farmer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            // Dispatch the cancel request action
            await dispatch(
              cancelFamilyRequest({
                fromCustomer: customerId,
                toFarmer: toFarmerId,
              })
            );

            // Show success toast
            Toast.show({
              type: 'success',
              position: 'bottom',
              text1: 'Family Farmer Removed',
              text2: 'The family farmer has been removed successfully.',
            });

            // Re-fetch the updated requests to refresh the list
            dispatch(getRequestsForCustomer(customerId));
          },
        },
      ]
    );
  };

  const renderItem = ({ item }) => {
    const farmer = item.toFarmer;
    return (
      <View style={styles.card}>
        <Image source={{ uri: farmer.profileImg }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{farmer.name}</Text>
          <Text style={styles.details}>
            <Icon name="phone" size={18} /> {farmer.phoneNumber}
          </Text>
          <Text style={styles.details}>
            <FIcon name="location-dot" size={18} /> {farmer.village},{' '}
            {farmer.city_district}, {farmer.state}
          </Text>
          <Text style={styles.details}>{farmer.address}</Text>

          <TouchableOpacity
            onPress={() => handleRemove(farmer._id)}
            style={styles.removeButton}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) return <ActivityIndicator size="large" style={{ marginTop: 40 }} />;
  if (error) return <Text style={styles.error}>Error: {error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Family Farmers</Text>
      {acceptedRequests?.length > 0 ? (
        <FlatList
          data={acceptedRequests}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.empty}>No accepted family farmers yet.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#efefef' },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
  },
  list: { paddingHorizontal: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginVertical: 8,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#efefef',
  },
  info: { flex: 1 },
  name: { fontSize: 18, fontWeight: '600' },
  details: { fontSize: 14, color: '#555', marginTop: 10 },
  removeButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#ff4d4d',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  error: { color: 'red', textAlign: 'center', marginTop: 20 },
  empty: { textAlign: 'center', marginTop: 40, color: '#777' },
});

export default FamilyFarmersScreen;
