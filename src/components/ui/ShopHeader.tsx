import type { ShopCategoryItem } from "@/src/types/category";
import type { ShopType } from "@/src/types/shop";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";
import { router } from "expo-router";
import React, { useCallback, useRef } from "react";
import { Image, LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  clamp,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from "react-native-reanimated";
import SearchBar from "./SearchBar";

interface CategoryChipProps {
  item: ShopCategoryItem;
  isActive: boolean;
  onPress: () => void;
}

import { SHOP_CATEGORIES } from "@/src/mockData/shops/shopCategories";

const CategoryChip = ({ item, isActive, onPress }: CategoryChipProps) => {
  return (
    <Pressable
      className={clsx(
        "items-center justify-end w-18 h-17 rounded-t-2xl",
        isActive
          ? `border-t-[0.75] border-r-[0.75] border-l-[0.75] border-[#C0C0C0]`
          : "bg-transparent",
      )}
      style={{ backgroundColor: isActive ? item.color : "transparent" }}
      onPress={onPress} // ← no router.push here anymore
    >
      {({ pressed }) => (
        <>
          <Image
            source={item.iconActive}
            className={clsx(
              isActive ? "h-11 w-11" : "h-9 w-9",
              pressed && "opacity-90",
            )}
            resizeMode="contain"
          />
          <Text
            className={clsx(
              "text-[10px] text-center",
              isActive
                ? "font-bold text-gray-900"
                : "font-medium text-gray-500",
            )}
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </>
      )}
    </Pressable>
  );
};

interface ShopHeaderProps {
  scrollY: SharedValue<number>;
  currentShop: ShopType; // ← read from parent
  onShopChange: (shop: ShopType) => void; // ← write to parent
  onLayout?: (e: LayoutChangeEvent) => void;
}

const ShopHeader = ({
  scrollY,
  currentShop,
  onShopChange,
  onLayout,
}: ShopHeaderProps) => {
  // Derive the active category item so we can read its color
  const activeItem = SHOP_CATEGORIES.find((c) => c.title === currentShop);

  const headerHeightSV = useSharedValue(0);
  const hasMeasured = useRef(false);

  const onBackgroundLayout = useCallback((e: LayoutChangeEvent) => {
    if (hasMeasured.current) return;
    headerHeightSV.value = e.nativeEvent.layout.height;
    hasMeasured.current = true;
  }, []);

  const linearGradientYSV = useSharedValue(0);

  const onViewLayout = useCallback((e: LayoutChangeEvent) => {
    if (linearGradientYSV.value !== 0) return;
    linearGradientYSV.value = e.nativeEvent.layout.y;
  }, []);

  // Single progress value (0 → 1) derived once on UI thread
  // All animated styles read from this — no dynamic range recalculation per frame
  const progress = useDerivedValue(() => {
    if (headerHeightSV.value === 0) return 0;
    return clamp(scrollY.value / headerHeightSV.value, 0, 1);
  });

  // Background fades out as user scrolls
  const bgStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [1, 0]),
  }));

  // Layer 3 translates up based on scroll, clamped to not exceed the background height + upper list offset
  const layer3Style = useAnimatedStyle(() => {
    if (headerHeightSV.value === 0) return { transform: [{ translateY: 0 }] };
    const maxTranslate = headerHeightSV.value + linearGradientYSV.value + 2;
    return {
      transform: [{ translateY: -clamp(scrollY.value, 0, maxTranslate) }],
    };
  });

  // Shop name fades out slightly earlier than the background
  const textStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.6], [1, 0]),
  }));

  const stickyProgress = useDerivedValue(() => {
    const maxTranslate = headerHeightSV.value + linearGradientYSV.value + 2;
    if (maxTranslate === 0) return 0;
    return clamp(scrollY.value / maxTranslate, 0, 1);
  });

  const backBtnStyle = useAnimatedStyle(() => {
    return {
      top: interpolate(stickyProgress.value, [0, 1], [0, 15]),
    };
  });

  const searchBarStyle = useAnimatedStyle(() => {
    return {
      marginLeft: interpolate(stickyProgress.value, [0, 1], [0, 40]),
    };
  });

  const borderStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(stickyProgress.value, [0.8, 1], [0, 1]),
    };
  });

  const rootStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: scrollY.value < 0 ? -scrollY.value : 0,
        },
      ],
    };
  });

  return (
    <Animated.View
      onLayout={onLayout}
      pointerEvents="box-none"
      style={[{ overflow: "hidden" }, rootStyle]}
    >
      {/* ── Layer 1: Background — fades out, never moves ── */}
      <Animated.View
        style={[{ zIndex: 0, backgroundColor: "#ffffff" }, bgStyle]}
        pointerEvents="box-none"
      >
        <View onLayout={onBackgroundLayout} className="px-4">
          {/* Top Row */}
          <View className="flex-row items-center justify-between">
            <View className="h-10 w-10" />

            <View className="flex-row items-center gap-2">
              <Pressable className="h-10 w-10 items-center justify-center rounded-full">
                <Ionicons name="heart-outline" size={22} color="#111827" />
              </Pressable>
              <Pressable className="h-10 w-10 items-center justify-center rounded-full">
                <Ionicons name="share-outline" size={22} color="#111827" />
              </Pressable>
            </View>
          </View>

          {/* Logo + Name + Rating */}
          <View className="flex-row items-end justify-center overflow-hidden">
            {/* Center Logo */}
            <View className="items-center">
              <View className="h-20 w-20 rounded-full overflow-hidden border border-gray-100">
                <Image
                  source={require("@/src/assets/images/balajimart.png")}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <Animated.Text
                className="text-[16px] font-semibold mx-5 text-wrap"
                numberOfLines={2}
                style={textStyle}
              >
                Balaji Mart And Restaurant
              </Animated.Text>
              <View className="px-1 py-px rounded-md justify-center">
                <Text className="text-[12px] font-medium">
                  Arrive in 20-25 min
                </Text>
              </View>
            </View>

            {/* Rating */}
            <View className="absolute right-0 top-1 items-center">
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
      </Animated.View>

      {/* ── Layer 2/3: Everything below translates up ── */}
      <Animated.View
        style={[{ zIndex: 10, backgroundColor: "#ffffff" }, layer3Style]}
        pointerEvents="box-none"
      >
        <View className="-mb-0.5 mt-3 z-10">
          <FlashList
            data={SHOP_CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
            renderItem={({ item }) => (
              <CategoryChip
                item={item}
                isActive={item.title === currentShop} // ← derived, not stored in item
                onPress={() => onShopChange(item.title as ShopType)}
              />
            )}
          />
        </View>

        <View
          onLayout={onViewLayout}
          className="border-t-[0.75] border-[#C0C0C0]"
          style={{ backgroundColor: activeItem?.color ?? "#B7ECCD" }}
        >
          <View className="px-4">
            <Animated.View style={searchBarStyle}>
              <SearchBar
                className="mt-3 mb-2"
                placeholderText="search from store"
              />
            </Animated.View>
          </View>

          {/* ── Animated Bottom Border ── */}
          <Animated.View
            style={borderStyle}
            className="absolute -bottom-px left-0 right-0 h-px bg-gray-200"
          />
        </View>
      </Animated.View>

      {/* ── Absolute Back Button ── */}
      <Animated.View style={backBtnStyle} className="absolute z-20 left-4">
        <Pressable
          className="h-10 w-10 items-center justify-center rounded-full bg-white/40"
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
};

export default ShopHeader;
