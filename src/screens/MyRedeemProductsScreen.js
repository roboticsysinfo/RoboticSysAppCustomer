import React, { useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { Appbar, Card, Title, Paragraph } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCustomerRedeemHistory } from '../redux/slices/customerSlice';
import { COLORS } from '../../theme';
import { REACT_APP_BASE_URI } from "@env"

const MyRedeemProductsScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    const { redeemHistory, redeemLoading, redeemError } = useSelector((state) => state.customer);
    const { user } = useSelector((state) => state.auth);


    const customerId = user?._id;


    // Dispatch action to fetch redeem history when component mounts
    useEffect(() => {
        dispatch(fetchCustomerRedeemHistory(customerId));
    }, [dispatch, customerId]);

    // If loading or error
    if (redeemLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size={'large'} color={COLORS.primaryColor}/>
            </View>
        );
    }

    if (redeemError) {
        return (
            <View style={styles.centered}>
                <Text>Error: {redeemError}</Text>
            </View>
        );
    }

    // Render item for each redeem product
    const renderItem = ({ item }) => {
        return (
            <Card style={styles.card}>
                <Card.Cover source={{ uri: `${REACT_APP_BASE_URI}/${item.productImg}` }} />
                <Card.Content>
                    <Title>{item.redeemProductName}</Title>
                    <Paragraph>{`Points Deducted: ${item.pointsDeducted}`}</Paragraph>
                    <Paragraph>{`Required Points: ${item.requiredPoints}`}</Paragraph>
                    <Paragraph>{`Redeemed At: ${new Date(item.redeemedAt).toLocaleDateString()}`}</Paragraph>
                </Card.Content>
            </Card>
        );
    };

    return (

        <View style={styles.container}>
            <Appbar.Header style={{ backgroundColor: COLORS.primaryColor }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="My Redeem Products" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <FlatList
                data={redeemHistory}
                keyExtractor={(item) => item.redeemProductId.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.flatList}
            />
        </View>
        
    );
};


const styles = StyleSheet.create({

    container: {
        flex: 1,
    },
    flatList: {
        padding: 20,
    },
    card: {
        marginBottom: 15,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    redeemProductName:{
        fontWeight: "bold",
        marginVertical: 10
    }

});

export default MyRedeemProductsScreen;
