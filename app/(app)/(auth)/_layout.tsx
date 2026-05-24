import { Stack } from "expo-router";
import React from "react";

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="complete-profile"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
    </Stack>
  );
};

export default Layout;
