import VerticalExpanedShops from "@/src/components/shops/groceryShop/VerticalExpanedShops";
import { GROCERY_CATEGORIES } from "@/src/mockData/grocery/groceryCategories";
import { useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const ShopExpand = () => {
  const { categoryId } = useLocalSearchParams<{ categoryId: string }>();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <VerticalExpanedShops
        data={GROCERY_CATEGORIES}
        initialTopId={categoryId}
      />
    </SafeAreaView>
  );
};

export default ShopExpand;
