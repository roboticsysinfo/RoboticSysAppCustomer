import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { TextInput, Button, Title, Paragraph, ActivityIndicator } from 'react-native-paper';
import { COLORS } from '../../theme';
import appLogo from "../../src/assets/kg-logo.jpg";
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import { sendOTP } from '../redux/slices/authSlice';

const PNLoginScreen = () => {

  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState('');
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
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={appLogo} style={styles.logo} />
        </View>
        <Title style={styles.title}>Welcome to{"\n"}Kissan Growth</Title>
      </View>

      <View style={styles.form}>
        <Title style={styles.subTitle}>Login With Phone Number</Title>
        <Paragraph>We will send you an OTP on this number</Paragraph>

        <TextInput
          label="Enter Phone Number"
          mode="flat"
          style={styles.input}
          keyboardType="phone-pad"
          value={phoneNumber}
          maxLength={10}
          onChangeText={setPhoneNumber}
        />


        <Button mode='contained' style={styles.button} onPress={handleSendOTP} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            'Send OTP'
          )}
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Paragraph style={styles.signupText}>
            Don’t have an account? <Text style={styles.signupLink}>Register Now</Text>
          </Paragraph>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    backgroundColor: COLORS.primaryColor,
    paddingVertical: 60,
    paddingHorizontal: 30,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  form: {
    padding: 20,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    marginVertical: 30,
    backgroundColor: 'transparent',
  },
  infoText: {
    fontSize: 12,
    color: 'gray',
    marginTop: 4,
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primaryColor,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
  },
  signupLink: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  logoContainer: {
    alignItems: 'start',
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 100,
    resizeMode: 'contain',
  },
});

export default PNLoginScreen;
