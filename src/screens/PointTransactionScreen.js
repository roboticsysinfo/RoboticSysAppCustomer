import React, { useEffect } from "react";
import { View, FlatList, StyleSheet, Image, SectionList } from "react-native";
import { Text, ActivityIndicator, Card } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { fetchPointTransactions } from "../redux/slices/rewardSlice";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import coinIcon from "../assets/coin.png";
import { fetchCustomerById } from "../redux/slices/customerSlice";


const borderColors = {
  referral: "#2ECC71", // Fresh green - trust & success
  redeem: "#E74C3C", // Soft red - action
  daily_stay: "#3498DB", // Cool blue - engagement
  daily_share: "#F39C12", // Warm orange - activity
  daily_login: "#F1C40F", // Bright golden - reward
  self_register: "#9B59B6", // Purple - action/self effort
  new_product_added: "#1ABC9C", // Teal - newness
  family_farmer: "darkgreen", 
  shop_review: "orange"
};


const PointTransactionScreen = () => {
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { customer } = useSelector((state) => state.customer);
  const { pointsTransactions, status, error } = useSelector((state) => state.reward);
  const customerId = user?._id;


  useEffect(() => {
    if (customerId) {
      dispatch(fetchPointTransactions(customerId));
      dispatch(fetchCustomerById(customerId));
    }
  }, [dispatch, customerId]);


  // Function to group transactions by date
  const groupTransactionsByDate = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const date = new Date(transaction.createdAt).toLocaleDateString(); // Format date to group by
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(transaction);
      return acc;
    }, {});
  };


  const renderItem = ({ item }) => {
    return (
      <View style={[styles.card, { borderLeftColor: borderColors[item.type] || "#ccc" }]}>
        <View>
          <Text variant="titleMedium" style={styles.points}>
            {item.points > 0 ? `+${item.points}` : item.points} Points
          </Text>
          <Text>{item.type.replace("_", " ").toUpperCase()}</Text>
          <Text>{item.description}</Text>
          <Text style={styles.date}>{new Date(item.createdAt).toLocaleString()}</Text>
        </View>
      </View>
    );
  };


  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );


  if (status === "loading") {
    return <ActivityIndicator style={{ marginTop: 30 }} />;
  }


  if (status === "failed") {
    return <Text style={{ margin: 20, color: "red" }}>{error}</Text>;
  }


  // Group transactions by date
  const groupedTransactions = Object.entries(groupTransactionsByDate(pointsTransactions)).map(
    ([date, transactions]) => ({
      title: date, // Use the formatted date as section title
      data: transactions,
    })
  );


  return (
    <>
      <View style={styles.header}>
        <Image source={coinIcon} style={styles.coinIcon} />
        <Text style={styles.totalPoints}>{customer?.points || 0} Points</Text>
      </View>

      {/* Color legend */}
      <View style={styles.legendContainer}>
        {Object.entries(borderColors).map(([type, color]) => (
          <View key={type} style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <Text style={styles.legendLabel}>
              {type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Text>
          </View>
        ))}
      </View>

      {/* Render grouped transactions */}
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.list}
      />
    </>
  );
};

export default PointTransactionScreen;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
    borderLeftWidth: 5,
    backgroundColor: "#fff",
    elevation: 2,
    padding: 10
  },
  coinIcon: {
    width: 30,
    height: 30,
    marginRight: 0,
  },
  points: {
    fontWeight: "bold",
    fontSize: 18,
  },
  date: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 0,
    backgroundColor: "#fff",
  },
  totalPoints: {
    fontSize: 32,
    fontWeight: "bold",
    marginLeft: 8,
    color: "#333",
  },
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
    backgroundColor: "#fff",
    padding: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 2,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    marginVertical: 4,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendLabel: {
    fontSize: 12,
    color: "#555",
  },
  sectionHeader: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 10,
    paddingLeft: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#333",
  },
});
