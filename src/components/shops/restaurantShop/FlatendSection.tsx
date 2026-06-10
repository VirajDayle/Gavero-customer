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
      <View className="flex-row justify-between items-center bg-white py-2.5">
        <View className="flex-row">
          <Text className="text-lg font-medium ml-3">{item.name}</Text>
          {/* <Text className="text-lg font-medium ml-2">{item.data.length}</Text> */}
        </View>
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
