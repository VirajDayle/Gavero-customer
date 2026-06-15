import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { RestaurantCardItem } from "./RestaurantBigcard";

const PaginationDot = ({
  index,
  activeIndex,
}: {
  index: number;
  activeIndex: number;
}) => {
  const isActive = index === activeIndex;

  const opacity = useSharedValue(isActive ? 1 : 0.4);

  useEffect(() => {
    opacity.value = withTiming(isActive ? 1 : 0.4, {
      duration: 200,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: 6,
          height: 6,
          borderRadius: 999,
          backgroundColor: "#FFFFFF",
        },
      ]}
      className="mx-1"
    />
  );
};

export const RestaurantBigcardPagination = ({
  data,
  activeIndex,
}: {
  data: RestaurantCardItem[];
  activeIndex: number;
}) => {
  return (
    <View className="items-center justify-center">
      {/* Dark translucent pill background */}
      <View className="flex-row items-center px-2 py-1 rounded-full bg-black/40">
        {data.map((_, index) => (
          <PaginationDot
            key={index}
            index={index}
            activeIndex={activeIndex}
          />
        ))}
      </View>
    </View>
  );
};

export default RestaurantBigcardPagination;