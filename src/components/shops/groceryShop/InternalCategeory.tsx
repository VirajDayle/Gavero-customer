import type { CategoryProp } from "@/src/types/category";
import { router } from "expo-router";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

interface InternalCategoryProps {
  categories: CategoryProp[];
}

const InternalCategeory = ({ categories }: InternalCategoryProps) => {
  return (
    <>
      <View className="pt-3 -mt-1 bg-green-800 relative">
        <View className="flex-row flex-wrap px-2">
          {categories.slice(0, 10).map((item) => (
            <Pressable
              key={item.id}
              className="w-1/5 items-center mb-4 px-1"
              onPress={() =>
                router.push({
                  pathname: "/(app)/(public)/shop-expand",
                  params: { categoryId: item.id },
                })
              }
            >
              <View className="w-18 h-20 items-center justify-center bg-white rounded-xl overflow-hidden shadow-sm shadow-black/10">
                {typeof item.source === "string" ? (
                  <Image
                    source={{ uri: item.source }}
                    className="h-full w-full"
                    resizeMode="contain"
                  />
                ) : (
                  <Image
                    source={item.source}
                    className="h-full w-full"
                    resizeMode="contain"
                  />
                )}
              </View>
              <Text
                className="text-[10px] font-bold text-center text-white mt-1.5 leading-tight"
                numberOfLines={2}
              >
                {item.title}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </>
  );
};

export default InternalCategeory;
