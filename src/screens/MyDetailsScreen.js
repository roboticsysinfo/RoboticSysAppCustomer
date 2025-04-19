import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
    ScrollView,
} from 'react-native';
import { Appbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { launchImageLibrary } from 'react-native-image-picker';
import { COLORS } from '../../theme';
import { Dropdown } from 'react-native-element-dropdown';
import { fetchCustomerById, updateCustomer } from '../redux/slices/customerSlice';
import api from '../services/api';

export default function MyDetailsScreen({ navigation }) {

    const dispatch = useDispatch();
    const { customer, loading } = useSelector((state) => state.customer);
    const { user } = useSelector((state) => state.auth);

    const [fullname, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    const [statesData, setStatesData] = useState([]);
    const [selectedState, setSelectedState] = useState('');
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState('');

    const customerId = user._id;

    useEffect(() => {
        dispatch(fetchCustomerById(customerId));
    }, [dispatch]);

    useEffect(() => {
        if (customer) {
            setFullName(customer.name || '');
            setPhone(customer.phoneNumber?.toString() || '');
            setEmail(customer.email || '');
            setAddress(customer.address || '');
            setProfileImage(customer.profile_image || null);
            setSelectedState(customer.state || '');
            setSelectedDistrict(customer.district || '');
        }
    }, [customer]);


    useEffect(() => {
        const loadStates = async () => {
            try {
                const res = await api.get('/states-cities');
                const data = res.data;
                const parsed = Array.isArray(data) ? data : data.states;

                if (Array.isArray(parsed)) {
                    setStatesData(parsed);
                    if (customer?.state) {
                        const found = parsed.find(item => item.state === customer.state);
                        setDistricts(found?.districts?.map(d => ({ label: d, value: d })) || []);
                    }
                } else {
                    console.error('Invalid format for states data');
                    setStatesData([]);
                }
            } catch (error) {
                console.error('Failed to load states:', error);
                setStatesData([]);
            }
        };

        loadStates();
    }, []);



    const handleStateChange = (value) => {
        setSelectedState(value);
        const found = statesData.find((item) => item.state === value);
        if (found) {
            const districtList = found.districts.map((district) => ({
                label: district,
                value: district,
            }));
            setDistricts(districtList);
        } else {
            setDistricts([]);
        }
        setSelectedDistrict('');
    };

    const pickImage = () => {
        const options = { mediaType: 'photo', quality: 1 };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
            } else if (response.errorCode) {
            } else if (response.assets && response.assets.length > 0) {
                setProfileImage(response.assets[0].uri);
            }
        });
    };

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append('name', fullname);
        formData.append('phoneNumber', phone);
        formData.append('email', email);
        formData.append('address', address);
        formData.append('state', selectedState);
        formData.append('district', selectedDistrict);

        if (profileImage && !profileImage.startsWith('http')) {
            formData.append('profileImage', {
                uri: profileImage,
                type: 'image/jpeg',
                name: 'profile.jpg',
            });
        }

        dispatch(updateCustomer({ customerId, customerData: formData }))
            .unwrap()
            .then(() => Alert.alert('Success', 'Profile updated successfully'))
            .catch((err) => Alert.alert('Error', err));
    };

    return (
        <>
            <Appbar.Header style={{ backgroundColor: COLORS.primaryColor }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Personal Information" titleStyle={{ color: 'white' }} />
            </Appbar.Header>

            <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
                
                <View style={{ alignSelf: 'center', marginVertical: 10 }}>
                    <TouchableOpacity onPress={pickImage}>
                        <View style={{ position: 'relative' }}>
                            <Image
                                source={
                                    profileImage
                                        ? { uri: profileImage }
                                        : { uri: 'https://avatar.iran.liara.run/public/boy' }
                                }
                                style={styles.avatar}
                            />
                            <View style={styles.editIconContainer}>
                                <Text style={styles.editIconText}>✏️</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>

                <Text style={styles.namePreview}>{fullname}</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    value={fullname}
                    onChangeText={setFullName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Phone number"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Address"
                    value={address}
                    onChangeText={setAddress}
                    multiline
                />

                <Text style={{ marginBottom: 6 }}>Select State</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={statesData.map((item) => ({
                        label: item.state,
                        value: item.state,
                    }))}
                    labelField="label"
                    valueField="value"
                    placeholder="Select State"
                    value={selectedState}
                    onChange={(item) => handleStateChange(item.value)}
                />

                <Text style={{ marginBottom: 6, marginTop: 12 }}>Select District</Text>
                <Dropdown
                    style={styles.dropdown}
                    data={districts}
                    labelField="label"
                    valueField="value"
                    placeholder="Select District"
                    value={selectedDistrict}
                    onChange={(item) => setSelectedDistrict(item.value)}
                />

                <TouchableOpacity style={styles.button} onPress={handleUpdate} disabled={loading}>
                    <Text style={styles.buttonText}>{loading ? 'Updating...' : 'Update Profile'}</Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flex: 1,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 45,
        alignSelf: 'center',
        marginVertical: 10,
        backgroundColor: '#eee',
    },
    namePreview: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 40,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
    },
    button: {
        backgroundColor: COLORS.primaryColor,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 100
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    editIconContainer: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 2,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    editIconText: {
        fontSize: 14,
    },
});
