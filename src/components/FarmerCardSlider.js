// components/FarmerCardSlider.js
import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { COLORS } from '../../theme';
import { sendFamilyRequest } from '../redux/slices/familyFarmerSlice';
import { REACT_APP_BASE_URI } from "@env";
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const FarmerCard = ({ person }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const currentUser = useSelector((state) => state.auth.user);
    const [isRequestSent, setIsRequestSent] = React.useState(false);

    const handleSendRequest = () => {
        if (!currentUser?._id) return;

        dispatch(sendFamilyRequest({
            fromCustomer: currentUser._id,
            toFarmer: person._id
        }))
            .unwrap()
            .then(() => {
                setIsRequestSent(true);
                Toast.show({
                    type: 'success',
                    text1: 'Request Sent!',
                    text2: 'You’ll be notified once accepted 👨‍🌾',
                    position: 'bottom',
                });
            })
            .catch(() => {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to send request',
                    position: 'bottom',
                });
            });
    };

    return (
        <View style={styles.card}>
            <Image
                source={{ uri: `${REACT_APP_BASE_URI}/${person.profileImg}` || "https://avatar.iran.liara.run/public" }}
                style={styles.avatar}
            />
            <Text style={styles.name}>{person.name}</Text>
            <Text style={styles.city}>{person.city_district}</Text>
            <TouchableOpacity
                style={[styles.btn, isRequestSent && { backgroundColor: '#aaa' }]}
                onPress={handleSendRequest}
                disabled={isRequestSent}
            >
                <Text style={styles.btnText}>{isRequestSent ? 'Request Sent' : '+ Family Farmer'}</Text>
            </TouchableOpacity>
        </View>
    );
};

const FarmerCardSlider = () => {
    const navigation = useNavigation()
    const { farmers } = useSelector((state) => state.farmers);
    const verifiedFarmers = (farmers || []).filter(f => f.isKYCVerified).slice(0, 10);

    return (


        <View style={{ paddingHorizontal: 15 , marginTop: 15}}>

            <View style={styles.headingContainer}>
                <Text style={styles.heading}>Nearby Verified Farmers</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Farmers")}>
                    <Text style={styles.viewAllText}>See All</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={verifiedFarmers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <FarmerCard person={item} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 10 }}
            />

        </View>

    );
};

export default FarmerCardSlider;

const styles = StyleSheet.create({

    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        marginRight: 12,
        width: 140,
        alignItems: 'center',
        elevation: 2,
        marginBottom: 5
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#ccc"
    },
    name: {
        fontSize: 14,
        fontWeight: '600',
        textAlign: 'center'
    },
    city: {
        fontSize: 12,
        color: '#555',
        marginVertical: 4,
    },
    btn: {
        marginTop: 8,
        backgroundColor: COLORS.primaryColor,
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 6,
    },
    btnText: {
        color: '#fff',
        fontSize: 12,
    },
    headingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 8,
    },
    viewAllText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.primaryColor,
    },

});
