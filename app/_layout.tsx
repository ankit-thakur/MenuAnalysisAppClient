// app/_layout.tsx
import { Slot } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import AppLoading from 'expo-app-loading';
import { useNavigation, useRouter } from 'expo-router';
import { createURL } from 'expo-linking';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return <Slot />;
}


// export const linking = {
//   prefixes: [
//     createURL('/'), // Development prefix
//     'anomo://',     // Production scheme
//     'exp+anomo://'  // Expo Go testing scheme
//   ],
// };