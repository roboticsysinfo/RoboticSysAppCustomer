import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, FONTS } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSearchResults } from '../redux/slices/searchSlice';
import { fetchNotifications } from '../redux/slices/notificationSlice';
import { fetchCustomerById } from '../redux/slices/customerSlice';
import { Badge } from 'react-native-paper';


const CustomHeader = ( {openDrawer} ) => {

  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { customer, loading } = useSelector((state) => state.customer);
  const unreadCount = useSelector((state) => state.notifications.unreadCount);

  const [state, setState] = useState(null);
  const [district, setDistrict] = useState(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(null); // No default filter
  const [modalVisible, setModalVisible] = useState(false);


  const customerId = user?.id;
  const points = customer?.points;

  // 🔄 On screen focus: fetch notifications, farmer, orders
  useFocusEffect(
    useCallback(() => {
      dispatch(fetchNotifications());
      dispatch(fetchCustomerById(customerId));
    }, [dispatch, customerId])
  );

  useEffect(() => {
    const loadLocation = async () => {
      const savedState = await AsyncStorage.getItem('selectedState');
      const savedDistrict = await AsyncStorage.getItem('selectedDistrict');
      setState(savedState);
      setDistrict(savedDistrict);
    };

    loadLocation();
  }, []);

  const handleSearch = () => {
    if (!filter) {
      Alert.alert('Select Filter', 'Please select a filter before searching.');
      return;
    }

    if (query.trim()) {
      dispatch(fetchSearchResults({ query, filter, city: district }));
      navigation.navigate('Search', { query, filter, city: district });
    }
  };

  const filterOptions = ['shops', 'farmers', 'products'];

  return (
    <View style={styles.container}>
      {/* Top Row: Location + Bell Icon */}
      <View style={styles.topRow}>

        <TouchableOpacity style={styles.drawerButton}  onPress={openDrawer}>
          <MIcon name="menu" size={36} color="#fff" />
        </TouchableOpacity>


        <TouchableOpacity onPress={() => navigation.navigate('SelectLocation')}>
          <View style={styles.locationWrapper}>
            <Icon name="location-outline" size={32} color="#fff" />
            <View>
              <Text style={styles.deliverToText}>Change Your Location</Text>
              <Text style={styles.addressText}>{district}</Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={{ flexDirection: 'row', }}>


          <TouchableOpacity
            style={styles.walletButton}
            onPress={() => navigation.navigate("Points Transactions")}
          >
            <MIcon name="wallet-outline" size={32} color="#fff" />
            {points > 0 && (
              <View style={styles.walletBadge}>
                <FIcon name="coins" size={10} color="white" />
                <Text style={styles.badgeText}> {points}</Text>
              </View>
            )}
          </TouchableOpacity>



          <TouchableOpacity style={styles.notificationButton} onPress={() => navigation.navigate('Notifications')}>
            <Icon name="notifications-outline" size={32} color="#fff" />
            {unreadCount > 0 && (
              <Badge style={styles.badge}>{unreadCount}</Badge>
            )}
          </TouchableOpacity>

        </View>

      </View>

      {/* Search Row */}
      <View style={styles.searchRow}>
        <View style={styles.searchInputWrapper}>
          <Icon name="search" size={18} color="#888" style={{ marginHorizontal: 8 }} />
          <TextInput
            placeholder="Search for your items"
            style={styles.searchInput}
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterIconWrapper} onPress={() => setModalVisible(true)}>
          <MaterialIcon name="tune" size={22} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButtonWrapper} onPress={handleSearch}>
          <Icon name="search" size={22} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Optional: Show current filter */}
      {filter && (
        <Text style={{ color: '#fff', marginTop: 5, fontSize: 13 }}>
          Selected Filter: <Text style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{filter}</Text>
        </Text>
      )}

      {/* Filter Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Filter</Text>
            <FlatList
              data={filterOptions}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setFilter(item);
                    setModalVisible(false);
                  }}
                >
                  <Text style={styles.modalOption}>{item}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};



export default CustomHeader;


const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primaryColor,
    paddingTop: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  locationWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  walletBadge: {
    flex: 1,
    flexGrow: 1,
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#f0a500",
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 100,
    flexDirection: "row", // icon + text in one line
    alignItems: "center",
    justifyContent: "center",
  },

  deliverToText: {
    fontSize: 12,
    color: '#fff',
  },
  addressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'yellow',
    fontFamily: FONTS.regular,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  searchInputWrapper: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    paddingHorizontal: 5,
    height: 45,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#000',
  },

  filterIconWrapper: {
    marginLeft: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchButtonWrapper: {
    marginLeft: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },

  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  modalOption: {
    padding: 10,
    fontSize: 16,
    color: '#333',
    textTransform: 'capitalize',
  },

  modalCloseButton: {
    marginTop: 10,
    alignItems: 'center',
  },

  modalCloseText: {
    color: 'red',
    fontSize: 16,
  },

  drawerButton: {
    marginRight: -30,
  },

  walletButton: {
    marginRight: 10
  },
  walletBadge: {
    position: "absolute",
    top: -15,
    right: -10,
    backgroundColor: "#f0a500",
    borderRadius: 50,
    paddingHorizontal: 8,
    paddingVertical: 2,
    width: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  badgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },

  notificationButton: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -10,
    right: -4,
    backgroundColor: "#DA2528",
    color: "#fff",
    fontSize: 12,
    height: 18,
    minWidth: 18,
    textAlign: "center",
    borderRadius: 9,
    paddingHorizontal: 4,
  },

});