import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import QRScanner from '../components/QRScanner';


import webSocketInstance from '@/websocket/WebSocketInstance';
// import { WebSocketProvider } from '../websocket/WebSocketContext';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter'; // https://fonts.google.com/specimen/Inter
import AppLoading from 'expo-app-loading'; // Ensures fonts are loaded before rendering
import { nanoid } from 'nanoid';
import * as Linking from 'expo-linking';


export type RootStackParamList = {
  Home: { connectionKey: string; placeId?: string };
  // Home: { connectionKey: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App: React.FC = () => {

  const connectionKey = nanoid(6);
  console.log("*** ConnectionKey: ", connectionKey);
  console.log("*** Setting up WebSocket ***");
  webSocketInstance.sendMessage('establishConnection', 'Establishing connection.', connectionKey);
  console.log("*** Sending message from frontend to backend ***");


  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />; // Wait until fonts are loaded
  }

  const linking = {
    prefixes: [
      Linking.createURL('/'),       // Expo Go (dev)
      'https://29rreba-ankth-8081.exp.direct' // Web fallback
    ],
    config: {
      screens: {
        Home: {
          path: 'home/:placeId?', // placeId is optional
          parse: {
            placeId: (value: string) => value,
          },
        },
      },
    },
  };

  return (
    <NavigationContainer independent={true} linking={linking}>
    {/* <NavigationContainer independent={true}> */}
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
          initialParams={{ connectionKey: connectionKey }} // Pass your variable here
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
