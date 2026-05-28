import type { CategoryProp } from "@/src/types/category";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface InternalCategoryProps {
  categories: CategoryProp[];
}

const InternalCategeory = ({ categories }: InternalCategoryProps) => {
  return (
    <View className="border-b-[1px] border-gray-200 pb-3 pt-2 -mt-1 bg-[#B7ECCD]">
      <FlashList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View className="w-1" />}
        renderItem={({ item }) => (
          <Pressable
            className="w-20 items-center"
            onPress={() => router.push("/(app)/(public)/shop-expand")}
          >
            <View className="h-20 w-20 items-center justify-center bg-white rounded-full border-[0.25] border-gray-400">
              <Image
                source={item.source}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <Text
              className="text-[9.5px] font-medium text-center"
              numberOfLines={2}
            >
              {item.title}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
};

export default InternalCategeory;
