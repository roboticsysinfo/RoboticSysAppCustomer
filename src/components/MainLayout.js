import React from 'react';
import { View, StyleSheet } from 'react-native';
import CustomHeader from './CustomHeader';

const MainLayout = ({ children }) => {
  return (
    <View style={styles.container}>
      <CustomHeader />
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    width: "100%"
  },
  content: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default MainLayout;
