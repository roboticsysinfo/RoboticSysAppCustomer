import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Image } from "react-native";
import { Text, List } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import noNotification from "../../assets/no_notification.png";
import { fetchNotifications, markNotificationAsRead } from "../../redux/slices/notificationSlice";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";

const NotificationsScreen = () => {

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const notifications = useSelector((state) => state.notifications.items);
  const [refreshing, setRefreshing] = useState(false);


  const loadNotifications = async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications());
    setRefreshing(false);
  };


  useEffect(() => {
    loadNotifications();
  }, []);


  return (
    <View style={styles.container}>

      {notifications.length === 0 ? (

        <View style={styles.emptyContainer}>
          <Image source={noNotification} style={styles.image} />
          <Text style={styles.emptyTitle}>No Notifications</Text>
          <Text style={styles.emptySubtitle}>
           We’ll let you know when there will be something to update you.
          </Text>
        </View>

      ) : (

        <FlatList

          data={notifications}

          keyExtractor={(item) =>
            item._id ? item._id.toString() : Math.random().toString()
          }

          renderItem={({ item }) => (

            <List.Item
              onPress={() => {
                if (!item.read) {
                  dispatch(markNotificationAsRead(item._id));
                }

                // Navigate based on type
                if (item.type === "order") {
                  navigation.navigate("Orders", { orderId: item.orderId });
                } else if (item.type === "review") {
                  navigation.navigate("My Shop Reviews", { reviewId: item.reviewId });
                } else if (item.type === "familyRequest") {
                  navigation.navigate("Family Farmer Requests", { reviewId: item.requestId });
                }
              }}
              style={[
                styles.notificationList,
                { backgroundColor: item.read ? "#fff" : "#f0f0f0" }, // ⬅️ bg change
              ]}
              title={`From: ${item.userName}`}
              titleStyle={styles.title}
              description={item.message}
              descriptionStyle={styles.description}
              left={() => (
                <Image
                  source={{
                    uri: item.profileImage || "https://avatar.iran.liara.run/public/boy",
                  }}
                  style={styles.avatar}
                />
              )}
              right={() => (
                <Text style={styles.time}>
                  {moment(item.createdAt).fromNow()}
                </Text>
              )}
            />

          )}

          refreshing={refreshing}
          onRefresh={loadNotifications}
        />
      )}
    </View>
  );
};


export default NotificationsScreen;


const styles = StyleSheet.create({

  container: { flex: 1, backgroundColor: "#fff", padding: 16 },

  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  image: { width: 250, height: 250, marginBottom: 16, resizeMode: "contain" },

  emptyTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 8 },

  emptySubtitle: { fontSize: 14, color: "gray", textAlign: "center", paddingHorizontal: 40 },

  // Title (User Name) Styling

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333"
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },


  // Description (Message) Styling
  description: {
    fontSize: 14,
    color: "#666",
    marginTop: 10,
    width: 200,
    lineHeight: 20
  },

  // Time Styling
  time: {
    fontSize: 12,
    color: "gray"
  },

  // Notification Item Styling
  notificationList: {
    borderBottomWidth: 1,
    borderColor: "#efefef",
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4
  }


});