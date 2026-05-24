import React from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import { ProductItem } from "@/src/mockData/search-shops";

interface HorizontalProductsProps {
  products: ProductItem[];
}

export default function HorizontalProducts({ products }: HorizontalProductsProps) {
  return (
    <View className="py-2">
      <FlatList
        horizontal
        data={products}
        keyExtractor={(p) => p.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        renderItem={({ item: p }) => (
          <View className="w-35 rounded-xl border border-gray-100 bg-white p-3 shadow-sm">
            <View className="h-28 w-full rounded-lg bg-gray-50 mb-3 overflow-hidden items-center justify-center">
              <Image
                source={p.imageSource}
                className="h-20 w-20"
                resizeMode="contain"
              />
            </View>
            <Text
              className="text-[13px] font-semibold text-gray-800 leading-tight"
              numberOfLines={2}
            >
              {p.name}
            </Text>
            <View className="flex-row items-center gap-1.5 mt-2">
              <Text className="text-[15px] font-bold text-gray-900">
                {p.price}
              </Text>
              {p.originalPrice && (
                <Text className="text-xs text-gray-400 line-through">
                  {p.originalPrice}
                </Text>
              )}
            </View>
            <Pressable className="mt-3 w-full bg-indigo-50 py-1.5 rounded-lg items-center justify-center active:opacity-70">
              <Text className="text-indigo-600 font-bold text-xs uppercase tracking-wide">
                Add
              </Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
