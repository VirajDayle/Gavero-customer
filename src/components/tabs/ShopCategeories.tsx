import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

type Item = {
  id: string;
  iconActive: ImageSourcePropType;
  icon: ImageSourcePropType;
  title: string;
};

interface ShopCategoriesProps {
  className?: string;
  items: Item[];
}

interface CategoryChipProps {
  item: Item;
}

const CategoryChip = ({ item }: CategoryChipProps) => {
  return (
    <Pressable
      className="items-center"
      onPress={() => router.push("/(app)/(public)/search-shops")}
    >
      {({ pressed }) => (
        <>
          <Image
            source={item.iconActive}
            className={clsx("h-11.5 w-11.5", pressed && "opacity-90")}
            resizeMode="contain"
          />

          <Text
            className="text-label text-xs mt-1 text-center"
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
      />
    </View>
  );
};

export default ShopCategories;
