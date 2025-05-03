import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import {
  TextInput,
  Button,
  Title,
  Paragraph,
  Checkbox,
} from 'react-native-paper';
import appLogo from '../../src/assets/kg-logo.jpg';
import { COLORS } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import api from '../services/api';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [form, setForm] = React.useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: '',
    password: '',
    referralCode: '',
  });

  const [loading, setLoading] = React.useState(false);
  const [agreed, setAgreed] = React.useState(false);

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.phoneNumber || !form.address || !form.password) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    if (!agreed) {
      Alert.alert('Agreement Required', 'Please agree to the Privacy Policy and Terms & Conditions to continue.');
      return;
    }

    const requestData = {
      ...form,
      agreedToPrivacyPolicyAndTermsAndConditions: true,  // Added for agreement
      agreementTimestamp: new Date(),  // Added current timestamp
    };

    console.log("request data register ", requestData)

    try {
      setLoading(true);
      const res = await api.post('/auth/customer_register', requestData);
      Alert.alert('Success', res.data.message);
      navigation.navigate('Login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      Alert.alert('Error', message);
    } finally {
      setLoading(false);
    }
  };

  const openURL = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      alert("Can't open this URL: " + url);
    }
  };


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Image source={appLogo} style={styles.logo} />
        </View>
      </View>

      <View style={styles.form}>
        <Title style={styles.subTitle}>Create New Account</Title>
        <Paragraph>Enter your information to create your account</Paragraph>

        <TextInput
          label="Full Name"
          mode="flat"
          style={styles.input}
          value={form.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          label="Email Address"
          mode="flat"
          style={styles.input}
          value={form.email}
          keyboardType="email-address"
          onChangeText={(text) => handleChange('email', text)}
        />
        <TextInput
          label="Phone Number"
          mode="flat"
          style={styles.input}
          value={form.phoneNumber}
          keyboardType="phone-pad"
          maxLength={10}
          onChangeText={(text) => handleChange('phoneNumber', text)}
        />
        <TextInput
          label="Address"
          mode="flat"
          style={styles.input}
          value={form.address}
          onChangeText={(text) => handleChange('address', text)}
        />
        <TextInput
          label="Password"
          mode="flat"
          secureTextEntry
          style={styles.input}
          value={form.password}
          onChangeText={(text) => handleChange('password', text)}
        />
        <TextInput
          label="Referral Code (Optional)"
          mode="flat"
          style={styles.input}
          value={form.referralCode}
          onChangeText={(text) => handleChange('referralCode', text)}
        />

        <View style={styles.checkboxContainer}>
          <Checkbox
            status={agreed ? 'checked' : 'unchecked'}
            onPress={() => setAgreed(!agreed)}
            color={COLORS.primaryColor}
          />
          <Text style={styles.policyText}>
            I agree to the{' '}
            
            <TouchableOpacity onPress={() => openURL('https://kissangrowth.com/privacy-policy')}>
              <Text style={styles.link}>Privacy Policy</Text>
            </TouchableOpacity>
            {' '}&{' '}

            <TouchableOpacity onPress={() => openURL('https://kissangrowth.com/terms-and-conditions')}>
              <Text style={styles.link}>Terms & Conditions</Text>
            </TouchableOpacity>

          </Text>

        </View>

        <Button
          mode="contained"
          style={styles.button}
          loading={loading}
          onPress={handleRegister}
        >
          Register Now
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Paragraph style={styles.loginText}>
            Have an account? <Text style={styles.loginLink}>LOGIN NOW</Text>
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
    paddingHorizontal: 30,
    paddingTop: 40,
    paddingBottom: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 100,
    resizeMode: 'contain',
  },
  form: {
    padding: 20,
  },
  subTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  input: {
    marginVertical: 6,
    backgroundColor: 'transparent',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  policyText: {
    fontSize: 14,
    color: 'gray',
    flex: 1,
    flexWrap: 'wrap',
  },
  link: {
    color: '#000',
    textDecorationLine: 'underline',
  },
  button: {
    marginTop: 20,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primaryColor,
  },
  loginText: {
    textAlign: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: '#000',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});

export default RegisterScreen;
