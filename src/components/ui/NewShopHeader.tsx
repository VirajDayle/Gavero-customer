import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  LayoutChangeEvent,
  Pressable,
  Share,
  Text,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedProps,
  useAnimatedStyle,
} from "react-native-reanimated";
import CoinsInfoBottomSheet from "./CoinsInfoBottomSheet";
import ReviewsBottomSheet from "./ReviewsBottomSheet";
import ShopInfoBottomSheet from "./ShopInfoBottomSheet";

const NewShopHeader = ({
  headerHeightSv,
  scrollY,
}: {
  headerHeightSv: SharedValue<number>;
  scrollY: SharedValue<number>;
}) => {
  const coinsSheetRef = useRef<BottomSheetModal>(null);
  const infoSheetRef = useRef<BottomSheetModal>(null);
  const reviewsSheetRef = useRef<BottomSheetModal>(null);
  const [headerHeight, setHeaderHeight] = useState(150);

  const onLayout = (e: LayoutChangeEvent) => {
    headerHeightSv.value = e.nativeEvent.layout.height;
    setHeaderHeight(e.nativeEvent.layout.height);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message:
          "Check out Balaji Mart And Restaurant on Gavero! Order fresh groceries and delicious meals directly to your door. 🚀\n\nShop Link: https://gavero.com/shop/balaji-mart",
        title: "Share Balaji Mart And Restaurant",
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
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

  const fastFadeStyle = useAnimatedStyle(() => {
    // Fades out completely in the first 20px of scroll
    const opacity = interpolate(
      scrollY.value,
      [0, 10],
      [1, 0],
      Extrapolation.CLAMP,
    );
    return { opacity };
  });

  const fastFadeProps = useAnimatedProps(() => {
    return {
      pointerEvents: scrollY.value > 10 ? "none" : "auto",
    } as any;
  });

  return (
    <>
      <Animated.View
        onLayout={onLayout}
        pointerEvents="box-none"
        className="bg-white pb-5 pt-2"
        style={animatedStyle}
      >
        <View className="px-4">
          {/* Top Row */}
          <View className="flex-row items-center justify-between relative z-50">
            <View className="flex-row items-center gap-2">
              <Pressable
                className="w-10 h-10 items-center justify-center bg-gray-100 rounded-full active:opacity-60"
                hitSlop={8}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={24} color="#111827" />
              </Pressable>

              <Animated.View
                style={fastFadeStyle}
                animatedProps={fastFadeProps}
              >
                <Pressable
                  className="w-7 h-7 items-center justify-center  rounded-full active:opacity-60"
                  hitSlop={8}
                  onPress={() => infoSheetRef.current?.present()}
                >
                  <Ionicons name="information" size={18} color="#111827" />
                </Pressable>
              </Animated.View>
            </View>

            <Animated.View
              className="flex-row items-center gap-2"
              style={fastFadeStyle}
              animatedProps={fastFadeProps}
            >
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
              <Pressable
                className="h-10 w-10 items-center justify-center rounded-full active:opacity-60"
                onPress={handleShare}
              >
                <Ionicons name="share-outline" size={22} color="#111827" />
              </Pressable>
            </Animated.View>
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
            <Animated.View
              className="absolute right-0 top-1 items-center gap-1"
              style={fastFadeStyle}
              animatedProps={fastFadeProps}
            >
              {/* Rating */}
              <Pressable
                className="items-center active:opacity-60"
                onPress={() => reviewsSheetRef.current?.present()}
                hitSlop={8}
              >
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
              </Pressable>
            </Animated.View>
          </View>
        </View>
      </Animated.View>
      <CoinsInfoBottomSheet ref={coinsSheetRef} headerHeight={headerHeight} />
      <ShopInfoBottomSheet ref={infoSheetRef} headerHeight={headerHeight} />
      <ReviewsBottomSheet
        ref={reviewsSheetRef}
        rating={4.2}
        totalReviews={108}
        headerHeight={headerHeight}
      />
    </>
  );
};

export default NewShopHeader;
