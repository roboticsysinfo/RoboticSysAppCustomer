import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Text, TouchableOpacity, View, Modal, ActivityIndicator, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import moment from 'moment';
import { REACT_APP_BASE_URI } from '@env';
import FIcon from "react-native-vector-icons/FontAwesome";
import { COLORS } from '../../theme';
import { clearMessages, createRequestOrder } from '../redux/slices/orderSlice';
import { getProductById } from '../redux/slices/productSlice';
import { Dropdown } from 'react-native-element-dropdown';
import { Divider, TextInput } from 'react-native-paper';

const ProductDetailsScreen = () => {
  const route = useRoute();
  const { productId } = route.params;
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { product, status } = useSelector((state) => state.products);
  const { loading } = useSelector((state) => state.requestOrder);
  const selectedProduct = useSelector((state) => state.products.selectedProduct);
  const { user } = useSelector((state) => state.auth);
  const customerId = user._id;


  const [detailsExpanded, setDetailsExpanded] = useState(true);
  const [showRequestModal, setShowRequestModal] = useState(false);

  const [formData, setFormData] = useState({
    customer_id: customerId,
    farmer_id: product?.farmer_id._id,
    product_id: product?._id,
    phoneNumber: "",
    quantity_requested: "",
    unit: "kg",
    notes: "",
  });

  const unitData = [
    { label: 'Kilograms (kg)', value: 'kg' },
    { label: 'Litres (L)', value: 'litre' },
    { label: 'Tons (tons)', value: 'tons' },
    { label: 'Pieces (pcs)', value: 'pieces' },
  ];

  useEffect(() => {
    if (productId) {
      dispatch(getProductById(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (selectedProduct) {
      setFormData((prevData) => ({
        ...prevData,
        farmer_id: selectedProduct?.farmer_id?._id || "",
        product_id: selectedProduct?._id || "",
      }));
    }
  }, [selectedProduct]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRequestOrder = async () => {

    if (!formData.phoneNumber || !formData.quantity_requested || !formData.notes) {
      Toast.show({
        type: 'error',
        text1: 'Please fill all the details.',
      });
      return;
    }

    try {
      const result = await dispatch(createRequestOrder(formData));

      if (createRequestOrder.fulfilled.match(result)) {
        Toast.show({
          type: 'success',
          text1: 'Order request submitted successfully!',
        });
        setShowRequestModal(false); // Close the modal

        setFormData({
          ...formData,
          phoneNumber: "",
          quantity_requested: "",
          notes: "",
        });
      } else {
        Toast.show({
          type: 'error',
          text1: result.payload || "Failed to submit request",
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: "Something went wrong, please try again.",
      });
    }
  };

  if (status === 'loading') {
    return <ActivityIndicator size={30} color={COLORS.primaryColor} />;
  }

  if (!product) {
    return <Text>Product not found</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>

        <Image
          source={{ uri: `${REACT_APP_BASE_URI}/${product.product_image}` }}
          style={styles.image}
          resizeMode="contain"
        />

        <Divider style={{borderWidth: 1, borderColor: "#efefef"}} />

        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.title}>{product?.name}</Text>
          </View>

          <Text style={styles.subtitle}>
            {product?.category_id.name}
          </Text>

          <View style={styles.quantityRow}>
            <Text style={styles.price}>
              <FIcon name="rupee" size={20} />
              {product?.price_per_unit}, {product?.unit}
            </Text>
          </View>

          <View style={styles.tableContainer}>
            <Text style={styles.tableTitle}>Product Info</Text>
            <View style={styles.row}>
              <Text style={styles.label}>Quantity:</Text>
              <Text style={styles.value}>{product?.quantity ?? 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Season:</Text>
              <Text style={styles.value}>{product?.season ?? 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Harvest Date:</Text>
              <Text style={styles.value}>
                {product?.harvest_date ? moment(product.harvest_date).format('DD MMM YYYY') : 'N/A'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Farmer Name:</Text>
              <Text style={styles.value}>{product?.farmer_id?.name ?? 'N/A'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Shop Name:</Text>
              <Text style={styles.value}>{product?.shop_id?.shop_name ?? 'N/A'}</Text>
            </View>
          </View>

          <TouchableOpacity onPress={() => setDetailsExpanded(!detailsExpanded)} style={styles.section}>
            <Text style={styles.sectionTitle}>Product Description</Text>
            <Icon name={detailsExpanded ? 'chevron-up' : 'chevron-down'} size={20} />
          </TouchableOpacity>

          {detailsExpanded && (
            <Text style={styles.description}>
              {product?.description}
            </Text>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={() => setShowRequestModal(true)}>
        <Text style={styles.addText}>Make Request Order</Text>
      </TouchableOpacity>

      <Modal
        visible={showRequestModal}
        animationType="slide"
        onRequestClose={() => setShowRequestModal(false)}
      >
        <SafeAreaView style={styles.modalContainer}>

          

          <View style={styles.modalHeader}>

            <TouchableOpacity onPress={() => setShowRequestModal(false)}>
              <Icon name="close" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          <Text style={{fontSize: 24, textAlign: "center", fontWeight: "bold", marginTop: 40, marginBottom: 40}} >Make Request Order</Text>

          {/* Form Inputs */}
          <TextInput
            mode='outlined'
            style={styles.input}
            placeholder="Enter your Phone Number"
            value={formData.phoneNumber}
            maxLength={10}
            keyboardType='numeric'
            onChangeText={(value) => handleInputChange('phoneNumber', value)}
          />

          <TextInput
            mode='outlined'
            style={styles.input}
            placeholder="How Much Quantity you want?"
            value={formData.quantity_requested}
            keyboardType="numeric"
            onChangeText={(value) => handleInputChange('quantity_requested', value)}
          />

          {/* Dropdown for unit */}
          <Dropdown
            style={styles.dropdownMenu}
            label="Select Unit"
            data={unitData}
            value={formData.unit}
            onChange={(item) => handleInputChange('unit', item.value)} // Correctly update the unit value
            labelField="label" // Show the 'label' as the display text
            valueField="value" // Set the 'value' for selection
            placeholder="Select Unit"
          />

          <TextInput
            mode='outlined'
            style={styles.input}
            placeholder="Any Message"
            value={formData.notes}
            onChangeText={(value) => handleInputChange('notes', value)}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleRequestOrder}
          >
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit</Text>}
          </TouchableOpacity>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

const styles = {
  container: { flex: 1, backgroundColor: '#fff' },
  header: { padding: 10, flexDirection: 'row', alignItems: 'center' },
  image: { width: '100%', height: 200 },
  infoContainer: { padding: 15 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between' },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 18, color: 'gray' },
  price: { fontSize: 20, fontWeight: 'bold', color: COLORS.primaryColor },
  tableContainer: { marginTop: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 },
  label: { fontSize: 16, color: 'gray' },
  value: { fontSize: 16 },
  section: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold' },
  description: { fontSize: 16, marginTop: 10 },
  addButton: { padding: 15, backgroundColor: COLORS.primaryColor, justifyContent: 'center', alignItems: 'center' },
  addText: { fontSize: 18, color: '#fff' },
  modalContainer: { flex: 1, padding: 15 },
  modalHeader: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  input: { marginBottom: 30 },
  submitButton: { padding: 15, borderRadius: 10, backgroundColor: COLORS.primaryColor, justifyContent: 'center', alignItems: 'center' },
  submitText: { fontSize: 18, color: '#fff' },
  dropdownMenu: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 15,
    marginBottom: 30
},
};

export default ProductDetailsScreen;
