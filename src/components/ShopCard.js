// ShopCard.js
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS } from '../../theme';
import { REACT_APP_BASE_URI } from "@env";
import { useNavigation } from '@react-navigation/native';

const ShopCard = ({ shop }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.card}>
            <Image
                source={{ uri: `${REACT_APP_BASE_URI}/${shop.shop_cover_image}` }}
                style={styles.backgroundImage}
            />

            <View style={styles.shopInfoRow}>
                <View style={styles.imageWrapper}>
                    <Image
                        source={{ uri: `${REACT_APP_BASE_URI}/${shop.shop_profile_image}` || 'https://example.com/profile.jpg' }}
                        style={styles.profileImage}
                    />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.shopName}>{shop.shop_name || 'Shop Name'}</Text>
                    <Text style={styles.cityName}>

                        {shop.isFarmerUpgraded && (
                            <MaterialCommunityIcons
                                name="shield-star-outline"
                                size={18}
                                color="#4CAF50"
                                style={styles.badgeIcon}
                            />
                        )}

                        {shop.city_district || 'City Name'}
                    </Text>
                </View>

                <View style={styles.ratingContainer}>
                    <Icon name="star" size={16} color="gold" />
                    <Text style={styles.ratingText}>{shop.averageRating || '0'}</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.viewShopBtn}
                onPress={() => navigation.navigate("Shop Details", { shopId: shop._id })}
            >
                <Text style={styles.viewShopBtnText}>View Shop</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: 320,
        alignSelf: 'center',
        marginVertical: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 2,
        margin: 15
    },
    backgroundImage: {
        width: '100%',
        height: 100,
        resizeMode: 'cover',
    },
    shopInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
    },
    imageWrapper: {
        position: 'relative',
    },
    profileImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    badgeIcon: {
        position: 'relative',
        bottom: -2,
        right: -2,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 1,
    },
    textContainer: {
        flex: 1,
    },
    shopName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    cityName: {
        fontSize: 14,
        color: '#888',
        marginTop: 2,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 14,
        marginLeft: 5,
        color: '#333',
    },
    viewShopBtn: {
        textAlign: "center",
        backgroundColor: COLORS.primaryColor,
        paddingVertical: 8,
        width: 150,
        alignSelf: 'center',
        borderRadius: 16,
        marginVertical: 15
    },
    viewShopBtnText: {
        color: "#fff",
        textAlign: "center"
    },
});

export default ShopCard;
