import { TAB_ICONS } from "@/src/mockData/ui/tabs";
import { Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";

const TabLayout = () => {
  const TabIcon = ({ focused, activeIcon, deactiveIcon }: any) => {
    return (
      <View>
        <Image
          source={focused ? activeIcon : deactiveIcon}
          resizeMode="contain"
          style={{ width: 22, height: 22 }}
        />
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: "absolute",
          paddingHorizontal: 14,
          elevation: 0,
        },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            TabIcon({
              focused,
              activeIcon: TAB_ICONS.home.active,
              deactiveIcon: TAB_ICONS.home.deactive,
            }),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: "orders",
          headerShown: false,
          tabBarIcon: ({ focused }) =>
            TabIcon({
              focused,
              activeIcon: TAB_ICONS.orders.active,
              deactiveIcon: TAB_ICONS.orders.deactive,
            }),
        }}
      />
      <Tabs.Screen
        name="categories"
        options={{
          title: "Categeories",
          headerShown: false,
          headerTitleStyle: {
            color: "#FF0000",
          },
          tabBarIcon: ({ focused }) =>
            TabIcon({
              focused,
              activeIcon: TAB_ICONS.categeories.active,
              deactiveIcon: TAB_ICONS.categeories.deactive,
            }),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          headerTitleStyle: {
            color: "#FF0000",
          },
          tabBarIcon: ({ focused }) =>
            TabIcon({
              focused,
              activeIcon: TAB_ICONS.profile.active,
              deactiveIcon: TAB_ICONS.profile.deactive,
            }),
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
