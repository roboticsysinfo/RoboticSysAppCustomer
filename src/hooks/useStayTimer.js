import { useEffect, useRef } from "react";
import { AppState } from "react-native";
import { useDispatch } from "react-redux";
import { rewardDailyPoints } from "../redux/slices/redeemProductSlice";

const useStayTimer = (enabled) => {
  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const appState = useRef(AppState.currentState);
  const startTimeRef = useRef(null);
  const hasRewardedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;

    const checkAndReward = () => {
      const now = Date.now();
      const diff = now - startTimeRef.current;
      const fiveMinutes = 5 * 60 * 1000;


      if (diff >= fiveMinutes && !hasRewardedRef.current) {
        dispatch(rewardDailyPoints());
        hasRewardedRef.current = true;
      } else {
      }
    };

    const handleAppStateChange = (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        // App came to foreground: start/resume timer
        if (!startTimeRef.current) {
          startTimeRef.current = Date.now();
        }
        // Check if reward is due
        timerRef.current = setInterval(checkAndReward, 10000); // check every 10s
      } else if (
        appState.current === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        // App going to background: stop timer
        clearInterval(timerRef.current);
        timerRef.current = null;
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener("change", handleAppStateChange);

    // Initial launch
    if (!startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
    timerRef.current = setInterval(checkAndReward, 10000);

    return () => {
      clearInterval(timerRef.current);
      subscription.remove();
    };
  }, [dispatch, enabled]);
};

export default useStayTimer;
