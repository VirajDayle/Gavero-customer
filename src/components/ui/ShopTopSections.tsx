import { ShopCategoryItem, ShopType } from "@/src/types";
import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";
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

const THIS_SHOP_CATEGORIES: ShopCategoryItem[] = [
  {
    id: "3",
    iconActive: require("@/src/assets/images/shopCategeory/restaurant.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Food",
    color: "#000000", // Tomato Red - perfect for food cravings
    textColor: "#FFFFFF",
    isActive: true,
  },
  {
    id: "1",
    iconActive: require("@/src/assets/images/shopCategeory/groceryActive.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Grocery",
    color: "#016630",
    textColor: "#FFFFFF",
    isActive: true,
  },
];

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

interface CategoryChipProps {
  item: ShopCategoryItem;
  isActive: boolean;
  onPress: () => void;
}

const CategoryChip = ({ item, isActive, onPress }: CategoryChipProps) => {
  const iconColor = isActive ? "#FFFFFF" : "#000000";
  const textColorClass = isActive ? "text-white" : "text-black";

  return (
    <Pressable
      className={clsx(
        "items-center justify-end w-18 rounded-t-2xl h-18 pb-1.5",
        isActive
          ? `border-t-[0.75] border-r-[0.75] border-l-[0.75] border-[#C0C0C0]`
          : "",
      )}
      style={{ backgroundColor: isActive ? item.color : "transparent" }}
      onPress={onPress}
    >
      {({ pressed }) => (
        <>
          <View
            className={clsx(
              "items-center justify-center h-11 w-11",
              pressed && "opacity-60",
            )}
          >
            {getCategoryIcon(item.title, iconColor, 28)}
          </View>
          <Text
            className={clsx(
              "text-[10px] text-center font-medium",
              textColorClass,
            )}
            numberOfLines={1}
          >
            {item.title}
          </Text>
          {isActive && (
            <View
              className={clsx(
                "absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl",
              )}
              style={{ backgroundColor: item.color }}
            />
          )}
        </>
      )}
    </Pressable>
  );
};

export default function ShopTopSections({
  currentShop,
  changeShop,
}: {
  currentShop: string;
  changeShop: (shop: ShopType) => void;
}) {
  return (
    <View className=" bg-white">
      <FlashList
        data={THIS_SHOP_CATEGORIES}
        horizontal
        estimatedItemSize={72}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <CategoryChip
            item={item}
            isActive={item.title === currentShop}
            onPress={() => changeShop(item.title as ShopType)}
          />
        )}
      />
    </View>
  );
}
