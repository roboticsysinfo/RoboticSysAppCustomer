import React from "react";
import { View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Avatar, Text, List, Button } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice"; // Import logout action
import { useNavigation } from "@react-navigation/native";


const ProfileScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser()); // Dispatch logout action
    navigation.navigate("Login"); // Redirect to login
  };

  return (

    <View style={styles.container}>

      {/* Profile Section */}
      <View style={styles.profileContainer}>

        <Avatar.Image
          size={80}
          source={{ uri: "https://avatar.iran.liara.run/public/boy" }}
        />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{user ? user.name : "N/A"}</Text>
          <Text style={styles.referralText}>{user ? user.referralCode : "N/A"}</Text>
        </View>

        <TouchableOpacity onPress={() => { navigation.navigate("MyDetails") }}>
          <Icon name="pencil" size={20} color="green" style={styles.editIcon} />
        </TouchableOpacity>

      </View>

      {/* Options List */}
      <ScrollView style={styles.settingListContainer}>

        <List.Section>

          <List.Item
            style={styles.drawerlistItem}
            title={("Personal Information")}
            left={() => <Icon name="account" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate("MyDetails")}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={("My Points Score")}
            left={() => <FIcon name="money" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate("Points Transactions")}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={("Family Farmers")}
            left={() => <Icon name="account-multiple" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate("Family Farmers")}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={("Manage Orders")}
            left={() => <Icon name="package-variant" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate("ManageOrders")}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={("My Order")}
            left={() => <Icon name="cart-variant" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate("Orders")}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={("My Reviews")}
            left={() => <Icon name="chat-processing" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate("MyReviews")}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={("Referral List")}
            left={() => <Icon name="chat-processing" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate("ReferralList")}
          />

          <List.Item
            style={styles.drawerlistItem}
            title={("Refer & Earn")}
            left={() => <FIcon name="money" size={22} />}
            right={() => <Icon name="chevron-right" size={22} />}
            onPress={() => navigation.navigate("ReferandEarn")}
          />

        </List.Section>

        {/* Logout Button */}
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          icon="logout"
        >
          Log Out
        </Button>

      </ScrollView>

    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "gray",
  },
  editIcon: {
    marginRight: 10,
  },
  logoutButton: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 4,
    backgroundColor: '#DA2428',
    marginBottom: 20,
  },
  settingListContainer: {
    paddingHorizontal: 20
  },
  referralText: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
    color: "gray"
  }
});

export default ProfileScreen;
