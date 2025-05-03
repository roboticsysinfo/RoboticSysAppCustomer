import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import { Card, Button, Title, Paragraph, Appbar } from 'react-native-paper';
import RazorpayCheckout from 'react-native-razorpay';
import { COLORS } from '../../theme';
import CoinIcon from '../assets/coins.png';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import Toast from 'react-native-toast-message';
import FIcon from "react-native-vector-icons/FontAwesome";
import api from '../services/api';

const UpgradePointsScreen = () => {

    const navigation = useNavigation();
    const { user } = useSelector((state) => state.auth);
    const customerId = user?._id;

    const pointsOptions = [
        { points: 100, price: 100, image: CoinIcon },
        { points: 500, price: 500, image: CoinIcon },
        { points: 1000, price: 1000, image: CoinIcon },
    ];

    const handlePayment = async (points, basePrice) => {

        const priceWithGst = Math.round(basePrice * 1.18); // GST included

        try {
            
            const response = await api.post('/customer/createRazorpayOrder', {
                amount: priceWithGst * 100,  // in paise
            });

            if (response.data.success) {

                const { order_id } = response.data;
                const options = {
                    key: 'rzp_test_3DSEzlHPip5mQr',
                    description: `Upgrade to ${points} points (incl. GST)`,
                    currency: 'INR',
                    amount: priceWithGst * 100,
                    name: 'Upgrade Points',
                    order_id: order_id,
                    prefill: {
                        email: user?.email,
                        contact: user?.phoneNumber,
                        name: user?.name,
                    },
                    theme: { color: COLORS.primaryColor },
                };

                try {
                    const paymentData = await RazorpayCheckout.open(options);
                    console.log(paymentData);
                    updatePoints(points);
                } catch (paymentError) {
                    console.error("Razorpay payment failed:", paymentError);
                    alert("Payment failed, please try again!");
                }
            } else {
                console.error("Failed to create Razorpay order:", response.data.message);
                alert("Failed to create payment order, please try again.");
            }
        } catch (error) {
            console.error('Error creating Razorpay order:', error);
            alert("Error creating payment order, please try again.");
        }

    };

    const updatePoints = async (points) => {
        try {
            const response = await api.post(`/customer/upgrade-points/${customerId}`, {
                upgradedpoints: points,
            });

            if (response.data.success) {
                Toast.show({
                    type: 'info',
                    text1: "Points updated successfully",
                    position: 'bottom',
                });
                navigation.navigate("Points Transactions")
            } else {
                console.log('Failed to update points:', response.data.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Appbar.Header style={{ backgroundColor: '#0a9e57' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Upgrade Points" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.container}>
                <Title style={styles.title}>Upgrade Your Points</Title>
                <Paragraph style={styles.subtitle}>
                    Turn Your Redeem Points into Products You Love!
                </Paragraph>

                <View style={styles.cardsContainer}>
                    {pointsOptions.map((option, index) => {
                        const priceWithGst = Math.round(option.price * 1.18);
                        return (
                            <Card key={index} style={styles.card}>
                                <Card.Content style={styles.cardContent}>
                                    <View style={{ flexDirection: "row", marginVertical: 10 }}>
                                        <Image source={option.image} style={styles.coinIcon} />
                                        <Title style={styles.points}>{option.points} Points</Title>
                                    </View>
                                    <Paragraph style={styles.price}>
                                        <FIcon name="rupee" size={18} /> {priceWithGst} <Text style={{ fontSize: 12 }}>(incl. GST)</Text>
                                    </Paragraph>
                                </Card.Content>

                                <Card.Actions style={styles.cardActions}>
                                    <Button
                                        mode="contained"
                                        onPress={() => handlePayment(option.points, option.price)}
                                    >
                                        Upgrade Points
                                    </Button>
                                </Card.Actions>
                            </Card>
                        )
                    })}
                </View>
            </ScrollView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        alignItems: 'center',
        flexGrow: 1,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primaryColor,
        marginTop: 20,
    },
    subtitle: {
        fontSize: 16,
        color: 'gray',
        textAlign: 'center',
        marginBottom: 30,
    },
    cardsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    card: {
        width: '100%',
        marginBottom: 20,
        borderRadius: 12,
        elevation: 2,
        padding: 10,
        backgroundColor: "#fff"
    },
    coinIcon: {
        width: 40,
        height: 40,
        marginBottom: 10,
        marginRight: 10,
    },
    points: {
        fontSize: 24,
        fontWeight: 'bold',
        color: "#000",
    },
    price: {
        fontSize: 18,
        color: 'gray',
        marginBottom: 10,
        width: "100%",
    },
    cardActions: {
        justifyContent: 'center',
        alignSelf: "center",
        marginTop: 10,
    },
});

export default UpgradePointsScreen;
