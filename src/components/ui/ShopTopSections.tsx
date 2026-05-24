import React from "react";
import { Text, View } from "react-native";
import { MOCK_BRANDS, MOCK_PRODUCTS } from "@/src/mockData/search-shops";
import HorizontalBrands from "./HorizontalBrands";
import HorizontalProducts from "./HorizontalProducts";

export default function ShopTopSections() {
  return (
    <View>
      <View className="flex-row items-center py-4 px-1">
        <View className="mx-4 flex-row items-center gap-2">
          <Text className="text-[16px] font-bold text-gray-900 ">
            Top Brands
          </Text>
        </View>
      </View>
      <HorizontalBrands brands={MOCK_BRANDS} />

      <View className="flex-row items-center py-4 px-1 mt-2">
        <View className="mx-4 flex-row items-center gap-2">
          <Text className="text-[16px] font-bold text-gray-900 ">
            Trending Products
          </Text>
        </View>
      </View>
      <HorizontalProducts products={MOCK_PRODUCTS} />
    </View>
  );
}
