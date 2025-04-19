import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, RefreshControl, Image, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { Text, Card, Avatar, IconButton, Appbar } from 'react-native-paper';
import noReviewsImage from "../assets/reviews.png"
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviewsByCustomerId, deleteReview } from '../redux/slices/reviewSlice';
import FIcon from "react-native-vector-icons/FontAwesome6";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';


const MyReviewsScreen = ({ shop }) => {

    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [refreshing, setRefreshing] = useState(false);


    const { reviews } = useSelector(state => state.reviews);

    const customerId = user._id


    useEffect(() => {
        if (customerId) {
            dispatch(fetchReviewsByCustomerId(customerId));
        }
    }, [dispatch, customerId]);


    const onRefresh = useCallback(async () => {
        if (!customerId) return;

        setRefreshing(true);
        await dispatch(fetchReviewsByCustomerId(customerId));
        setRefreshing(false);
    }, [dispatch, customerId]);


    const handleDelete = (reviewId) => {
        Alert.alert(
            "Are you sure?",
            "Do you really want to delete this review?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const res = await dispatch(deleteReview(reviewId)).unwrap();
                            ToastAndroid.show(res.message || "Review deleted!", ToastAndroid.SHORT);
                        } catch (error) {
                            ToastAndroid.show(error || "Failed to delete review", ToastAndroid.SHORT);
                        }
                    },
                },
            ]
        );
    };


    return (

        <>

            <Appbar.Header style={{ backgroundColor: '#0a9e57' }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Manage Your Reviews" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <ScrollView
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                contentContainerStyle={{ flexGrow: 1, padding: 16 }}
            >

                {reviews.length > 0 ? (

                    <View>

                        {[...reviews]
                            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by latest
                            .map((item) => (

                                <View key={item._id} style={styles.reviewCard}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between", width: "100%" }}>

                                            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                                                <View>

                                                    <Text style={{ fontWeight: 'bold' }}>{item.shop_id?.shop_name}</Text>

                                                    <View style={{ flexDirection: 'row', marginVertical: 5, }}>
                                                        {[...Array(5)].map((_, i) => (

                                                            <Icon
                                                                key={i}
                                                                name={i < item.rating ? 'star' : 'star-outline'}
                                                                size={16}
                                                                color="#FFD700"
                                                                style={styles.icon}
                                                            />

                                                        ))}
                                                    </View>

                                                </View>

                                            </View>

                                            <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "50%", top: -10 }}>
                                                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                                                    <Icon
                                                        name="trash-can-outline"
                                                        size={24}
                                                        style={styles.iconDelete}
                                                    />
                                                </TouchableOpacity>
                                            </View>


                                        </View>

                                    </View>


                                    <Text style={{ color: 'gray', fontSize: 12, marginTop: 10 }}>
                                        {moment(item.createdAt).fromNow()}
                                    </Text>

                                    <Text style={{ marginTop: 10 }}>{item.comment}</Text>

                                </View>

                            ))}

                    </View>

                ) : (

                    <View style={styles.emptyContainer}>
                        <Image source={noReviewsImage} style={styles.image} />
                        <Text style={styles.emptyTitle}>No Reviews Yet</Text>
                        <Text style={styles.emptySubtitle}>
                            No reviews just yet – but your harvest is just getting started!
                        </Text>
                    </View>

                )}
            </ScrollView>

        </>

    );
};

export default MyReviewsScreen;


const styles = StyleSheet.create({

    container: { flex: 1, backgroundColor: "#efefef", padding: 16 },

    emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", },

    image: { width: 200, height: 200, marginBottom: 16 },

    emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },

    emptySubtitle: { fontSize: 14, color: "gray", textAlign: "center", paddingHorizontal: 40 },

    // Title (User Name) Styling
    reviewCard: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "whitesmoke",
        borderRadius: 4,
        elevation: 2
    },


    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },

    // Description (Message) Styling
    description: {
        fontSize: 14,
        color: "#666",
        marginTop: 10,
        width: 200,
        lineHeight: 20
    },

    // Time Styling
    time: {
        fontSize: 12,
        color: "gray"
    },

    iconDelete: {
        color: "#DA2528"

    }


});
