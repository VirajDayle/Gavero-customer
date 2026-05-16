import HomeHeader from "@/src/components/tabs/HomeHeader";
import { styled } from "nativewind";
import React from "react";
import { View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const home = () => {
  return (
    <SafeAreaView className="flex-1">
      <HomeHeader />
      <View className="border-b border-gray-100" />
    </SafeAreaView>
  );
};

export default home;
