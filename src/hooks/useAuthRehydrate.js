import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/authSlice'; // adjust path if needed


const useAuthRehydrate = () => {

  const dispatch = useDispatch();

  useEffect(() => {
    const hydrateAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const userData = await AsyncStorage.getItem('user');

        if (token && userData) {
          dispatch(setUser(JSON.parse(userData)));
        }
      } catch (error) {
        console.error('Failed to rehydrate auth state', error);
      }
    };

    hydrateAuth();
  }, []);
  
};

export default useAuthRehydrate;
