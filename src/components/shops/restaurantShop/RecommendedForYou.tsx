import React from "react";
import { Text, View } from "react-native";
import { Item } from "./type";

import FoodCard from "./FoodCard";

interface RecommendedForYouProps {
  items: Item[];
  onItemPress?: (item: Item) => void;
}

const RecommendedForYou: React.FC<RecommendedForYouProps> = ({
  items,
  onItemPress,
}) => {
  if (!items || items.length === 0) return null;

  return (
    <View className="py-2 px-4 bg-white mt-2">
      <View className="mb-4">
        <Text className="text-xl font-extrabold text-gray-900">
          Recommended for you
        </Text>
        {/* <Text className="text-sm font-medium text-gray-500">
          Top picks based on your taste
        </Text> */}
      </View>

      <View className="flex-row flex-wrap justify-between">
        {items.map((item, index) => (
          <FoodCard
            key={`${item.id}-${index}`}
            item={item}
            className="w-[160px] mb-4"
            onPress={(i) => onItemPress?.(i)}
          />
        ))}
      </View>
    </View>
  );
};

export default RecommendedForYou;
