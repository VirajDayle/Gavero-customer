import React from "react";
import { FlatList, Text, View } from "react-native";
import { Item } from "./type";

import FoodCard from "./FoodCard";

interface ItemUnderProps {
  items: Item[];
  priceThreshold: number;
  onItemPress?: (item: Item) => void;
}

const ItemUnder: React.FC<ItemUnderProps> = ({
  items,
  priceThreshold,
  onItemPress,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <View className="py-4 bg-[#fefce8]">
      <View className="px-4 mb-3">
        <Text className="text-lg font-extrabold text-gray-900">
          Pocket Friendly
        </Text>
        {/* <Text className="text-sm font-medium text-gray-500">
          Delicious bites under ₹{priceThreshold}
        </Text> */}
      </View>

      <FlatList
        data={items}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => (
          <FoodCard
            item={item}
            className="w-[160px] mr-3"
            onPress={(i) => onItemPress?.(i)}
          />
        )}
      />
    </View>
  );
};

export default ItemUnder;
