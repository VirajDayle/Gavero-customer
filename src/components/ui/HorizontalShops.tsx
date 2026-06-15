import type { ShopItem } from "@/src/types/search";
import { Ionicons } from "@expo/vector-icons";
import { Heart } from "lucide-react-native";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface HorizontalShopsProps {
  shops: ShopItem[];
}

export default function HorizontalShops({ shops }: HorizontalShopsProps) {
  return (
    <View className="py-4 bg-green-200">
      <FlashList
        horizontal
        data={shops}
        estimatedItemSize={180}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View className="w-4" />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/shop-page",
                params: { shopType: "Grocery" },
              })
            }
            className="relative w-[180px] rounded-lg border border-gray-100 bg-white p-2 shadow-sm"
          >
            <View className="absolute right-2 top-2 z-10 flex-row items-center gap-2">
              {item.rating ? (
                <View className="flex-row items-center justify-center gap-0.5 rounded bg-green-700 px-1 py-[2px]">
                  <Text className="text-[9px] font-bold text-white">
                    {Number(item.rating).toFixed(1)}
                  </Text>
                  <Ionicons name="star" size={8} color="#fcd34d" />
                </View>
              ) : null}
              <Pressable
                onPress={(e) => {
                  e.stopPropagation();
                  // Handle save if needed
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                accessibilityRole="checkbox"
              >
                <Heart
                  size={18}
                  color={item.isSaved ? "#EF4444" : "#1f2937"}
                  strokeWidth={1.5}
                  fill={item.isSaved ? "#EF4444" : "transparent"}
                />
              </Pressable>
            </View>

            <View className="items-center justify-center pt-2 pb-1">
              <View className="h-16 w-16 overflow-hidden rounded-full border border-gray-100 bg-gray-50 shadow-sm">
                <Image
                  source={item.imageSource}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
            </View>
            <View className="mt-2 flex-1 items-center gap-1.5">
              <Text
                className="text-center text-[14.5px] font-bold text-gray-900"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <View className="flex-row items-center justify-center gap-1.5">
                <View className="flex-row items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
                  <Ionicons name="time-outline" size={13} color="#6B7280" />
                  <Text className="text-xs font-medium text-gray-600">
                    {item.deliveryTime}
                  </Text>
                </View>
                <View className="h-1 w-1 rounded-full bg-gray-300" />
                <Text className="text-xs text-gray-500">{item.distance}</Text>
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
