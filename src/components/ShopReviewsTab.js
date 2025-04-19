import React, { useEffect } from 'react';
import { View, ScrollView, Image, StyleSheet, TouchableOpacity, Alert, ToastAndroid } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import OverallRating from './OverallRating';
import noReviewsImage from "../assets/reviews.png";
import { useDispatch, useSelector } from 'react-redux';
import { fetchReviews, deleteReview } from '../redux/slices/reviewSlice';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import moment from 'moment';
import { fetchShopByShopId } from '../redux/slices/shopSlice';

const ShopReviewsTab = ({ shopId }) => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { reviews } = useSelector((state) => state.reviews);

    useEffect(() => {
        if (shopId) {
            dispatch(fetchReviews(shopId));
        }
    }, [dispatch,shopId]); 

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

    const reviewList = reviews || [];
    const averageRating = reviews?.averageRating || 0;


    return (
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }}>
            {Array.isArray(reviewList) && reviewList.length > 0 ? (
                <View>
                    <OverallRating rating={averageRating} totalReviews={reviewList.length} />

                    {[...reviewList]
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                        .map((item) => (
                            <View key={item._id} style={styles.reviewCard}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: "space-between" }}>
                                        <Avatar.Image size={40} source={{ uri: item.avatar || "https://avatar.iran.liara.run/public/boy" }} />
                                        <View style={{ marginLeft: 10 }}>
                                            <Text style={{ fontWeight: 'bold' }}>{item.user_id?.name}</Text>
                                            <View style={{ flexDirection: 'row', marginVertical: 5 }}>
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
                                        {user?._id === item.user_id?._id && (
                                            <View style={{ flexDirection: "row", justifyContent: "flex-end", width: "50%" }}>
                                                <TouchableOpacity onPress={() => handleDelete(item._id)}>
                                                    <Icon
                                                        name="trash-can-outline"
                                                        size={20}
                                                        style={styles.iconDelete}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        )}
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
    );
};

export default ShopReviewsTab;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff", padding: 16 },

    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    image: {
        width: 200,
        height: 200,
        marginBottom: 16,
    },

    emptyTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
    },

    emptySubtitle: {
        fontSize: 14,
        color: "gray",
        textAlign: "center",
        paddingHorizontal: 40,
    },

    reviewCard: {
        marginBottom: 16,
        padding: 16,
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "whitesmoke",
        borderRadius: 4,
    },

    title: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },

    description: {
        fontSize: 14,
        color: "#666",
        marginTop: 10,
        width: 200,
        lineHeight: 20,
    },

    time: {
        fontSize: 12,
        color: "gray",
    },

    iconDelete: {
        color: "#DA2528",
    },
});
