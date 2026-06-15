import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { Heart } from "lucide-react-native";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

export interface ShopCardProps {
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
  rating,
  isSaved,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={isClosed}
      className={clsx(
        "flex-row items-start gap-3 px-4 py-3",
        // isClosed && "opacity-55",
        "active:bg-gray-100",
      )}
    >
      {/* Left — shop image */}
      <View className="mt-0.5 h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
        <Image
          source={imageSource}
          className="h-full w-full"
          resizeMode="cover"
        />
      </View>

      {/* Center — info */}
      <View className="flex-1 gap-1.5 min-w-0">
        <View className="flex-row items-center justify-between ">
          <Text
            className="flex-1 text-[14.5px] font-bold text-gray-900 pr-2"
            numberOfLines={1}
          >
            {name}
          </Text>
          <View className="flex-row items-center gap-2">
            {rating ? (
              <View className="flex-row items-center bg-green-700 px-1 py-[2px] rounded gap-0.5 justify-center">
                <Text className="text-[9px] font-bold text-white">
                  {Number(rating).toFixed(1)}
                </Text>
                <Ionicons name="star" size={8} color="#fcd34d" />
              </View>
            ) : null}
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                onSavePress && onSavePress();
              }}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              accessibilityRole="checkbox"
            >
              <Heart
                size={18}
                color={isSaved ? "#EF4444" : "#1f2937"}
                strokeWidth={1.5}
                fill={isSaved ? "#EF4444" : "transparent"}
              />
            </Pressable>
          </View>
        </View>
        {/* 
        {tagline && (
          <Text className="text-xs text-gray-400" numberOfLines={1}>
            {tagline}
          </Text>
        )} */}

        <View className="flex-row items-center gap-1.5 mt-0.5">
          <View className="flex-row items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
            <Ionicons name="time-outline" size={13} color="#6B7280" />
            <Text className="text-xs font-medium text-gray-600">
              {deliveryTime}
            </Text>
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
    </Pressable>
  );
};

export default ShopCard;
