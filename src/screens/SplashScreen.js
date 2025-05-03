import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS } from '../../theme';
import appLogo from "../../src/assets/kg-logo.jpg";

const SplashScreen = ({ navigation }) => {

  useEffect(() => {

    const checkLoginStatus = async () => {

      const token = await AsyncStorage.getItem('token');
      const selectedState = await AsyncStorage.getItem('selectedState');
      const selectedDistrict = await AsyncStorage.getItem('selectedDistrict');

      setTimeout(() => {
        if (!token) {
          // User is not logged in, navigate to Login screen
          navigation.replace("Login");
        } else if (!selectedState || !selectedDistrict) {
          // User is logged in, but location not selected, navigate to Select Location screen
          navigation.replace("SelectLocation");
        } else {
          // User is logged in and location is selected, navigate to Main screen
          navigation.replace("Main");
        }
      }, 2000); // Splash delay
    };

    checkLoginStatus();

  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image
        source={appLogo}
        style={styles.headerImage}
      />
      {/* <Text style={styles.text}>Kissan Growth</Text>  */}
      <Text style={styles.subtext}>Customer App</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#53B175" },
  headerImage: {
    width: 250,
    height: 200,
    resizeMode: 'contain',
  },
  text: { fontSize: 32, fontWeight: 'bold', color: '#fff', fontFamily: FONTS.bold },
  subtext: { fontSize: 24, fontWeight: 'bold', color: '#fff', fontFamily: FONTS.bold },
});

export default SplashScreen;
