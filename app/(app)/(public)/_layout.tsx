import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="otp"
        options={{
          headerShown: false,
          presentation: "formSheet",
          title: "",
          sheetAllowedDetents: [0.6],
          sheetCornerRadius: 16,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="TermSheet"
        options={{
          headerShown: false,
          presentation: "formSheet",
          title: "",
          sheetAllowedDetents: [0.7],
          sheetCornerRadius: 16,
          headerShadowVisible: false,
          gestureEnabled: false, // ← disable sheet swipe-to-dismiss entirely
          sheetGrabberVisible: false, // ← hide grabber so user isn't confused
        }}
      />
    </Stack>
  );
};

export default Layout;
