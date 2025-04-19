import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductsByCategory, clearCategoryProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/ProductCard';
import { useRoute } from '@react-navigation/native';
import { COLORS } from '../../theme';

const CategoryProductsScreen = () => {
    const route = useRoute();
    const { categoryId, categoryName } = route.params;

    const dispatch = useDispatch();
    const products = useSelector((state) => state.products.categoryProducts);
    const productcategoryStatus = useSelector((state) => state.products.productcategoryStatus);
    const error = useSelector((state) => state.products.error);

    useEffect(() => {
        // Clear previous category products when categoryId changes
        dispatch(clearCategoryProducts());

        // Then fetch new products
        dispatch(fetchProductsByCategory(categoryId));
    }, [categoryId, dispatch]);

    const renderProduct = ({ item }) => <ProductCard product={item} />;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{categoryName}</Text>

            {productcategoryStatus === 'loading' && (
                <ActivityIndicator size={32} color={COLORS.primaryColor} />
            )}

            {productcategoryStatus === 'failed' && (
                <Text style={styles.errorText}>Error: {error}</Text>
            )}

            {productcategoryStatus === 'succeeded' && products.length === 0 ? (
                <Text style={styles.emptyText}>No products found for this category.</Text>
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderProduct}
                    keyExtractor={(item) => item._id.toString()}
                    numColumns={2}
                    contentContainerStyle={styles.productsContainer}
                    key={categoryId} // Ensures list re-renders when category changes
                />
            )}
            
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#2E2E2E',
    },
    productsContainer: {
        justifyContent: 'space-between',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 30,
        color: '#999',
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
        color: 'red',
    },
});

export default CategoryProductsScreen;
