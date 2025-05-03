import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { COLORS } from '../../theme';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';


const SelectLocationScreen = () => {

  const navigation = useNavigation();

  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    setLoading(true);
    api.get('/states-cities')
      .then(async (response) => {
        setStates(response.data);
        setLoading(false);

        // Load saved state/district only after states are loaded
        const savedState = await AsyncStorage.getItem('selectedState');
        const savedDistrict = await AsyncStorage.getItem('selectedDistrict');

        if (savedState) {
          setSelectedZone(savedState);
          const selectedState = response.data.find(state => state._id === savedState);
          setDistricts(selectedState ? selectedState.districts : []);
        }

        if (savedDistrict) {
          setSelectedArea(savedDistrict);
        }
      })
      .catch(error => {
        console.error("Error fetching states:", error);
        setLoading(false);
      });
  }, []);

  const handleStateChange = async (stateId) => {
    const selectedState = states.find(state => state._id === stateId);
    setDistricts(selectedState ? selectedState.districts : []);
    setSelectedZone(stateId);
    setSelectedArea(null);

    await AsyncStorage.setItem('selectedState', stateId);
    await AsyncStorage.removeItem('selectedDistrict');
  };

  const handleDistrictChange = async (district) => {
    setSelectedArea(district);
    await AsyncStorage.setItem('selectedDistrict', district);
  };

  const handleSubmit = async () => {
    if (selectedZone && selectedArea) {
      await AsyncStorage.setItem('selectedState', selectedZone);
      await AsyncStorage.setItem('selectedDistrict', selectedArea);
      navigation.navigate('Main'); // Make sure 'Main' is the correct screen name
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/map.png')}
        style={styles.imageLocation}
      />
      <Text style={styles.title}>Select Your Location</Text>
      <Text style={styles.subTitle}>
        Switch on your location to see farmers, products and shops in your area
      </Text>

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

      <TouchableOpacity
        style={[styles.submitButton, { opacity: selectedArea ? 1 : 0.5 }]}
        disabled={!selectedArea}
        onPress={handleSubmit}
      >
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
    alignSelf: "center"
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
    backgroundColor: COLORS.primaryColor,
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
