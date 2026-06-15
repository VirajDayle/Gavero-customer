import React, { useEffect } from "react";
import { Pressable, StyleSheet } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  width?: number;
  height?: number;
}

export default function CustomSwitch({
  value,
  onValueChange,
  activeColor = "#F97316", // orange-500
  inactiveColor = "#E5E7EB", // gray-200
  thumbColor = "#FFFFFF",
  width = 50,
  height = 28,
}: CustomSwitchProps) {
  // We use a shared value for the animation progress (0 to 1)
  const progress = useSharedValue(value ? 1 : 0);

  useEffect(() => {
    progress.value = withSpring(value ? 1 : 0, {
      mass: 1,
      damping: 15,
      stiffness: 120,
      overshootClamping: false,
      restDisplacementThreshold: 0.001,
      restSpeedThreshold: 0.001,
    });
  }, [value, progress]);

  const thumbSize = height - 4; // 2px padding on each side
  const translateX = (width - thumbSize - 4) * (value ? 1 : 0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [inactiveColor, activeColor]
    );
    return { backgroundColor };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: progress.value * (width - thumbSize - 4),
        },
      ],
    };
  });

  return (
    <Pressable
      onPress={() => onValueChange(!value)}
      style={[
        styles.container,
        { width, height, borderRadius: height / 2 },
      ]}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Animated.View
        style={[
          styles.track,
          { borderRadius: height / 2 },
          trackAnimatedStyle,
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: thumbSize / 2,
              backgroundColor: thumbColor,
            },
            thumbAnimatedStyle,
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    overflow: "hidden",
  },
  track: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  thumb: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 4,
  },
});
