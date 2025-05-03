import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Button, Divider, Portal, Modal } from 'react-native-paper';
import { fetchRedeemProducts, redeemProduct } from '../redux/slices/redeemProductSlice';
import sampleProductImage from '../assets/productimagenot.png';
import { COLORS } from '../../theme';
import Toast from 'react-native-toast-message';
import { REACT_APP_BASE_URI } from "@env";


const RedeemProducts = () => {

  const dispatch = useDispatch();
  const { rProducts, loading } = useSelector((state) => state.redeemProducts);
  const { user } = useSelector((state) => state.auth);
  const customer_Id = user?._id;

  const [notEnoughModalVisible, setNotEnoughModalVisible] = useState(false);
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchRedeemProducts());
  }, [dispatch]);

  const handleRedeem = (productId) => {
    if (!customer_Id) {
      Toast.show({
        type: 'error',
        text1: 'Farmer not found',
        position: 'bottom',
      });
      return;
    }

    dispatch(redeemProduct({ customer_Id, redeemProductId: productId }))
      .unwrap()
      .then((res) => {
        Toast.show({
          type: 'success',
          text1: res.message || 'Redeemed successfully',
        });
        setConfirmModalVisible(false);
      })
      .catch((err) => {
        if (err?.message?.toLowerCase().includes('not enough points')) {
          setNotEnoughModalVisible(true);
        } else {
          Toast.show({
            type: 'error',
            text1: err?.message || 'Redemption failed',
          });
        }
        setConfirmModalVisible(false);
      });
  };

  const onConfirmRedeem = () => {
    if (selectedProduct) {
      handleRedeem(selectedProduct._id);
    }
  };

  return (
    <>
      <View style={styles.rewardList}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 30 }} size={'large'} color={COLORS.primaryColor} />
        ) : rProducts.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No products found right now</Text>
        ) : (
          [...rProducts]
            .sort((a, b) => b.requiredPoints - a.requiredPoints)
            .map((product) => (
              <Card key={product._id} style={styles.rewardCard}>
                <Image
                  source={
                    product.r_product_img
                      ? { uri: `${REACT_APP_BASE_URI}/${product.rc_product_img}` }
                      : sampleProductImage
                  }
                  style={styles.rewardImage}
                />
                <Divider />
                <Text style={styles.rewardTitle}>{product.name}</Text>
                <Button
                  mode="contained"
                  compact
                  style={styles.useBtn}
                  labelStyle={{ fontSize: 12, flexShrink: 1, textAlign: 'center' }}
                  onPress={() => {
                    setSelectedProduct(product);
                    setConfirmModalVisible(true);
                  }}
                >
                  Use 🪙 {product.requiredPoints} Pts
                </Button>
              </Card>
            ))
        )}
      </View>

      {/* Not Enough Points Modal */}
      <Portal>
        <Modal visible={notEnoughModalVisible} onDismiss={() => setNotEnoughModalVisible(false)}>
          <View style={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 16, lineHeight: 24 }}>
              Oops! You don't have enough points to redeem this product.
            </Text>
            <Button onPress={() => setNotEnoughModalVisible(false)}>Okay</Button>
          </View>
        </Modal>
      </Portal>

      {/* Confirmation Modal */}
      <Portal>
        <Modal visible={confirmModalVisible} onDismiss={() => setConfirmModalVisible(false)}>
          <View style={{ backgroundColor: 'white', padding: 20, margin: 20, borderRadius: 10 }}>
            <Text style={{ fontSize: 16, marginBottom: 10 }}>
              Are you sure you want to redeem{' '}
              <Text style={{ fontWeight: 'bold' }}>{selectedProduct?.name}</Text> for{' '}
              <Text style={{ color: COLORS.primaryColor }}>{selectedProduct?.requiredPoints} points</Text>?
            </Text>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10 }}>
              <Button onPress={() => setConfirmModalVisible(false)}>Cancel</Button>
              <Button mode="contained" onPress={onConfirmRedeem}>Confirm</Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  rewardList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  rewardCard: {
    width: '44%',
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  rewardImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
    textAlign: 'center',
  },
  rewardTitle: {
    fontWeight: '600',
    marginTop: 8,
    fontSize: 16,
    textAlign: 'center',
  },
  useBtn: {
    marginTop: 12,
    backgroundColor: COLORS.secondaryColor,
    width: 130,
  },
});

export default RedeemProducts;
