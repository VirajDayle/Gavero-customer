import { TabBarProvider, useTabBar } from "@/src/context/TabBarContext";
import { TAB_ICONS } from "@/src/mockData/ui/tabs";
import { BottomTabBar } from "@react-navigation/bottom-tabs";
import { Tabs } from "expo-router";
import React from "react";
import { Image, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedTabBar = (props: any) => {
  const { hideProgress } = useTabBar();
  const insets = useSafeAreaInsets();

  const animatedStyle = useAnimatedStyle(() => {
    const translateY = interpolate(
      hideProgress.value,
      [0, 1],
      [0, 20],
      Extrapolation.CLAMP,
    );
    const opacity = interpolate(
      hideProgress.value,
      [0, 1],
      [1, 0],
      Extrapolation.CLAMP,
    );
    const scale = interpolate(
      hideProgress.value,
      [0, 1],
      [1, 0.95],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }, { scale }],
      opacity,
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    };
  });

  const animatedProps = useAnimatedProps(() => {
    return {
      pointerEvents: hideProgress.value > 0.5 ? "none" : "auto",
    } as any;
  });

  return (
    <>
      <Animated.View style={animatedStyle} animatedProps={animatedProps}>
        <BottomTabBar {...props} />
      </Animated.View>
    </>
  );
};

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
    <TabBarProvider>
      <Tabs
        tabBar={(props) => <AnimatedTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            paddingHorizontal: 14,
            elevation: 0,
            backgroundColor: "#ffffff",
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
        {/* <Tabs.Screen
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
      /> */}
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
    </TabBarProvider>
  );
};

export default TabLayout;
