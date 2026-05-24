import HomeHeader from "@/src/components/tabs/HomeHeader";
import { styled } from "nativewind";
import React from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// Scroll past this → collapse header top row
const COLLAPSE_AT = 80;
// Scroll back below this → expand
const EXPAND_AT = 40;

const home = () => {
  const scrollProgress = useSharedValue(0);
  const isCollapsed = useSharedValue(false);

  const onScroll = useAnimatedScrollHandler((event) => {
    "worklet";
    const y = event.contentOffset.y;

    if (y > COLLAPSE_AT && !isCollapsed.value) {
      isCollapsed.value = true;
      scrollProgress.value = withTiming(1, { duration: 300 });
    } else if (y < EXPAND_AT && isCollapsed.value) {
      isCollapsed.value = false;
      scrollProgress.value = withTiming(0, { duration: 300 });
    }
  });

  return (
    <SafeAreaView className="flex-1">
      <HomeHeader scrollProgress={scrollProgress} />
      <View className="border-b border-gray-100" />
      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        className={"px-2 pt-2"}
      >
        <View className="flex-1 gap-5">
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default home;
