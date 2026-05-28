import type { Product } from "@/src/types/product";
import React, { memo, useEffect } from "react";
import { DimensionValue, Image, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const BundleProductCard = memo(
  ({
    item,
    width,
    height,
  }: {
    item: Product;
    width?: DimensionValue;
    height?: DimensionValue;
  }) => {
    const opacity = useSharedValue(0);
    const translateY = useSharedValue(8);

    useEffect(() => {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0);
    }, []);

    const cardStyle = useAnimatedStyle(() => ({
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    }));

    return (
      <Animated.View
        style={[cardStyle, { width, height }]}
        className={`rounded-xl overflow-hidden  ${width === undefined ? "flex-1" : ""}`}
      >
        {/* Image area */}
        <View className="bg-gray-50 h-24 items-center justify-center relative">
          {item.image ? (
            <View className="h-full w-full bg-gray-50 overflow-hidden">
              <Image
                source={item.image}
                className={`w-full h-full ${!item.inStock ? "opacity-30" : ""}`}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View
              className={`w-16 h-16 bg-gray-100 ${!item.inStock ? "opacity-30" : ""}`}
            />
          )}

          {!item.inStock && (
            <View className="absolute bg-white/90 border border-red-500 px-1.5 py-0.5 rounded shadow-sm">
              <Text className="text-[8px] text-red-600 font-extrabold tracking-widest uppercase text-center">
                Out of Stock
              </Text>
            </View>
          )}
        </View>

        <View className="bg-gray-100 border border-gray-200 -mt-2 px-1.5 py-0.5 rounded-br-md shadow-sm shadow-black/5 self-start">
          <Text className="text-[8px] font-semibold text-gray-600 tracking-wide">
            {item.unit}
          </Text>
        </View>

        {/* Info area */}
        <View className="px-2 pb-2 pt-1">
          <View className="flex-row items-center gap-1">
            <Text className="text-[12px] font-bold text-gray-900">
              ₹{item.price}
            </Text>
            {item.mrp > item.price && (
              <Text className="text-[9px] text-gray-400 line-through">
                ₹{item.mrp}
              </Text>
            )}
          </View>

          <Text
            className="text-[10px] font-medium mt-[0.5] leading-4 tracking-wide h-8.5"
            numberOfLines={3}
          >
            {item.title}
          </Text>
        </View>
      </Animated.View>
    );
  },
);

BundleProductCard.displayName = "BundleProductCard";

export default BundleProductCard;
