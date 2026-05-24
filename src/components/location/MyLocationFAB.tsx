import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Pressable, Text, View } from "react-native";

interface MyLocationFABProp {
  isDragging: boolean;
  hasStartedDragging?: boolean;
  onPress: () => void;
}

const MyLocationFAB = ({
  isDragging,
  hasStartedDragging = true,
  onPress,
}: MyLocationFABProp) => {
  const bounceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!hasStartedDragging) {
      // Gentle vertical bounce
      Animated.loop(
        Animated.sequence([
          Animated.timing(bounceAnim, {
            toValue: -6,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(bounceAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    } else {
      bounceAnim.setValue(0);
      bounceAnim.stopAnimation();
    }
  }, [hasStartedDragging, bounceAnim]);

  if (isDragging) return null;

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={{ transform: [{ translateY: bounceAnim }] }}>
        <Pressable
          className="flex-row gap-1 p-1.5 px-3 rounded-2xl justify-center items-center bg-white active:opacity-60"
          style={{
            borderWidth: 1,
            borderColor: "rgba(249, 115, 22, 0.3)", // orange border applied always
            ...(!hasStartedDragging
              ? {
                  shadowColor: "#f97316", // orange shadow for glow effect during animation
                  shadowOffset: {
                    width: 0,
                    height: 4,
                  },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                  elevation: 8,
                }
              : {}), // no shadow when normal
          }}
          onPress={onPress}
        >
          <Ionicons name="locate" className="text-orange-500" size={18} />
          <Text className="tracking-wide text-sm font-semibold text-orange-500">
            Use current location
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
};

export default MyLocationFAB;
