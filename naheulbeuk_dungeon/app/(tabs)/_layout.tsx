import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} >
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="podcasts" options={{ title: 'Podcasts' }} />
      <Stack.Screen name="heros" options={{ title: 'Heros' }} /> 
    </Stack>
  );
}
