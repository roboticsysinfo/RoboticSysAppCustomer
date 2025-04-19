import React, { useEffect, useState } from 'react';
import { Modal, View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, Text, Portal, Provider, RadioButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { createRequestOrder, clearMessages } from '../redux/slices/orderSlice'; 
import Toast from 'react-native-toast-message'; 


const RequestOrderModal = ({ visible, onDismiss }) => {

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.requestOrder);
  const selectedProduct = useSelector((state) => state.products.selectedProduct);
  const user = useSelector((state) => state.auth);

  // Agar selectedProduct nahi hai to null return karenge
  if (!selectedProduct) return null;

  const customerId = user._id;

  const [formData, setFormData] = useState({
    customer_id: customerId,
    farmer_id: '',
    product_id: '',
    phoneNumber: '',
    quantity_requested: '',
    unit: 'kg',
    notes: '',
  });

  // selectedProduct jab change ho, tab formData update ho
  useEffect(() => {
    if (selectedProduct) {
      setFormData((prev) => ({
        ...prev,
        farmer_id: selectedProduct?.farmer_id?._id || '',
        product_id: selectedProduct?._id || '',
      }));
    }
  }, [selectedProduct]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async () => {
    // Validate form data
    if (!formData.customer_id || !formData.farmer_id || !formData.product_id) {
      Toast.show({ text1: 'Invalid request. Missing essential data.', type: 'error' });
      return;
    }

    const result = await dispatch(createRequestOrder(formData));

    if (createRequestOrder.fulfilled.match(result)) {
      Toast.show({ text1: 'Request sent successfully!', type: 'success' });
      setFormData({
        ...formData,
        phoneNumber: '',
        quantity_requested: '',
        notes: '',
      });
      onDismiss();
    } else {
      Toast.show({ text1: result.payload || 'Failed to submit request', type: 'error' });
    }

    setTimeout(() => dispatch(clearMessages()), 3000);
  };

  return (
    <Provider>
      <Portal>
        <Modal visible={visible} animationType="slide" onRequestClose={onDismiss} transparent>
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <Text variant="titleLarge" style={styles.title}>Request Product</Text>
              <ScrollView>
                <TextInput
                  label="Phone Number"
                  value={formData.phoneNumber}
                  onChangeText={(text) => handleChange('phoneNumber', text)}
                  keyboardType="phone-pad"
                  maxLength={10}
                  style={styles.input}
                />

                <TextInput
                  label="Quantity Needed"
                  value={formData.quantity_requested}
                  onChangeText={(text) => handleChange('quantity_requested', text)}
                  keyboardType="numeric"
                  style={styles.input}
                />

                <RadioButton.Group
                  onValueChange={(value) => handleChange('unit', value)}
                  value={formData.unit}
                >
                  <View style={styles.radioGroup}>
                    <RadioButton.Item label="Kg" value="kg" />
                    <RadioButton.Item label="Litres" value="litre" />
                    <RadioButton.Item label="Tons" value="tons" />
                    <RadioButton.Item label="Pieces" value="pieces" />
                  </View>
                </RadioButton.Group>

                <TextInput
                  label="Notes / Message"
                  value={formData.notes}
                  onChangeText={(text) => handleChange('notes', text)}
                  multiline
                  numberOfLines={3}
                  style={styles.input}
                />

                <View style={styles.buttonRow}>
                  <Button mode="outlined" onPress={onDismiss} style={styles.button}>Cancel</Button>
                  <Button
                    mode="contained"
                    loading={loading}
                    onPress={onSubmit}
                    style={styles.button}
                  >
                    Submit
                  </Button>
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </Portal>
    </Provider>
  );
};

export default RequestOrderModal;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    maxHeight: '90%',
  },
  title: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 12,
    backgroundColor: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  radioGroup: {
    marginTop: 8,
  },
});
