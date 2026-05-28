import type { Product } from "@/src/types/product";
import React, { memo, useEffect } from "react";
import { DimensionValue, Image, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import AddCart from "./AddCart";

const ProductCard = memo(
  ({
    item,
    quantity,
    onAdd,
    onIncrement,
    onDecrement,
    width,
    height,
  }: {
    item: Product;
    quantity: number;
    onAdd: () => void;
    onIncrement: () => void;
    onDecrement: () => void;
    width?: DimensionValue;
    height?: DimensionValue;
  }) => {
    const discount =
      item.mrp > item.price
        ? Math.round(((item.mrp - item.price) / item.mrp) * 100)
        : 0;

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
        className={`overflow-hidden ${width === undefined ? "flex-1" : ""}`}
      >
        {/* Image area */}
        <View className="bg-gray-50 h-36 items-center justify-center relative rounded-2xl">
          {/* Image placeholder — add source={item.image} when ready */}
          {/* Image placeholder — add source={item.image} when ready */}
          {item.image ? (
            <View className="h-full w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
              <Image
                source={item.image}
                className={`w-full h-full ${!item.inStock ? "opacity-30" : ""}`}
                resizeMode="contain"
              />
            </View>
          ) : (
            <View
              className={`w-20 h-20 bg-gray-100 rounded-xl ${!item.inStock ? "opacity-30" : ""}`}
            />
          )}

          {!item.inStock && (
            <View className="absolute bg-white/90 border border-red-500 px-2 py-1 rounded shadow-sm">
              <Text className="text-[10px] text-red-600 font-extrabold tracking-widest uppercase text-center">
                Out of Stock
              </Text>
            </View>
          )}

          {discount > 0 && item.inStock && (
            <View className="absolute top-2 left-2 bg-green-50 px-1.5 py-0.5 rounded-md">
              <Text className="text-green-800 text-[10px] font-semibold">
                {discount}% off
              </Text>
            </View>
          )}

          {/* AddCart Button positioned relative to Image area */}
          {item.inStock && (
            <View
              className="absolute -bottom-9 right-1.25 shadow-sm shadow-black/10"
              pointerEvents="box-none"
            >
              <AddCart />
            </View>
          )}

          {/* Item Unit Badge */}
          {/* <View className="absolute -bottom-3 left-2 bg-gray-800 border border-gray-700 px-2 py-0.5 rounded-md shadow-sm shadow-black/10">
            <Text className="text-[9px] font-bold text-white tracking-wide">
              {item.unit}
            </Text>
          </View> */}
        </View>

        <View className="bg-gray-100 border border-gray-200 -mt-2 px-2 py-0.5 rounded-br-md shadow-sm shadow-black/5 self-start">
          <Text className="text-[9px] font-semibold text-gray-600 tracking-wide">
            {item.unit}
          </Text>
        </View>

        {/* Info area */}
        <View className="px-1 pb-3 pt-1">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-[16px] font-bold text-gray-900">
              ₹{item.price}
            </Text>
            {item.mrp > item.price && (
              <Text className="text-[10px] text-gray-400 line-through">
                ₹{item.mrp}
              </Text>
            )}
          </View>

          <Text
            className="text-[12px] font-medium mt-[0.5] leading-4 tracking-wide"
            numberOfLines={3}
          >
            {item.title}
          </Text>
        </View>
      </Animated.View>
    );
  },
);

export default ProductCard;
