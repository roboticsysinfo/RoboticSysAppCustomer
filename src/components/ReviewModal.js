import React, { useState } from 'react';
import { View, StyleSheet, ToastAndroid } from 'react-native';
import { Modal, Portal, Text, Button, TextInput } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { submitReview } from '../redux/slices/reviewSlice';
import StarRatingBar from './StarRatingBar';


const ReviewModal = ({ visible, onDismiss, shopId }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');


    const handleSubmit = () => {
        dispatch(submitReview({
            shop_id: shopId,
            rating,
            comment,
        }))
            .then((res) => {
                if (res.meta.requestStatus === "fulfilled") {
                    ToastAndroid.show("Review Submitted! Thank you!", ToastAndroid.SHORT);
                    setRating(0);
                    setComment('');
                    onDismiss(); // Close the modal
                } else {
                    const message = res.payload?.message || "Something went wrong. Try again later.";
                    console.log("Review Error:", res.payload);
                    ToastAndroid.show(message, ToastAndroid.SHORT);
                }
            });

    };


    return (

        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={styles.modalContainer}>
                <Text style={styles.title}>Give Your Review to Shop</Text>

                <StarRatingBar rating={rating} onChange={setRating} />

                <TextInput
                    mode='outlined'
                    label="Comment"
                    multiline
                    numberOfLines={4}
                    value={comment}
                    onChangeText={setComment}
                    style={styles.input}
                />

                <Button mode="contained" onPress={handleSubmit} disabled={rating === 0}>
                    Post Review
                </Button>

            </Modal>
        </Portal>
        
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: 'white',
        padding: 20,
        margin: 20,
        borderRadius: 8,
    },
    title: {
        fontSize: 18,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    input: {
        marginTop: 10,
        marginBottom: 10,
    },
});

export default ReviewModal;
