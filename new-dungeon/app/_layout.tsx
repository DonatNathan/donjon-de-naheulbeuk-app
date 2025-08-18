import { Stack } from "expo-router";
import { useEffect } from "react";
import * as NavigationBar from "expo-navigation-bar";

export default function RootLayout() {

  useEffect(() => {
    NavigationBar.setVisibilityAsync("hidden");
  }, []);

  return (
    <Stack> 
      <Stack.Screen name="pages/menu" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="pages/podcasts" options={{ headerShown: false, animation: "fade" }} />
      <Stack.Screen name="pages/heros" options={{ headerShown: false, animation: "fade" }} />
    </Stack>
  );
}
