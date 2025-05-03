import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet, Alert } from "react-native";
import { TextInput, Button, Text, useTheme, Appbar } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { createHelpSupport, clearHelpSupportMessages } from "../redux/slices/customerHelpSupportSlice";
import { useNavigation } from "@react-navigation/native";

const HelpSupportScreen = () => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation()

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const { loading, error, successMessage } = useSelector((state) => state.customerHelpSupport);

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleSubmit = () => {
        if (!form.name || !form.email || !form.phone || !form.subject || !form.message) {
            Alert.alert("Error", "Please fill all fields");
            return;
        }

        dispatch(createHelpSupport(form));
    };

    useEffect(() => {
        if (successMessage) {
            Alert.alert("Success", successMessage);
            dispatch(clearHelpSupportMessages());
            setForm({ name: "", email: "", phone: "", subject: "", message: "" });
        }

        if (error) {
            Alert.alert("Error", error);
            dispatch(clearHelpSupportMessages());
        }
    }, [successMessage, error]);

    return (

        <>

            <Appbar.Header style={{ backgroundColor: '#0a9e57', }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="white" />
                <Appbar.Content title="Help & Support" titleStyle={{ color: 'white' }} />
            </Appbar.Header>


            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Customer Help & Support</Text>

                <TextInput
                    label="Name"
                    value={form.name}
                    onChangeText={(text) => handleChange("name", text)}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Email"
                    value={form.email}
                    onChangeText={(text) => handleChange("email", text)}
                    mode="outlined"
                    keyboardType="email-address"
                    style={styles.input}
                />
                <TextInput
                    label="Phone"
                    value={form.phone}
                    onChangeText={(text) => handleChange("phone", text)}
                    mode="outlined"
                    keyboardType="phone-pad"
                    style={styles.input}
                />
                <TextInput
                    label="Subject"
                    value={form.subject}
                    onChangeText={(text) => handleChange("subject", text)}
                    mode="outlined"
                    style={styles.input}
                />
                <TextInput
                    label="Message"
                    value={form.message}
                    onChangeText={(text) => handleChange("message", text)}
                    mode="outlined"
                    multiline
                    numberOfLines={4}
                    style={[styles.input, { height: 100 }]}
                />

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    loading={loading}
                    style={{ marginTop: 20, paddingVertical: 8 }}
                >
                    Submit Request
                </Button>
            </ScrollView>

        </>


    );
};

export default HelpSupportScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingBottom: 40,
        backgroundColor: "#fff",
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        marginBottom: 15,
    },
});
