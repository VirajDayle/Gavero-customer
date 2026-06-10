import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import React, { useRef } from "react";
import { Image, LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";
import CoinsInfoBottomSheet from "./CoinsInfoBottomSheet";

const NewShopHeader = ({
  headerHeightSv,
  scrollY,
}: {
  headerHeightSv: SharedValue<number>;
  scrollY: SharedValue<number>;
}) => {
  const coinsSheetRef = useRef<BottomSheetModal>(null);

  const onLayout = (e: LayoutChangeEvent) => {
    headerHeightSv.value = e.nativeEvent.layout.height;
  };

  const animatedStyle = useAnimatedStyle(() => {
    // Default to 150 height if layout hasn't run yet to prevent division by zero or immediate fade
    const height = headerHeightSv.value > 0 ? headerHeightSv.value : 150;
    const opacity = interpolate(
      scrollY.value,
      [0, height],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  return (
    <>
      <Animated.View
        onLayout={onLayout}
        pointerEvents="box-none"
        className="bg-white pb-5"
        style={animatedStyle}
      >
        <View className="px-4">
          {/* Top Row */}
          <View className="flex-row items-center justify-end">
            <View className="flex-row items-center gap-2">
              <Pressable
                className="flex-row items-center justify-center bg-stone-800 pr-2 pl-1 rounded-full active:opacity-80"
                onPress={() => coinsSheetRef.current?.present()}
              >
                <Image
                  source={require("@/src/assets/images/profile/gaveroCoins.png")}
                  className="h-6 w-6"
                  resizeMode="contain"
                />
                <Text className="text-xs font-bold text-white">458988</Text>
              </Pressable>
              <Pressable className="h-10 w-10 items-center justify-center rounded-full">
                <Ionicons name="heart-outline" size={22} color="#111827" />
              </Pressable>
              <Pressable className="h-10 w-10 items-center justify-center rounded-full">
                <Ionicons name="share-outline" size={22} color="#111827" />
              </Pressable>
            </View>
          </View>

          {/* Logo + Name + Rating */}
          <View className="flex-row items-end justify-center relative w-full">
            {/* Center Logo */}
            <View className="items-center">
              <View className="h-20 w-20 rounded-full overflow-hidden border border-gray-100">
                <Image
                  source={require("@/src/assets/images/balajimart.png")}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Text
                className="text-[16px] font-semibold mx-5 text-wrap"
                numberOfLines={2}
              >
                Balaji Mart And Restaurant
              </Text>
              <View className="px-1 py-px rounded-md justify-center">
                <Text className="text-[12px] font-medium">
                  Arrive in 20-25 min
                </Text>
              </View>
            </View>

            {/* Rating (Right side) */}
            <View className="absolute right-0 top-1 items-center gap-1">
              {/* Rating */}
              <View className="items-center">
                <View className="flex-row items-center rounded bg-green-700 px-1 py-px">
                  <Text className="text-xs font-bold text-white">4.5</Text>
                  <Ionicons
                    name="star"
                    size={10}
                    color="#fcd34d"
                    style={{ marginLeft: 2 }}
                  />
                </View>
                <Text className="mt-0.5 text-[8px] font-semibold text-center">
                  (108 Reviews)
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Animated.View>
      <CoinsInfoBottomSheet ref={coinsSheetRef} />
    </>
  );
};

export default NewShopHeader;
