import React, { useState } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginWithOTP, sendOTP } from '../redux/slices/authSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OTPScreen = () => {
  const [otp, setOtp] = useState('');
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params;

  const handleVerify = async () => {
    if (otp.length !== 4) {
      Toast.show({
        type: 'error',
        text1: 'Invalid OTP',
        text2: 'Please enter a valid 4-digit OTP',
      });
      return;
    }

    try {
      const resultAction = await dispatch(loginWithOTP({ phoneNumber, otp }));
      if (loginWithOTP.fulfilled.match(resultAction)) {
        const { token, user } = resultAction.payload;

        // Store in AsyncStorage
        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));

        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: `Welcome ${user?.name || ''}!`,
        });

        // Check if the location (state and district) is selected
        const selectedState = await AsyncStorage.getItem('selectedState');
        const selectedDistrict = await AsyncStorage.getItem('selectedDistrict');

        if (!selectedState || !selectedDistrict) {
          // If location is not selected, navigate to Select Location screen
          navigation.replace('SelectLocation');
        } else {
          // If location is selected, navigate to Main screen
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'OTP Failed',
          text2: resultAction.payload.message || "Invalid OTP",
        });
      }
    } catch (err) {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'Something went wrong',
        text2: 'Failed to verify OTP',
      });
    }
  };

  const handleResend = async () => {
    try {
      const resultAction = await dispatch(sendOTP(phoneNumber));
      if (sendOTP.fulfilled.match(resultAction)) {
        Toast.show({
          type: 'success',
          text1: 'OTP Resent',
          text2: 'Check your phone again 📲',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Resend Failed',
          text2: resultAction.payload.message || 'Try again later',
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Could not resend OTP',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter your 4-digit code</Text>
      <Text style={styles.label}>Code</Text>
      <TextInput
        style={styles.input}
        keyboardType="phone-pad"
        maxLength={4}
        value={otp}
        onChangeText={setOtp}
        placeholder="- - - -"
        textAlign="center"
      />
      <Text style={styles.resend} onPress={handleResend}>
        Resend Code
      </Text>
      <Button mode="contained" onPress={handleVerify} style={styles.button}>
        ➔
      </Button>
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
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  input: {
    fontSize: 28,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 8,
    marginBottom: 12,
  },
  resend: {
    color: 'green',
    marginBottom: 20,
    fontSize: 14,
  },
  button: {
    alignSelf: 'flex-end',
    borderRadius: 50,
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
  },
});

export default OTPScreen;
