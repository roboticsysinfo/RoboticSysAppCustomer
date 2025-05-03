import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import appLogo from "../../src/assets/kg-logo.jpg";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native-gesture-handler";
import { Button, Divider, List } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import FIcon from "react-native-vector-icons/FontAwesome6";
import { logoutUser } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";

const CustomDrawer = ({ isOpen, closeDrawer }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const slideAnim = useRef(new Animated.Value(-300)).current; // Hidden left initially

  useEffect(() => {
    if (isOpen) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.navigate("Login");
  };

  if (!isOpen) return null;

  return (
    <View style={styles.overlayContainer}>
      <TouchableWithoutFeedback onPress={closeDrawer}>
        <View style={styles.backdrop} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.drawerContainer, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.header}>
          <Image source={appLogo} style={styles.logo} />
          <TouchableOpacity onPress={closeDrawer} style={styles.closeButton}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>

        <Divider />

        <ScrollView style={styles.settingListContainer}>
          <List.Section>
            <List.Item
              style={styles.drawerlistItem}
              title="Personal Information"
              left={() => <Icon name="account" size={22} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("MyDetails")}
            />

            <List.Item
              style={styles.drawerlistItem}
              title="Upgrade Points"
              left={() => <FIcon name="coins" size={20} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("UpgradePoints")}
            />

            <List.Item
              style={styles.drawerlistItem}
              title="My Points Score"
              left={() => <FIcon name="coins" size={20} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("Points Transactions")}
            />
            <List.Item
              style={styles.drawerlistItem}
              title="Family Farmers"
              left={() => <Icon name="account-multiple" size={22} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("Family Farmers")}
            />
            <List.Item
              style={styles.drawerlistItem}
              title="Manage Orders"
              left={() => <Icon name="package-variant" size={22} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("ManageOrders")}
            />
            <List.Item
              style={styles.drawerlistItem}
              title="My Order"
              left={() => <Icon name="cart-variant" size={22} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("Orders")}
            />
            <List.Item
              style={styles.drawerlistItem}
              title="My Reviews"
              left={() => <Icon name="chat-processing" size={22} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("MyReviews")}
            />

            <List.Item
              style={styles.drawerlistItem}
              title="My Redeem Products"
              left={() => <Icon name="cart-variant" size={22} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("RedeemProducts")}
            />

            <List.Item
              style={styles.drawerlistItem}
              title="Refer & Earn"
              left={() => <FIcon name="money-bill" size={20} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("ReferandEarn")}
            />

            <List.Item
              style={styles.drawerlistItem}
              title="Help & Support"
              left={() => <FIcon name="light-blub" size={20} />}
              right={() => <Icon name="chevron-right" size={22} />}
              onPress={() => navigation.navigate("HelpSupport")}
            />

          </List.Section>

          <Button
            mode="contained"
            onPress={handleLogout}
            style={styles.logoutButton}
            icon="logout"
          >
            Log Out
          </Button>
        </ScrollView>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    flexDirection: "row-reverse",
    zIndex: 1024,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  drawerContainer: {
    position: "absolute",
    left: 0,
    width: 300,
    height: "100%",
    backgroundColor: "white",
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowOffset: { width: -2, height: 2 },
    elevation: 5,
    zIndex: 1024,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  logo: {
    width: 150,
    height: 80,
    resizeMode: "contain",
  },
  closeButton: {
    padding: 10,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logoutButton: {
    marginRight: 30,
    marginTop: 20,
    borderRadius: 4,
    backgroundColor: "#DA2428",
    marginBottom: 20,
  },
  drawerlistItem: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
    fontSize: 12,
  },
});

export default CustomDrawer;
