import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";
import { router } from "expo-router";
import {
  PawPrint,
  PenTool,
  Pill,
  ShoppingBasket,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react-native";
import React from "react";
import { Pressable, Text, View } from "react-native";

type Item = {
  id: string;
  title: string;
  isActive?: boolean;
  color?: string;
};

interface ShopCategoriesProps {
  className?: string;
  items: Item[];
}

interface CategoryChipProps {
  item: Item;
}

const getCategoryIcon = (title: string, color: string, size: number) => {
  const props = { size, color, strokeWidth: 2 };
  switch (title.toLowerCase()) {
    case "food":
      return <UtensilsCrossed {...props} />;
    case "grocery":
      return <ShoppingBasket {...props} />;
    case "pharmacy":
      return <Pill {...props} />;
    case "stationary":
      return <PenTool {...props} />;
    case "cosmetics":
      return <Sparkles {...props} />;
    case "petfood":
      return <PawPrint {...props} />;
    default:
      return <ShoppingBasket {...props} />;
  }
};

const CategoryChip = ({ item }: CategoryChipProps) => {
  // Enforce all icons to be black
  const iconColor = "#000000";

  return (
    <Pressable
      className="items-center"
      onPress={() => {
        if (item.isActive) {
          router.push({
            pathname: "/(app)/(public)/search-shops",
            params: { shopType: item.title },
          });
        } else {
          router.push("/(app)/(public)/coming-soon-categories");
        }
      }}
    >
      {({ pressed }) => (
        <>
          <View
            className={clsx(
              "items-center justify-center h-12 w-12",
              pressed && "opacity-60",
            )}
          >
            {getCategoryIcon(item.title, iconColor, 28)}
          </View>

          <Text
            className="text-xs text-center font-medium text-black"
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const ShopCategories = ({ className, items }: ShopCategoriesProps) => {
  return (
    <View className={clsx(className)}>
      <FlashList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          paddingHorizontal: 0,
        }}
        ItemSeparatorComponent={() => <View className="w-3" />}
        renderItem={({ item }) => <CategoryChip item={item} />}
        estimatedItemSize={60}
      />
    </View>
  );
};

export default ShopCategories;
