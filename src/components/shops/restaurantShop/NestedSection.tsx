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
      <View className="flex-row justify-between items-center bg-white py-0.5">
        <View className="flex-row items-center">
          <Text className="text-[15px] font-medium ml-3 text-gray-600">
            {subItem.name}
          </Text>
          {/* <View className="px-2 py-0.5 rounded-full ml-2">
            <Text className="text-[13px] font-semibold text-gray-600">
              {subItem.data.length}
            </Text>
          </View> */}
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
      <View className="flex-row justify-between items-center bg-white pt-2.5">
        <Text className="text-lg font-medium ml-3">{item.name}</Text>
      </View>

      {item.data.map((subItem) => (
        <NestedSubSection key={subItem.id} subItem={subItem} onItemPress={onItemPress} />
      ))}
    </View>
  );
};

export default NestedSectionComponent;
