import { SHOP_CATEGORIES } from "@/src/mockData/shops/shopCategories";
import { ShopCategoryItem, ShopType } from "@/src/types";
import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface CategoryChipProps {
  item: ShopCategoryItem;
  isActive: boolean;
  onPress: () => void;
}

const CategoryChip = ({ item, isActive, onPress }: CategoryChipProps) => {
  return (
    <Pressable
      className={clsx(
        "items-center justify-end w-18 rounded-t-2xl h-18 pb-1.5", // ← justify-end
        isActive
          ? `border-t-[0.75] border-r-[0.75] border-l-[0.75] border-[#C0C0C0]`
          : "",
      )}
      style={{ backgroundColor: isActive ? item.color : "transparent" }}
      onPress={onPress} // ← no router.push here anymore
    >
      {({ pressed }) => (
        <>
          <Image
            source={item.iconActive}
            className={clsx(
              isActive ? "h-11 w-11" : "h-11 w-11",
              pressed && "opacity-90",
            )}
            resizeMode="contain"
          />
          <Text
            className={clsx("text-[10px] text-center font-medium")}
            style={{
              color: isActive && item.textColor ? item.textColor : "#111827",
            }}
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
        data={SHOP_CATEGORIES}
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
