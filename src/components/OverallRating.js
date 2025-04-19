import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from 'react-redux';

const OverallRating = () => {
  const { reviews, averageRating } = useSelector(state => state.reviews);

  const totalReviews = reviews.length;
  const rating = parseFloat(averageRating) || 0;

  const renderStars = (ratingValue) => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= ratingValue ? 'star' : i - ratingValue < 1 ? 'star-half-full' : 'star-outline'}
          size={20}
          color="#fbbc04"
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.rating}>{rating.toFixed(1)}</Text>
      <View style={styles.stars}>{renderStars(rating)}</View>
      <Text style={styles.reviewText}>{totalReviews} Reviews</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ddd"
  },
  rating: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
  },
  stars: {
    flexDirection: 'row',
    marginVertical: 8,
  },
  reviewText: {
    fontSize: 16,
    color: '#666',
    fontWeight: 600
  },
});

export default OverallRating;
