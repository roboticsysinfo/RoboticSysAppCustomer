import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slices/categorySlice';
import { COLORS } from '../../theme';
import { REACT_APP_BASE_URI_SEC } from "@env";

const { width: screenWidth } = Dimensions.get('window');

const CategorySlider = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const { categories, status, error } = useSelector((state) => state.categories);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    const handleViewAllPress = () => {
        navigation.navigate('Categories');
    };

    const renderCategoryItem = ({ item }) => (


        <Pressable onPress={() => navigation.navigate("Category Products", { categoryId: item._id })}>

            <View
                style={[styles.categoryItemWrapper, { width: screenWidth / 3 }]}
            >
                <View style={styles.categoryItem}>
                    <Image
                        source={{ uri: `${REACT_APP_BASE_URI_SEC}${item.category_image}` }}
                        style={styles.categoryImage}
                    />
                    <Text style={styles.categoryName}>{item.name}</Text>
                </View>
            </View>

        </Pressable>
        
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Categories</Text>
                <TouchableOpacity onPress={handleViewAllPress}>
                    <Text style={styles.viewAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            {status === 'loading' && <ActivityIndicator size="large" color={COLORS.primaryColor} />}
            {status === 'failed' && <Text style={{ color: 'red' }}>{error}</Text>}

            {status === 'succeeded' && categories?.length > 0 && (
                <FlatList
                    data={categories}
                    horizontal
                    keyExtractor={(item) => item._id}
                    renderItem={renderCategoryItem}
                    showsHorizontalScrollIndicator={false}
                />
            )}

            {status === 'succeeded' && (!categories || categories.length === 0) && (
                <Text style={{ textAlign: 'center', color: 'gray' }}>No categories available</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 15,
        paddingHorizontal: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    viewAllText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primaryColor,
    },
    categoryItemWrapper: {
        paddingHorizontal: 5,
    },
    categoryItem: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 5,
        height: 120,
        elevation: 2
    },
    categoryImage: {
        width: 48,
        height: 48,
        resizeMode: 'contain',
    },
    categoryName: {
        marginTop: 10,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: "center",
    },
});

export default CategorySlider;
