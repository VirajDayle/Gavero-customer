import VerticalExpanedShops from "@/src/components/shops/groceryShop/VerticalExpanedShops";
import ScreenView from "@/src/components/ui/ScreenView";
import { GROCERY_CATEGORIES } from "@/src/mockData/grocery/groceryCategories";
import { useLocalSearchParams } from "expo-router";
import React from "react";

const ShopExpand = () => {
  const { categoryId, subCategoryId } = useLocalSearchParams<{
    categoryId: string;
    subCategoryId?: string;
  }>();

  return (
    <ScreenView>
      <VerticalExpanedShops
        data={GROCERY_CATEGORIES}
        initialTopId={categoryId}
        initialSubId={subCategoryId}
      />
    </ScreenView>
  );
};

export default ShopExpand;
