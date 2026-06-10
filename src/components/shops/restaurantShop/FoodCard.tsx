import clsx from "clsx";
import { Bookmark, Share } from "lucide-react-native";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import AddCart from "../groceryShop/AddCart";
import { Item } from "./type";

export interface FoodCardProps {
  item: Item;
  onPress?: (item: Item) => void;
  className?: string;
}

const FoodCard: React.FC<FoodCardProps> = ({ item, onPress, className }) => {
  const {
    name,
    price,
    currency,
    dietaryType,
    image,
    isAvailable,
    description,
  } = item;
  const isVeg = dietaryType === "VEG" || dietaryType === "VEGAN";

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress?.(item)}
      disabled={!isAvailable}
      className={clsx(
        "bg-white rounded-2xl p-1 shadow-sm border border-gray-100",
        !isAvailable && "opacity-60",
        className,
      )}
    >
      {/* Image area */}
      <View className="bg-gray-50 h-32 items-center justify-center relative rounded-xl">
        {image ? (
          <View className="h-full w-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
            <Image
              source={typeof image === "string" ? { uri: image } : image}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        ) : (
          <View className="w-20 h-20 bg-gray-100 rounded-xl" />
        )}

        {!isAvailable && (
          <View className="absolute bg-white/90 border border-red-500 px-2 py-1 rounded shadow-sm">
            <Text className="text-[10px] text-red-600 font-extrabold tracking-widest uppercase text-center">
              Out of Stock
            </Text>
          </View>
        )}

        {/* Dietary Indicator Badge - absolute over image */}
        <View className="absolute top-2 left-2 bg-white/90 rounded-md p-1 backdrop-blur-sm shadow-sm">
          <View
            className={clsx(
              `border w-3 h-3 items-center justify-center rounded-sm`,
              isVeg ? "border-green-600" : "border-red-600",
            )}
          >
            <View
              className={`w-1.5 h-1.5 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`}
            />
          </View>
        </View>

        {/* AddCart Button positioned relative to Image area */}
        {isAvailable && (
          <View
            className="absolute -bottom-5 right-1 shadow-sm shadow-black/10 z-10"
            pointerEvents="box-none"
          >
            <AddCart color="bg-zinc-800" />
          </View>
        )}
      </View>

      {/* <View className="bg-gray-100 border border-gray-200 -mt-2 px-2 py-0.5 rounded-br-md shadow-sm shadow-black/5 self-start">
        <Text className="text-[9px] font-semibold text-gray-600 tracking-wide">
          1 Serving
        </Text>
      </View> */}

      {/* Info area */}
      <View className="px-1 pb-1 pt-1 mt-1">
        <Text
          className="text-lg font-bold text-gray-800 leading-tight mb-1"
          numberOfLines={1}
        >
          {name}
        </Text>

        <Text className="text-base font-semibold text-gray-900">
          {currency}
          {price.toFixed(2)}
        </Text>

        <Text
          className="text-sm text-gray-600 leading-snug h-10"
          numberOfLines={2}
        >
          {description}
        </Text>

        <View className="flex-row items-center justify-start gap-3 mt-2 mb-1">
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-1"
            onPress={(e) => {
              e.stopPropagation();
              // Add save logic here
            }}
          >
            <Bookmark size={15} color="#4B5563" strokeWidth={2.2} />
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            className="p-1"
            onPress={(e) => {
              e.stopPropagation();
              // Add share logic here
            }}
          >
            <Share size={15} color="#4B5563" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FoodCard;
