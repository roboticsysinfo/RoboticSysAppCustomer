import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerOrderById, cancelOrderRequest } from "../redux/slices/orderSlice";
import { Appbar, Button } from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import { COLORS } from "../../theme";
import { REACT_APP_BASE_URI } from "@env"


const OrderDetailsScreen = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation()
    const route = useRoute();
    const { orderId } = route.params;

    const {
        customerOrderDetail: order,
        loading,
        successMessage,
        error,
    } = useSelector((state) => state.requestOrder);

    useEffect(() => {
        if (orderId) {
            dispatch(fetchCustomerOrderById(orderId));
        }
    }, [orderId]);

    if (loading || !order) {
        return <ActivityIndicator size={'large'} color={COLORS.primaryColor} style={{marginTop: 60}} />;
    }

    return (

        <>

            <Appbar.Header style={{ backgroundColor: '#0a9e57',  }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Order Details" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <ScrollView contentContainerStyle={styles.container}>

                <Image source={`${REACT_APP_BASE_URI}/${order.product_image}`} style={styles.imagePlaceholder} />

                <Text style={styles.title}>{order.product_name}</Text>

                <Text style={styles.subtext}>from {order.shop_name}</Text>

                <View style={styles.ratingRow}>
                    <Text style={styles.price}>₹{order.price_per_unit}</Text>
                    <Text style={styles.strikedPrice}>Price Per Unit ( {order.unit} ) </Text>
                </View>

                <Text style={styles.description}>
                    You ordered this item from <Text style={styles.bold}>{order.farmer_name}</Text> in{" "}
                    <Text style={styles.bold}>
                        {order.quantity_requested} {order.unit}
                    </Text>.
                </Text>

                <Text style={styles.listHeader}>

                    • Order ID: <Text style={styles.bold}>{order.order_id}</Text>
                </Text>
                <Text style={styles.listHeader}>• Phone: {order.farmer_phone}</Text>
                <Text style={styles.listHeader}>
                    • Status: <Text style={{ color: order.status === "pending" ? "orange" : "green", fontWeight: "bold" }}>{order.status}</Text>
                </Text>
                <Text style={styles.listHeader}>
                    • Date: {new Date(order.created_at).toLocaleDateString()}
                </Text>

                <View style={styles.bottomRow}>
                    <Button mode="outlined" style={styles.priceButton}>
                        <Text style={{ margin: 10 }}>Total Price</Text> |
                        ₹{order.total_price}
                    </Button>
                </View>

                {order.status === "pending" && (
                    <Button
                        mode="outlined"
                        style={styles.cancelButton}
                        textColor="red"
                        onPress={() => dispatch(cancelOrderRequest(order.order_id))}
                    >
                        Cancel Order
                    </Button>
                )}

                {successMessage && <Text style={styles.success}>{successMessage}</Text>}
                {error && <Text style={styles.error}>{error}</Text>}
            </ScrollView>

        </>


    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        paddingBottom: 32,
        marginTop: 30,
    },
    imagePlaceholder: {
        width: "100%",
        height: 220,
        backgroundColor: "#ccc",
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 4,
    },
    subtext: {
        fontSize: 14,
        color: "gray",
        marginBottom: 10,
    },
    ratingRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    price: {
        fontSize: 18,
        color: "green",
        marginRight: 8,
    },
    strikedPrice: {
        fontSize: 14,
        color: "gray",
    },
    description: {
        fontSize: 14,
        color: "#555",
        marginBottom: 10,
    },
    listHeader: {
        fontSize: 14,
        color: "#333",
        marginBottom: 6,
    },
    bold: {
        fontWeight: "bold",
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 20,
    },
    priceButton: {
        borderColor: "green",
        borderWidth: 1,
        borderRadius: 6,

    },
    cartButton: {
        backgroundColor: "green",
        borderRadius: 6,
    },
    cancelButton: {
        borderColor: "red",
        marginTop: 12,
        borderRadius: 6,
    },
    loadingText: {
        marginTop: 50,
        textAlign: "center",
        fontSize: 18,
    },
    success: {
        color: "green",
        textAlign: "center",
        marginTop: 10,
    },
    error: {
        color: "red",
        textAlign: "center",
        marginTop: 10,
    },
});

export default OrderDetailsScreen;
