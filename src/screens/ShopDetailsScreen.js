import React, { useCallback, useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Text, Title, Paragraph, Avatar, Button } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { COLORS } from '../../theme';
import { clearSelectedShop, fetchProductsByShopId, fetchShopByShopId } from '../redux/slices/shopSlice';
import { REACT_APP_BASE_URI } from '@env';
import AboutTab from '../components/AboutTab';
import ProductCard from '../components/ProductCard';
import ShopReviewsTab from '../components/ShopReviewsTab';
import ProductsTab from '../components/ProductTab';
import ReviewModal from '../components/ReviewModal';
import { fetchReviews } from '../redux/slices/reviewSlice';

const ShopDetailsScreen = ({ route }) => {


    const { shopId } = route.params;
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { selectedShop: shop, status, products } = useSelector(state => state.shop);
    const { reviews, averageRating } = useSelector(state => state.reviews);


    const [activeTab, setActiveTab] = useState('about');
    const rating = parseFloat(averageRating) || 0;


    // Inside ShopDetailsScreen component
    const [isModalVisible, setModalVisible] = useState(false);


    // Show modal function
    const openReviewModal = () => setModalVisible(true);
    const closeReviewModal = () => setModalVisible(false);


    useEffect(() => {
        console.log("Fetching products for shopId:", shopId);
        dispatch(fetchShopByShopId(shopId));
        dispatch(fetchProductsByShopId(shopId));
        dispatch(fetchReviews(shopId));
        return () => {
            dispatch(clearSelectedShop());
        };
    }, [dispatch, shopId]);

    useFocusEffect(
        useCallback(() => {
            console.log("Fetching products for shopId:", shopId);
            dispatch(fetchShopByShopId(shopId));
            dispatch(fetchProductsByShopId(shopId));
            dispatch(fetchReviews(shopId));

            return () => {
                dispatch(clearSelectedShop());
            };
        }, [dispatch, shopId])
    );


    const coverImage = shop?.shop_cover_image ? `${REACT_APP_BASE_URI}/${shop.shop_cover_image}` : 'https://via.placeholder.com/300';
    const profileImage = shop?.shop_profile_image ? `${REACT_APP_BASE_URI}/${shop.shop_profile_image}` : 'https://via.placeholder.com/100';


    if (status === "loading" || !shop) {
        return (

            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={COLORS.secondaryColor} />
            </View>

        );
    }

    return (

        <View style={styles.container}>

            <Image
                source={{ uri: coverImage }}
                style={styles.coverImage}
            />

            <View style={styles.profileSection}>

                <Avatar.Image
                    size={80}
                    source={{ uri: profileImage }}
                    style={{ backgroundColor: '#f0f0f0' }}
                />

                <View style={styles.info}>

                    <Title style={{ fontWeight: "bold" }}>{shop?.shop_name || 'Unnamed Shop'}</Title>

                    <Paragraph style={styles.subTitle}>{shop?.city_district || 'Unknown location'}</Paragraph>

                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>

                        <View style={styles.ratingRow}>
                            <Text style={styles.stars}><Icon name="star" size={22} /></Text>
                            <Text style={styles.rating}>{rating}</Text>
                        </View>

                        <View style={{ alignItems: 'flex-end', marginRight: 16 }}>
                            <Button
                                icon="pencil"
                                mode="outlined"
                                compact
                                onPress={openReviewModal}
                                style={{ fontSize: 10 }}
                            >
                                Give Review
                            </Button>
                        </View>

                    </View>

                </View>

            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>

                {['about', 'products', 'reviews'].map(tab => (

                    <Text
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[
                            styles.tabText,
                            activeTab === tab && styles.activeTabText
                        ]}
                    >
                        {tab === 'about' ? 'About' : tab === 'products' ? 'Products' : 'Reviews'}
                    </Text>

                ))}
            </View>

            {/* Content */}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

                {activeTab === 'about' && <AboutTab shop={shop} />}


                {activeTab === 'products' && (
                    <View style={{ padding: 10, flex: 1, flexDirection: "row", flexWrap: "wrap", backgroundColor: "#efefef" }}>
                        {status === 'loading' ? (
                            <ActivityIndicator size="large" color={COLORS.secondaryColor} />
                        ) : status === 'failed' ? (
                            <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
                                Failed to load products.
                            </Text>
                        ) : products && products.length > 0 ? (
                            products.map((product, index) => (
                                <ProductsTab key={product._id || index} product={product} />
                            ))
                        ) : (
                            <Text style={{ textAlign: 'center', color: 'gray', marginTop: 20 }}>
                                No products found.
                            </Text>
                        )}
                    </View>
                )}




                {activeTab === 'reviews' && <ShopReviewsTab shopId={shop?._id} />}

            </ScrollView>

            <ReviewModal visible={isModalVisible} onDismiss={closeReviewModal} shopId={shopId} />

        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    coverImage: {
        width: '100%',
        height: 150,
    },
    profileSection: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    info: {
        marginLeft: 16,
    },
    subTitle: {
        color: 'gray',
    },
    ratingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    stars: {
        color: '#FFD700',
    },
    rating: {
        marginRight: 10,
        fontWeight: "600",
        fontSize: 18,
        color: "gray"
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    tabText: {
        marginHorizontal: 20,
        paddingBottom: 8,
        fontSize: 16,
        color: 'gray',
    },
    activeTabText: {
        color: COLORS.primaryColor,
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primaryColor,
        fontWeight: 'bold',
    },
});

export default ShopDetailsScreen;
