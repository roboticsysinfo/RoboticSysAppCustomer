import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Image, ScrollView, StatusBar, SafeAreaView } from 'react-native';
import { Text, Button, Title, Paragraph } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginWithOTP, sendOTP } from '../redux/slices/authSlice';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import AsyncStorage from '@react-native-async-storage/async-storage';
import appLogo from "../../src/assets/kg-logo.jpg";
import { COLORS } from '../../theme';

const RegisterOTPScreen = () => {
    const [otp, setOtp] = useState('');
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber } = route.params;

    const handleVerify = async () => {
        console.log("otp verify")
    };

    const handleResend = async () => {
        console.log("OTP send again")

    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.primaryColor }}>
            <StatusBar backgroundColor={COLORS.primaryColor} barStyle="light-content" />

            <View style={{ flex: 1, backgroundColor: '#fff' }}>
                <View style={styles.header}>
                    <View style={styles.logoContainer}>
                        <Image source={appLogo} style={styles.logo} />
                    </View>
                    <Title style={styles.title}>Welcome to{"\n"}Kissan Growth</Title>
                </View>

                <ScrollView contentContainerStyle={styles.otpContent} keyboardShouldPersistTaps="handled">
                    <Title style={styles.subTitle}>OTP Sent</Title>
                    <Paragraph>OTP has been sent to {phoneNumber}</Paragraph>

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
                        Verify OTP
                    </Button>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: COLORS.primaryColor,
        paddingVertical: 60,
        paddingHorizontal: 30,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        marginBottom: 30,
    },
    logoContainer: {
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    logo: {
        width: 150,
        height: 100,
        resizeMode: 'contain',
    },
    title: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold',
    },
    otpContent: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        flexGrow: 1,
        justifyContent: 'center',
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
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
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
    },
});

export default RegisterOTPScreen;
