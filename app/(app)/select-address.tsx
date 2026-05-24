import { styled } from "nativewind";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const selectAddress = () => {
  return (
    <SafeAreaView className="flex-1">
      <View className="bg-black mx-8 h-full rounded-xl border-2 border-amber-200">
        <Text>selectAddress</Text>
      </View>
    </SafeAreaView>
  );
};

export default selectAddress;
