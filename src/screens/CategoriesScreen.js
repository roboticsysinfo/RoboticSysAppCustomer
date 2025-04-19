import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../redux/slices/categorySlice'; // Import the fetchCategories thunk
import { COLORS } from '../../theme';
import MainLayout from '../components/MainLayout';
import { REACT_APP_BASE_URI_SEC } from "@env"
import { useNavigation } from '@react-navigation/native';


const CategoriesScreen = () => {

    const dispatch = useDispatch();
    const navigation = useNavigation();

    const categories = useSelector(state => state.categories.categories);
    const status = useSelector(state => state.categories.status);
    const error = useSelector(state => state.categories.error);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchCategories()); // Dispatch the fetchCategories action when the component mounts
        }
    }, [status, dispatch]);

    const renderCategory = ({ item }) => (
        <View style={styles.category}>
            <TouchableOpacity onPress={() => {
                navigation.navigate('Category Products', { categoryId: item._id, categoryName: item.name });
            }}>

                <Image source={{ uri: `${REACT_APP_BASE_URI_SEC}${item.category_image}` }} style={styles.categoryImage} />
                <Text style={styles.categoryTitle}>{item.name}</Text>

            </TouchableOpacity>
        </View>
    );

    return (
        <MainLayout>

            <View style={styles.container}>
                <Text style={styles.title}>Find Products by Categories</Text>

                {status === 'loading' && <ActivityIndicator size={32} color={COLORS.primaryColor} />}
                {status === 'failed' && <Text>Error: {error}</Text>}

                <FlatList
                    data={categories}
                    renderItem={renderCategory}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2} // Define the number of columns directly
                    contentContainerStyle={styles.categoriesContainer}
                />
            </View>

        </MainLayout>
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
    categoriesContainer: {
        justifyContent: 'space-between',  // This ensures spacing between the items
    },
    category: {
        width: '44%',  // Adjust width to fit within 2 columns
        backgroundColor: '#fff',
        borderRadius: 10,
        margin: 10,
        flexDirection: "column",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        elevation: 2,
        textAlign: "center"
    },
    categoryImage: {
        width: 60,
        height: 60,
        resizeMode: 'contain',
        marginBottom: 10,
        margin: "auto"
    },
    categoryTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2E2E2E',
    },
});

export default CategoriesScreen;
