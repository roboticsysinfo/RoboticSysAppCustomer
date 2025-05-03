import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, ActivityIndicator, Card, Divider } from 'react-native-paper';
import api from '../services/api';

const DeliveryPreferenceView = ({ farmerId }) => {
  const [preference, setPreference] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const farmer_id = farmerId

  useEffect(() => {
    const fetchPreference = async () => {
      try {
        const response = await api.get(
          `/delivery-preference/fetch/${farmer_id}`
        );

        setPreference(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch preference');
      } finally {
        setLoading(false);
      }
    };

    fetchPreference();
  }, [farmer_id]);

  if (loading) return <ActivityIndicator animating={true} size="large" style={{ marginTop: 20 }} />;
  if (error) return <Text style={{ color: 'red', margin: 16 }}>{error}</Text>;
  if (!preference) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card mode="outlined">
        <Card.Title title="Delivery Preference" />
        <Divider />
        <Card.Content>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Type:</Text>
            <Text style={styles.value}>{preference.delivery_method}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Radius (km):</Text>
            <Text style={styles.value}>{preference.delivery_range}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Note:</Text>
            <Text style={styles.value}>{preference.additional_notes}</Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    flex: 1,
    fontSize: 16,
  },
  value: {
    flex: 1,
    fontSize: 16,
    textTransform: "capitalize"
  },
});

export default DeliveryPreferenceView;
