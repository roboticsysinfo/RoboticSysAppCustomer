import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Alert, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";
import { useDispatch, useSelector } from 'react-redux';
import { sendOTP } from '../redux/slices/authSlice'; // adjust path if needed
import { Button } from 'react-native-paper';
import Toast from 'react-native-toast-message';

const PNLoginScreen = () => {

  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { otpSent, loading } = useSelector((state) => state.auth);



  const handleSendOTP = () => {
    if (!phoneNumber || phoneNumber.length !== 10) {
      Alert.alert("Error", 'Please enter a valid phone number.');
      return;
    }
  
    dispatch(sendOTP(phoneNumber)).then((result) => {
      if (sendOTP.fulfilled.match(result)) {
        Toast.show({
          type: 'success',
          text1: 'OTP Sent',
          text2: 'Please check your phone 📲',
        });
  
        navigation.replace('OTP', { phoneNumber });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed to send OTP',
          text2: result.payload?.message || 'Try a different number.',
        });
      }
    });
  };



  return (

    <View style={styles.container}>

      <Text style={styles.title}>Enter Your Phone Number</Text>

      <View style={styles.inputRow}>
        <Text style={styles.flag}>+91</Text>
        <TextInput
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="Enter Phone Number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          maxLength={10}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <FIcon name="arrow-right-long" color="#fff" size={20} />
      </TouchableOpacity>

    </View>

  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    alignItems: 'center',
    paddingBottom: 4,
  },
  flag: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 18,
  },
  button: {
    marginTop: 24,
    alignSelf: 'flex-end',
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
});

export default PNLoginScreen;