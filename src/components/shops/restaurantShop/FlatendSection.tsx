import React from "react";
import { Text, View } from "react-native";

import { FoodItemCard } from "./FoodItem";
import { FlatSection } from "./type";

import { Item as FoodItem } from "./type";

type FlatendSectionProps = {
  item: FlatSection;
  onItemPress?: (item: FoodItem) => void;
};

const FlatendSection = ({ item, onItemPress }: FlatendSectionProps) => {
  return (
    <View>
      <View className="px-4 py-4 border-b border-gray-100 bg-white flex-row items-center justify-between">
        <Text className="text-xl font-black text-gray-900 tracking-tight">{item.name}</Text>
      </View>

      <View className="mx-2">
        {item.data?.map((foodItem) => (
          <FoodItemCard
            key={foodItem.id}
            item={foodItem as FoodItem}
            onPress={(i) => onItemPress?.(i)}
          />
        ))}
      </View>
    </View>
  );
};

export default FlatendSection;
