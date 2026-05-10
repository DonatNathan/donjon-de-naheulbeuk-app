import BottomBar from '@/components/bottom_bar';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }} >
        <Stack.Screen name="index" options={{ title: 'Home' }} />
        <Stack.Screen name="podcasts" options={{ title: 'Podcasts' }} />
        <Stack.Screen name="heros" options={{ title: 'Heros' }} />
      </Stack>
      <BottomBar />
    </SafeAreaProvider>
  );
}
