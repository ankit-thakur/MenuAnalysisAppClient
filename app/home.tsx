import { useLocalSearchParams } from 'expo-router';
import HomeScreen from '@/components/HomeScreen';

export default function Index() {
  const { placeId } = useLocalSearchParams<{ placeId?: string }>();

  placeId ? console.log(`Place ID: ${placeId}`) : console.log('No Place ID');

  return (
    <HomeScreen
      placeId={placeId as string | undefined}
    />
  );
}
