import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { COLORS } from '../../theme'; // Optional, if you have a theme defined
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';  // To handle navigation

const SelectLocationScreen = () => {
  const navigation = useNavigation();  // Hook to navigate to main screen

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    // Simulate an API call
    api.get('/states-cities')
      .then(response => {
        setStates(response.data); // Update states list
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching states:", error);
        setLoading(false);
      });

    // Load saved selections from AsyncStorage
    const loadPreviousSelection = async () => {
      const savedState = await AsyncStorage.getItem('selectedState');
      const savedDistrict = await AsyncStorage.getItem('selectedDistrict');

      if (savedState) {
        setSelectedZone(savedState);
        // If state is already selected, load corresponding districts
        const selectedState = response.data.find(state => state._id === savedState);
        setDistricts(selectedState ? selectedState.districts : []);
      }

      if (savedDistrict) {
        setSelectedArea(savedDistrict);
      }
    };

    loadPreviousSelection();
  }, []);

  const handleStateChange = async (stateId) => {
    // Find selected state and set the districts
    const selectedState = states.find(state => state._id === stateId);
    setDistricts(selectedState ? selectedState.districts : []);
    setSelectedArea(null);  // Reset area selection

    // Save state selection to AsyncStorage
    await AsyncStorage.setItem('selectedState', stateId);
    await AsyncStorage.removeItem('selectedDistrict');  // Clear previously selected district
  };

  const handleDistrictChange = async (district) => {
    setSelectedArea(district);

    // Save district selection to AsyncStorage
    await AsyncStorage.setItem('selectedDistrict', district);
  };

  const handleSubmit = async () => {
    if (selectedZone && selectedArea) {
      // Save selections to AsyncStorage
      await AsyncStorage.setItem('selectedState', selectedZone);
      await AsyncStorage.setItem('selectedDistrict', selectedArea);

      // Navigate to the main screen
      navigation.navigate('Main'); // Replace with the actual name of your main screen
    }
  };

  return (
    <View style={styles.container}>

      <Image
        source={require('../assets/map.png')} // Replace with your map icon or background
        style={styles.imageLocation}
      />

      {/* Instructions Text */}
      <Text style={styles.title}>Select Your Location</Text>
      <Text style={styles.subTitle}>Switch on your location to farmers, product and shops in your area</Text>

      {/* State Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your State</Text>
        <Dropdown
          data={states.map(state => ({
            label: state.state,
            value: state._id,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Select your state"
          value={selectedZone}
          onChange={item => handleStateChange(item.value)}
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          iconColor="gray"
        />
      </View>

      {/* City/District Dropdown */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Your City/District</Text>
        <Dropdown
          data={districts.map(district => ({
            label: district,
            value: district,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Select your City/District"
          value={selectedArea}
          onChange={item => handleDistrictChange(item.value)}
          style={styles.dropdown}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          iconColor="gray"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} disabled={!selectedArea} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Let's Go</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color={COLORS.primaryColor} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
  },
  imageLocation: {
    width: 150,
    height: 150,
    resizeMode: "contain",
    marginBottom: 30,
    textAlign: "center",
    marginHorizontal: "auto"
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  subTitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: 'gray',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  dropdown: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingLeft: 10,
  },
  placeholder: {
    fontSize: 14,
    color: '#aaa',
  },
  selectedText: {
    fontSize: 14,
    color: '#333',
  },
  submitButton: {
    backgroundColor: COLORS.primaryColor, // Or use any color that fits your theme
    paddingVertical: 15,
    borderRadius: 16,
    marginTop: 30,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SelectLocationScreen;
