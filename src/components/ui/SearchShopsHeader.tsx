import ClosedCard from "@/src/components/ui/ClosedCard";
import SearchBar from "@/src/components/ui/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, Text, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Props {
  progress: SharedValue<number>;
  title: string;
}

const SearchShopsHeader = ({ progress, title }: Props) => {
  const hasMeasured = useRef(false);
  const [measuredHeight, setMeasuredHeight] = useState(0);

  const handleTopRowLayout = (e: LayoutChangeEvent) => {
    if (hasMeasured.current) return;
    const { height } = e.nativeEvent.layout;
    if (height > 0) {
      hasMeasured.current = true;
      setMeasuredHeight(height);
    }
  };

  const rightStyleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [0, 100]) },
      ],
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
    };
  });

  const leftStyleAnimation = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: interpolate(progress.value, [0, 1], [0, -100]) },
      ],
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
    };
  });

  // Clip the top row height to 0 when collapsed
  const topRowClipStyle = useAnimatedStyle(() => {
    const baseStyle = {
      marginBottom: interpolate(progress.value, [0, 1], [6, 0]),
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
      overflow: "hidden" as const,
    };
    if (measuredHeight === 0) return baseStyle;
    return {
      ...baseStyle,
      height: interpolate(progress.value, [0, 1], [measuredHeight, 0]),
    };
  }, [measuredHeight]);

  const searchBarAnimation = useAnimatedStyle(() => {
    return {
      marginLeft: interpolate(progress.value, [0, 1], [0, 40]),
    };
  });

  const backButtonAnimation = useAnimatedStyle(() => {
    return {
      top: interpolate(progress.value, [0, 1], [14, 16.5]),
    };
  });

  return (
    <View className="px-4 pb-4 pt-2 relative">
      {/* Absolute Back Button, always visible at top-left */}
      <Animated.View
        style={backButtonAnimation}
        className="absolute z-10 left-4"
      >
        <Pressable
          className="w-9 h-9 rounded-full bg-[#f5f5f5] items-center justify-center active:opacity-60"
          hitSlop={8}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </Pressable>
      </Animated.View>

      {/* Collapsible Top Row */}
      <Animated.View style={topRowClipStyle}>
        <View
          onLayout={handleTopRowLayout}
          className="flex-row items-center justify-between ml-12"
        >
          <Animated.View style={leftStyleAnimation}>
            <ClosedCard
              label="Fastest"
              finalText={title}
              iconName="flash"
              iconColor="#3730A3"
              iconSize={16}
              textClassName="text-[18px] font-bold text-indigo-900"
              finalTextClassName="text-[18px] font-bold"
            />
          </Animated.View>

          <Animated.View
            className="flex-row items-center gap-0"
            style={rightStyleAnimation}
          >
            <Pressable
              className="relative h-12 w-12 items-center justify-center"
              onPress={() => router.push("/(app)/(auth)/message-box")}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#111827"
                />
              </View>
              <View className="absolute top-1 right-1 h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white">
                <Text className="text-[10px] font-bold text-white mt-0.5">
                  4
                </Text>
              </View>
            </Pressable>
            <Pressable
              className="relative h-12 w-12 items-center justify-center"
              onPress={() => router.push("/(app)/(auth)/cart")}
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                <Ionicons name="cart-outline" size={22} color="#111827" />
              </View>
              <View className="absolute top-1 right-1 h-5 w-5 items-center justify-center rounded-full bg-red-500 border-2 border-white">
                <Text className="text-[10px] font-bold text-white mt-0.5">
                  5
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Pressable onPress={() => router.push("/(app)/main-search")}>
        <Animated.View style={searchBarAnimation} pointerEvents="none">
          <SearchBar
            placeholderText="Search for shops or items"
            editable={false}
          />
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default SearchShopsHeader;
