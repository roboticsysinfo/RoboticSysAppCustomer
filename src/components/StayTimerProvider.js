import React from 'react';
import { useSelector } from 'react-redux';
import useStayTimer from '../hooks/useStayTimer';

const StayTimerProvider = () => {
  const user = useSelector(state => state.auth.user);
  const isLoggedIn = !!user;

  // if user logged in timer will start
  useStayTimer(isLoggedIn);

  return null; 
};

export default StayTimerProvider;
