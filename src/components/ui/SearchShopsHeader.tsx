import ClosedCard from "@/src/components/ui/ClosedCard";
import SearchBar from "@/src/components/ui/SearchBar";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import { LayoutChangeEvent, Pressable, View } from "react-native";
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

interface Props {
  progress: SharedValue<number>;
}

const SearchShopsHeader = ({ progress }: Props) => {
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
    if (measuredHeight === 0) return { overflow: "hidden" };
    return {
      height: interpolate(progress.value, [0, 1], [measuredHeight, 0]),
      marginBottom: interpolate(progress.value, [0, 1], [16, 0]),
      opacity: interpolate(progress.value, [0, 1], [1, 0]),
      overflow: "hidden",
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
    <View className="px-4 pb-4 pt-3 relative">
      {/* Absolute Back Button, always visible at top-left */}
      <Animated.View style={backButtonAnimation} className="absolute z-10 left-4">
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
            <ClosedCard className="" />
          </Animated.View>

          <Animated.View
            className="flex-row items-center gap-2"
            style={rightStyleAnimation}
          >
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#111827"
              />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Ionicons name="cart-outline" size={22} color="#111827" />
            </Pressable>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View style={searchBarAnimation}>
        <SearchBar placeholderText="Search for shops or items" />
      </Animated.View>
    </View>
  );
};

export default SearchShopsHeader;
