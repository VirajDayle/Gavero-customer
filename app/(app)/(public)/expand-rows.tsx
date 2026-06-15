import ExpandRows from "@/src/components/shops/groceryShop/ExpandRows";
import { GROCERY_SECTIONS } from "@/src/mockData/grocery/sections";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const ExpandRowsPage = () => {
  const { sectionId } = useLocalSearchParams<{ sectionId: string }>();

  // Find the top deal section by ID
  const section = GROCERY_SECTIONS.find((s) => s.id === sectionId);

  if (!section || section.type !== "topDeal") {
    return (
      <SafeAreaView className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-500 font-medium">Items not found.</Text>
        <Pressable
          className="mt-4 px-4 py-2 bg-orange-100 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-orange-600 font-bold">Go Back</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header with back button */}
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100 relative">
        <Pressable
          className="absolute left-4 z-10 h-10 w-10 items-center justify-center rounded-full bg-gray-50 active:bg-gray-100"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-bold text-gray-900 tracking-tight">
            {section.title || "All Items"}
          </Text>
        </View>
      </View>

      <ExpandRows title="" products={section.data} />
    </SafeAreaView>
  );
};

export default ExpandRowsPage;
