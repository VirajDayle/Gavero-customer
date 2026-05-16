import { Stack } from "expo-router";
import React from "react";

const RootNav = () => {
  return (
    <Stack
      screenOptions={{
        statusBarStyle: "dark",
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="selectAddress"
        options={{
          headerShown: false,
          presentation: "transparentModal", // ✅ correct
          animation: "slide_from_bottom", // 👈 add this for smooth feel
        }}
      />
    </Stack>
  );
};

export default RootNav;
