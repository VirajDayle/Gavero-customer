import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import React from "react";
import { Image, ImageSourcePropType, Pressable, Text, View } from "react-native";

interface ShopCardProps {
  name: string;
  tagline?: string;
  rating: number;
  reviews: number;
  distance: string;
  deliveryTime: string;
  tags: string[];
  imageSource: ImageSourcePropType;
  isFastest?: boolean;
  isClosed?: boolean;
  couponCode?: string;
  isSaved?: boolean;
  onSavePress?: () => void;
  onPress?: () => void;
}

const ShopCard: React.FC<ShopCardProps> = ({
  name,
  tagline,
  distance,
  deliveryTime,
  imageSource,
  isFastest,
  isClosed,
  couponCode,
  onSavePress,
  onPress,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={isClosed}
      className={clsx(
        "flex-row items-start gap-3 px-4 py-3",
        // isClosed && "opacity-55",
        "active:bg-gray-100"
      )}
    >
      {/* Left — shop image */}
      <View className="mt-0.5 h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
        <Image source={imageSource} className="h-full w-full" resizeMode="cover" />
      </View>

      {/* Center — info */}
      <View className="flex-1 gap-1.5 min-w-0">
        <Text className="text-[14.5px] font-bold text-gray-900" numberOfLines={1}>
          {name}
        </Text>
        {/* 
        {tagline && (
          <Text className="text-xs text-gray-400" numberOfLines={1}>
            {tagline}
          </Text>
        )} */}

        <View className="flex-row items-center gap-1.5">
          <View className="flex-row items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
            <Ionicons name="time-outline" size={13} color="#6B7280" />
            <Text className="text-xs font-medium text-gray-600">{deliveryTime}</Text>
          </View>
          <View className="h-1 w-1 rounded-full bg-gray-300" />
          <Text className="text-xs text-gray-500">{distance}</Text>
        </View>

        {/* {couponCode && !isClosed && (
          <View className="flex-row items-center gap-1 self-start rounded border border-dashed border-blue-300 bg-blue-50 px-2 py-0.5">
            <Ionicons name="pricetag-outline" size={11} color="#1D4ED8" />
            <Text className="text-[11px] font-bold uppercase tracking-wide text-blue-700">
              {couponCode}
            </Text>
          </View>
        )} */}
      </View>

      {/* Right — status badge */}
      <View className="items-end pt-0.5">
        {isFastest && !isClosed && (
          <Pressable onPress={onSavePress} hitSlop={10}>
            <View className="h-7 w-7 items-center justify-center rounded-full bg-indigo-50">
              <Ionicons name="flash" size={16} color="#3730A3" />
            </View>
          </Pressable>
        )}

      </View>
    </Pressable>
  );
};

export default ShopCard;