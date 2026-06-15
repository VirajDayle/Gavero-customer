import React from "react";
import {
  Image,
  Share as RNShare,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddCart from "../groceryShop/AddCart";

// Assuming these types are imported from your types file
import clsx from "clsx";
import { Bookmark, Share } from "lucide-react-native";
import { Item } from "./type";

interface FoodItemCardProps {
  item: Item;
  onPress?: (item: Item) => void;
  onAddPress?: (item: Item) => void;
  hideAddButton?: boolean;
  hideBorder?: boolean;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  onPress,
  onAddPress,
  hideAddButton,
  hideBorder,
}) => {
  const {
    name,
    description,
    price,
    currency,
    dietaryType,
    image,
    isAvailable,
  } = item;

  const isVeg = dietaryType === "VEG";
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress?.(item)}
      disabled={!isAvailable}
      className={`flex-row justify-between py-4 px-4 bg-white ${hideBorder ? "" : "border-b border-gray-100"} ${!isAvailable ? "opacity-60" : ""}`}
    >
      {/* Left Column: Details */}
      <View className="flex-1 pr-4 justify-between">
        <View>
          {/* Dietary Indicator Badge */}
          <View className="flex-row items-center mb-1.5">
            <View
              className={clsx(
                `border w-4 h-4 items-center justify-center rounded-sm mr-1.5`,
                isVeg ? "border-green-600" : "border-red-600",
              )}
            >
              <View
                className={`w-2 h-2 rounded-full ${isVeg ? "bg-green-600" : "bg-red-600"}`}
              />
            </View>
            <Text className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              {dietaryType}
            </Text>
          </View>

          {/* Item Name */}
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
          {/* Description */}
          {description && (
            <Text
              className="text-sm text-gray-600 leading-snug"
              numberOfLines={2}
            >
              {description}
            </Text>
          )}

          <View className="flex-row items-center justify-start gap-3 mt-3 mb-1">
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
              onPress={async (e) => {
                e.stopPropagation();
                try {
                  await RNShare.share({
                    message: `Check out ${name} on Gavero!\n\nPrice: ${currency}${price}\n\nOrder now on Gavero app!`,
                    title: "Share Food",
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <Share size={15} color="#4B5563" strokeWidth={2.2} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Right Column: Image & Action Button */}
      <View className="relative w-35 h-35 ml-2">
        {image ? (
          <Image
            source={typeof image === "string" ? { uri: image } : image}
            className="w-full h-full rounded-xl bg-gray-100"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-full rounded-xl bg-gray-100 items-center justify-center">
            <Text className="text-xs text-gray-400">No Image</Text>
          </View>
        )}

        {/* CTA Button overlayed beautifully at the bottom center of the image */}
        {isAvailable ? (
          !hideAddButton && (
            <View className="absolute bottom-1 -right-6 ">
              <AddCart horizontal color="bg-zinc-800" />
            </View>
          )
        ) : (
          <View className="absolute -bottom-2.5 left-2 right-2 bg-gray-200 rounded-lg py-1 items-center justify-center">
            <Text className="text-[10px] font-bold text-gray-500 uppercase">
              Out of Stock
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Precise shadow control for premium iOS/Android look
const styles = StyleSheet.create({
  buttonShadow: {
    shadowColor: "#16a34a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
});
