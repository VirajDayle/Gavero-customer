import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { BrandItem } from "@/src/mockData/search-shops";

interface HorizontalBrandsProps {
  brands: BrandItem[];
}

export default function HorizontalBrands({ brands }: HorizontalBrandsProps) {
  return (
    <View className="py-2">
      <FlatList
        horizontal
        data={brands}
        keyExtractor={(b) => b.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 20 }}
        renderItem={({ item: b }) => (
          <View className="items-center gap-2">
            <View className="h-18 w-18 rounded-full border border-gray-100 bg-white items-center justify-center overflow-hidden shadow-sm">
              <Image
                source={b.imageSource}
                className="h-11 w-11"
                resizeMode="contain"
              />
            </View>
            <Text className="text-xs font-semibold text-gray-700">
              {b.name}
            </Text>
          </View>
        )}
      />
    </View>
  );
}
