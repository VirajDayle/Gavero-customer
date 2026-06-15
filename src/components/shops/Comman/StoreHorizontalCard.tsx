import { Ionicons } from "@expo/vector-icons";
import {
  PawPrint,
  PenTool,
  Pill,
  ShoppingBasket,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react-native";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  Pressable,
  Text,
  View,
} from "react-native";

export interface SubFace {
  id: string;
  name: string;
  type: "grocery" | "food" | "pharmacy" | string;
}

const getCategoryIcon = (title: string, color: string, size: number) => {
  const props = { size, color, strokeWidth: 2 };
  switch (title.toLowerCase()) {
    case "food":
      return <UtensilsCrossed {...props} />;
    case "grocery":
      return <ShoppingBasket {...props} />;
    case "pharmacy":
      return <Pill {...props} />;
    case "stationary":
      return <PenTool {...props} />;
    case "cosmetics":
      return <Sparkles {...props} />;
    case "petfood":
      return <PawPrint {...props} />;
    default:
      return <ShoppingBasket {...props} />;
  }
};

export interface StoreHorizontalCardProps {
  storeName: string;
  rating: number;
  deliveryTime: string;
  distance: string;
  image: ImageSourcePropType | { uri: string };
  bannerImage?: ImageSourcePropType | { uri: string };
  subFaces: SubFace[];
  onPress?: () => void;
}

const StoreHorizontalCard = ({
  storeName,
  rating,
  deliveryTime,
  distance,
  image,
  bannerImage,
  subFaces,
  onPress,
}: StoreHorizontalCardProps) => {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white border border-gray-200 active:opacity-80 rounded-xl mx-4 overflow-hidden relative"
    >
      {/* Top Banner */}
      <View className="h-26 w-full bg-gray-200 overflow-hidden border border-gray-100">
        {bannerImage ? (
          <Image
            source={bannerImage}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <View className="flex-row w-full h-full">
            {[...Array(21)].map((_, i) => (
              <View
                key={i}
                style={{
                  flex: 1,
                  backgroundColor: i % 2 === 0 ? "#f87171" : "#ffffff",
                }}
              />
            ))}
          </View>
        )}
      </View>

      {/* Center Logo overlapping banner bottom */}
      <View className="absolute left-1/2 top-[60px] -ml-[36px] z-10 rounded-full bg-white p-1 shadow-sm">
        <View className="h-16 w-16 bg-gray-50 border border-gray-100 rounded-full overflow-hidden">
          <Image source={image} className="w-full h-full" resizeMode="cover" />
        </View>
      </View>

      {/* Content below logo */}
      <View className="px-4 pb-5 pt-12 items-center">
        <Text
          className="text-[17px] font-bold text-gray-900 text-center"
          numberOfLines={1}
        >
          {storeName}
        </Text>

        {/* Time, Distance (Rating removed per request) */}
        <View className="flex-row items-center mt-1.5 gap-1.5 justify-center">
          <View className="flex-row items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
            <Ionicons name="time-outline" size={13} color="#6B7280" />
            <Text className="text-xs font-medium text-gray-600">
              {deliveryTime}
            </Text>
          </View>
          <View className="h-1 w-1 rounded-full bg-gray-300" />
          <Text className="text-xs font-medium text-gray-500">{distance}</Text>
        </View>

        {/* SubFaces */}
        <View className="flex-row items-center mt-3 gap-2 flex-wrap justify-center">
          {subFaces.map((face) => (
            <View
              key={face.id}
              className="items-center justify-center bg-gray-50 border border-gray-200 h-9 w-9 rounded-lg"
            >
              {getCategoryIcon(face.type, "#000000", 20)}
            </View>
          ))}
        </View>
      </View>
    </Pressable>
  );
};

export default StoreHorizontalCard;
