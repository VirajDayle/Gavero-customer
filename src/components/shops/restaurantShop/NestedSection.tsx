import React from "react";
import { Text, View } from "react-native";

import { FoodItemCard } from "./FoodItem";
import { NestedSection } from "./type";

type NestedSectionProps = {
  item: NestedSection;
  onItemPress?: (item: any) => void;
};

export const NestedSubSection = ({ subItem, onItemPress }: { subItem: any; onItemPress?: (item: any) => void }) => {
  return (
    <View className="mt-2">
      <View className="px-4 py-2 bg-white flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Text className="text-lg font-bold text-gray-800 tracking-tight">
            {subItem.name}
          </Text>
        </View>
      </View>

      <View>
        {subItem.data.map((foodItem: any) => (
          <FoodItemCard key={foodItem.id} item={foodItem} onPress={(i) => onItemPress?.(i)} />
        ))}
      </View>
    </View>
  );
};

const NestedSectionComponent = ({ item, onItemPress }: NestedSectionProps) => {
  return (
    <View>
      <View className="px-4 pt-4 pb-2 bg-white flex-row justify-between items-center border-b border-gray-100">
        <Text className="text-xl font-black text-gray-900 tracking-tight">{item.name}</Text>
      </View>

      {item.data.map((subItem) => (
        <NestedSubSection key={subItem.id} subItem={subItem} onItemPress={onItemPress} />
      ))}
    </View>
  );
};

export default NestedSectionComponent;
