import type { Product } from "@/src/types/product";
import React, { memo, useEffect } from "react";
import { DimensionValue, Image, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Bookmark, Share } from "lucide-react-native";
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
    onPress,
  }: {
    onPress?: (id: number) => void;
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
        className={`${width === undefined ? "flex-1" : ""}`}
      >
        <Pressable
          onPress={() => onPress && onPress(item.id)}
          className="flex-1"
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
                  resizeMode="center"
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
              <View className="absolute top-2 left-2 h-7 w-7 items-center justify-center rounded-full z-10 bg-orange-600 shadow-sm">
                <Text className="text-white text-[8px] font-extrabold leading-[8px] mt-0.5 text-center">
                  {discount}%
                </Text>
                <Text className="text-[7px] text-white font-extrabold">
                  Off
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
              className="text-[12px] font-medium mt-[0.5] leading-4 tracking-wide h-12"
              numberOfLines={3}
            >
              {item.title}
            </Text>

            <View className="flex-row items-center justify-start gap-2 mt-2">
              <TouchableOpacity
                activeOpacity={0.7}
                className="p-1"
                onPress={(e) => {
                  e.stopPropagation();
                  // Add save logic here
                }}
              >
                <Bookmark size={14} color="#4B5563" strokeWidth={2.2} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.7}
                className="p-1"
                onPress={(e) => {
                  e.stopPropagation();
                  // Add share logic here
                }}
              >
                <Share size={14} color="#4B5563" strokeWidth={2.2} />
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Animated.View>
    );
  },
);

export default ProductCard;
