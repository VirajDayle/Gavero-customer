import { Stack } from "expo-router";
import React from "react";

const RootNav = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(public)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="main-search"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
          animationDuration: 100,
        }}
      />
      <Stack.Screen
        name="select-address"
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
