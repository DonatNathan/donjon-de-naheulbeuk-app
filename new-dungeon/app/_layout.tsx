import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="pages/menu" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="pages/podcasts" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="pages/heros" options={{ headerShown: false, animation: "fade" }} />
    </Stack>
  );
}
