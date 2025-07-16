// import { Redirect } from 'expo-router';

// export default function Index() {
//   return <Redirect href="/home/" />;
// }


import { useGlobalSearchParams, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import HomeScreen from '@/components/HomeScreen';
import { nanoid } from 'nanoid';
import webSocketInstance from '@/websocket/WebSocketInstance';

export default function Index() {
  const { placeId } = useLocalSearchParams<{ placeId?: string }>();
  const connectionKey = nanoid(6);

  useEffect(() => {
    console.log("*** ConnectionKey:", connectionKey);
    webSocketInstance.sendMessage(
      'establishConnection',
      'Establishing connection.',
      connectionKey
    );
  }, []);

  placeId ? console.log(`Place ID: ${placeId}`) : console.log('No Place ID');

  return (
    <HomeScreen
      placeId={placeId as string | undefined}
      connectionKey={connectionKey}
    />
  );
}


