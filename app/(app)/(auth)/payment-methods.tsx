import Header from "@/src/components/ui/Header";
import { styled } from "nativewind";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const PaymentMethods = () => {
  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF7]">
      <Header title="Payment Methods" back border />
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500 text-base font-medium">Coming Soon</Text>
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethods;
