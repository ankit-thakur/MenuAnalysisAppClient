import { router } from "expo-router";
import { Button } from 'react-native';

const HelpScreen = () => {
  return (
    <div>
      <h1>Help Screen</h1>
      <p>This is the help screen where you can find assistance.</p>
        <Button title="Go Back" onPress={() => router.back()} />
    </div>
  );
}

export default HelpScreen;