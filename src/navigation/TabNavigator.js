import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/tabs/HomeScreen";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ProfileScreen from "../screens/ProfileScreen";
import { COLORS } from "../../theme";
import { useSelector } from "react-redux";
import SearchScreen from "../screens/tabs/SearchScreen";
import ProductsScreen from "../screens/tabs/ProductsScreen";
import ShopsScreen from "../screens/tabs/ShopsScreen";
import CategoriesScreen from "../screens/CategoriesScreen";
import FarmersScreen from "../screens/FarmersScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({

                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    // Assign different icons based on the route name
                    if (route.name === "Home") {
                        iconName = "home";
                    } else if (route.name === "Farmers") {
                        iconName = "account-multiple";
                    } else if (route.name === "Products") {
                        iconName = "cart-variant";
                    } else if (route.name === "Shops") {
                        iconName = "store";
                    } else if (route.name === "My Account") {
                        iconName = "account";
                    }

                    // Return the icon component
                    return <Icon name={iconName} size={size} color={color} />;
                },

                tabBarStyle: {
                    backgroundColor: "#fff",
                    elevation: 3,
                    height: 60,
                    paddingVertical: 5,
                    borderTopRightRadius: 16,
                    borderTopLeftRadius: 16
                },
                tabBarIconStyle: {
                    marginBottom: 0,
                    marginTop: 5,
                },
                tabBarActiveTintColor: "#fff",
                tabBarActiveBackgroundColor: COLORS.secondaryColor,
                tabBarInactiveTintColor: COLORS.primaryColor,
                tabBarLabelPosition: "below-icon",
                headerShown: false,

            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Farmers" component={FarmersScreen} />
            <Tab.Screen name="Products" component={ProductsScreen} />
            <Tab.Screen name="Shops" component={ShopsScreen} />
            <Tab.Screen name="My Account" component={ProfileScreen} />

        </Tab.Navigator>
    );
};

export default TabNavigator;