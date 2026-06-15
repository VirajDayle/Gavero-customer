import { SHOP_CATEGORIES } from "@/src/mockData/shops/shopCategories";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

export default function ComingSoonCategories() {
  const upcomingCategories = SHOP_CATEGORIES.filter((c) => !c.isActive);

  return (
    <View className="flex-1 bg-white items-center justify-center px-6 pb-8">
      <Animated.View entering={FadeInUp.delay(100).springify()}>
        <LinearGradient
          colors={["#fdf4ff", "#f5d0fe"]}
          style={{ borderRadius: 22 }}
          className="w-44 h-44 p-3 flex-row flex-wrap justify-between  mb-8 mt-2 "
        >
          {upcomingCategories.slice(0, 4).map((cat, index) => (
            <View
              key={cat.id}
              className={`w-[48%] h-[48%] bg-white rounded-2xl items-center justify-center ${
                index < 2 ? "mb-[4%]" : ""
              }`}
            >
              <Image
                source={cat.iconActive}
                className="w-12 h-12 opacity-90"
                resizeMode="contain"
              />
            </View>
          ))}
        </LinearGradient>
      </Animated.View>

      <Animated.View
        entering={FadeInDown.delay(200).springify()}
        className="items-center w-full"
      >
        <Text className="text-2xl font-extrabold text-gray-900 mb-3 text-center tracking-tight">
          Arriving Soon!
        </Text>
        <Text className="text-gray-500 text-base text-center mb-10 leading-relaxed px-2">
          We're constantly working on bringing you more amazing options. Stay
          tuned for exciting new categories!
        </Text>

        <Pressable
          onPress={() => router.back()}
          className="w-full bg-gray-900 h-14 rounded-2xl items-center justify-center active:bg-gray-800 shadow-md shadow-gray-300"
        >
          <Text className="text-white text-base font-bold">Got it</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
