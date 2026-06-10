import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  SharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Ellipse, Svg } from "react-native-svg";

import SearchBar from "@/src/components/ui/SearchBar";
import { MenuSection } from "./type"; // Clean Import

// Create the animated component outside the render cycle
const AnimatedFlashList = createAnimatedComponent(
  FlashList,
) as unknown as React.FC<any>;

interface StickyHeaderProps {
  scrollY: SharedValue<number>;
  scrollThresholdSv: SharedValue<number>;
  activeIndex: number;
  menuSections: MenuSection[];
  onCategoryPress?: (index: number) => void;
}

const StickyHeader: React.FC<StickyHeaderProps> = ({
  scrollY,
  scrollThresholdSv,
  activeIndex,
  menuSections,
  onCategoryPress,
}) => {
  const headerListRef = useRef<any>(null);

  useEffect(() => {
    if (activeIndex >= 0 && activeIndex < menuSections.length) {
      // Check if there are items and valid index before scrolling
      try {
        headerListRef.current?.scrollToIndex({
          index: activeIndex,
          animated: true,
          viewPosition: 0.5, // Center the active item
        });
      } catch (e) {
        // Ignored on initial render before layout
      }
    }
  }, [activeIndex, menuSections.length]);

  // ── Smooth Button Transitions ──
  const animatedBackButtonStyle = useAnimatedStyle(() => {
    const threshold =
      scrollThresholdSv.value > 0 ? scrollThresholdSv.value - 20 : 200;
    const isSticky = scrollY.value >= threshold;

    return {
      opacity: withTiming(isSticky ? 1 : 0, { duration: 180 }),
      width: withTiming(isSticky ? 40 : 0, { duration: 180 }),
      marginRight: withTiming(isSticky ? 3 : 0, { duration: 180 }),
      marginTop: withTiming(isSticky ? 8 : 0, { duration: 180 }),
    };
  });

  // ── High Performance Tab Item Renderer ──
  const renderCategoryItem = useCallback(
    ({ item, index }: { item: MenuSection; index: number }) => {
      const isActive = index === activeIndex;

      return (
        <Pressable
          onPress={() => onCategoryPress?.(index)}
          accessibilityRole="tab"
          accessibilityState={{ selected: isActive }}
          hitSlop={{ top: 15, bottom: 15, left: 10, right: 10 }}
          // Added relative positioning to let the absolute border attach to the container edges
          className="px-4 py-1 justify-center items-center relative"
        >
          <Text
            className={`text-sm tracking-wide transition-colors duration-150 ${
              isActive
                ? "text-[#F8FAFC] font-bold"
                : "text-[#F8FAFC] font-semibold"
            }`}
          >
            {item.name}
          </Text>

          {/* High-performance bottom border indicator spanning 100% width */}
          <View
            className={`absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl ${
              isActive ? "bg-gray-300" : "bg-transparent"
            }`}
          />
        </Pressable>
      );
    },
    [activeIndex, onCategoryPress],
  );

  const keyExtractor = useCallback((item: MenuSection) => item.id, []);
  const getItemType = useCallback((item: MenuSection) => item.type, []);

  return (
    <View className="w-full bg-black z-10">
      {/* Search Header Container */}
      <View
        className=" bg-black"
        // style={{ backgroundColor: "#B7ECCD" }}
      >
        <View className="px-3 flex-row items-center justify-between h-14">
          <Animated.View
            style={[animatedBackButtonStyle, { overflow: "hidden" }]}
          >
            <Pressable
              className="w-9 h-9 rounded-full bg-zinc-500 items-center justify-center active:opacity-60"
              hitSlop={8}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
            </Pressable>
          </Animated.View>

          <View className="flex-1 justify-center mt-2">
            <SearchBar
              className="w-full"
              placeholderText="Search from restaurant..."
            />
          </View>
        </View>
      </View>

      {/* Categories Horizontal Navigation Bar */}
      <View className="mx-3 z-10 bg-black mt-1 pb-1">
        <AnimatedFlashList
          ref={headerListRef}
          data={menuSections}
          keyExtractor={keyExtractor}
          renderItem={renderCategoryItem}
          getItemType={getItemType}
          horizontal
          showsHorizontalScrollIndicator={false}
          estimatedItemSize={100} // Essential rule for layout calculation
          contentContainerStyle={{ paddingHorizontal: 8 }}
          extraData={activeIndex}
        />
      </View>

      <Svg
        width="100%"
        height={60}
        style={{
          position: "absolute",

          bottom: -50,
        }}
      >
        <Ellipse cx="50%" cy="0" rx="250" ry="25" fill="black" />
      </Svg>
    </View>
  );
};

export default StickyHeader;
