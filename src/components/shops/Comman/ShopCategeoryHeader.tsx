import { ShopCategoryItem, ShopType } from "@/src/types";
import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

const ACTIVE_CATEGORY: ShopCategoryItem[] = [
  {
    id: "1",
    iconActive: require("@/src/assets/images/shopCategeory/groceryActive.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Grocery",
    color: "#B7ECCD",
  },
  {
    id: "2",
    iconActive: require("@/src/assets/images/shopCategeory/restaurant.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Restaurant",
    color: "#121212",
  },
];

interface CategoryChipProps {
  item: ShopCategoryItem;
  isActive: boolean;
  onPress: () => void;
}

const CategoryChip = ({ item, isActive, onPress }: CategoryChipProps) => {
  return (
    <Pressable
      className={clsx(
        "items-center justify-end w-18 h-17 rounded-t-2xl",
        isActive
          ? "border-t-[0.75] border-r-[0.75] border-l-[0.75] border-[#C0C0C0]"
          : "bg-transparent"
      )}
      style={{ backgroundColor: isActive ? item.color : "transparent" }}
      onPress={onPress}
    >
      {({ pressed }) => (
        <>
          <Image
            source={item.iconActive}
            className={clsx(
              isActive ? "h-11 w-11" : "h-9 w-9",
              pressed && "opacity-90"
            )}
            resizeMode="contain"
          />
          <Text
            className={clsx(
              "text-[10px] text-center",
              isActive ? "font-bold text-gray-900" : "font-medium text-gray-500"
            )}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

interface ShopCategoryHeaderProps {
  currentShop: ShopType;
  onShopChange: (shop: ShopType) => void;
}

const ShopCategeoryHeader = ({ currentShop, onShopChange }: ShopCategoryHeaderProps) => {
  return (
    <View className="-mb-0.5 z-10" style={{ backgroundColor: "white" }}>
      <FlashList
        data={ACTIVE_CATEGORY}
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
            onPress={() => onShopChange(item.title as ShopType)}
          />
        )}
      />
    </View>
  );
};

export default ShopCategeoryHeader;