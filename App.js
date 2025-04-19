import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./src/redux/store";
import AppNavigator from "./src/navigation/AppNavigator";
import { DefaultTheme, PaperProvider } from "react-native-paper";
import { COLORS } from "./theme";
import Toast, { BaseToast } from 'react-native-toast-message';
import AuthRehydrateProvider from "./src/components/AuthRehydrateProvider";
import 'react-native-reanimated';



const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.primaryColor,       // Focused border & label color
    background: 'white',   // Background color
    text: 'black',         // Text color
    placeholder: 'gray',   // Placeholder color
    underlineColor: 'red', // Underline color for flat mode
  },
};


  const toastConfig = {
    info: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: '#2196F3', height: 80 }} // taller toast
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 24,
          fontWeight: 'bold',
        }}
      />
    ),
  };


export default function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <PaperProvider theme={theme}>
          <AuthRehydrateProvider />
          <AppNavigator />
          <Toast  config={toastConfig} />
        </PaperProvider>
      </PersistGate>
    </Provider>
  );
}
