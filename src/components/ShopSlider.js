import React from 'react';
import { FlatList, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ShopCard from './ShopCard'; // Reuse the ShopCard component
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../theme';


const ShopSlider = ({ shops, title }) => {
  
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Shops')}>
            <Text style={styles.viewAllText}>See All</Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={shops}
        horizontal
        renderItem={({ item }) => <ShopCard shop={item} />}
        keyExtractor={(item) => item._id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.sliderContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    borderRadius: 10,
    paddingVertical: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 23,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: COLORS.primaryColor,
    fontWeight: 'bold',
  },
  sliderContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20, // Ensure space at the bottom of the slider
  },
});

export default ShopSlider;
