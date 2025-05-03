import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import CustomHeader from './CustomHeader';
import CustomDrawer from '../navigation/CustomDrawer';


const MainLayout = ({ children }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <View style={styles.container}>
      <CustomHeader openDrawer={() => setDrawerOpen(true)} />
      <CustomDrawer isOpen={drawerOpen} closeDrawer={() => setDrawerOpen(false)} />
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
