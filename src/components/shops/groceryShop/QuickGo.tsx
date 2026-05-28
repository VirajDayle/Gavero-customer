import React from "react";
import { Pressable, Text, View } from "react-native";

interface QuickGoProps {
  title: string;
  categories: { id: string; name: string }[];
  onCategoryPress: (id: string) => void;
}

const QuickGo = ({ title, categories, onCategoryPress }: QuickGoProps) => {
  return (
    <View className="px-4 py-2">
      <View className="bg-blue-50 rounded-2xl p-4 border border-blue-100 shadow-sm shadow-blue-200/50">
        <Text className="text-lg font-bold text-blue-900 mb-3 tracking-tight">
          {title}
        </Text>
        <View className="flex-row flex-wrap justify-between gap-y-4">
          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => onCategoryPress(cat.id)}
              className="w-[22%] items-center"
            >
              <View className="w-full aspect-square border border-dashed border-blue-300 rounded-xl bg-blue-50/30 mb-1.5 shadow-sm shadow-blue-200/20" />
              <Text 
                className="text-[10px] font-semibold text-center text-blue-800 leading-tight"
                numberOfLines={2}
              >
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
};

export default QuickGo;
