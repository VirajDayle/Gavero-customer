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
      <Stack.Screen
        name="cart"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="view-cart"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="apply-coupon"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="big-grocery"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="grocery-bigImages"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
          presentation: "modal",
        }}
      />
      <Stack.Screen
        name="message-box"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="expand-order"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="order-summary"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="help-support"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="manage-addresses"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="payment-methods"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="my-favorites"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="about-us"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="save-products"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="gavero-coins"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
      <Stack.Screen
        name="edit-profile"
        options={{
          headerShown: false,
          statusBarStyle: "dark",
        }}
      />
    </Stack>
  );
};

export default Layout;
