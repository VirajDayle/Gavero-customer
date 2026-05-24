import React from "react";
import { Animated, Image, Text, View } from "react-native";

export interface MapPinProps {
  // isDragging: boolean;
  // pinAnim: Animated.Value;
  // pinScale: Animated.Value;
  hasStartedDragging: boolean;
}

const MapPin = ({
  // isDragging,
  // pinAnim,
  // pinScale,
  hasStartedDragging,
}: MapPinProps) => {
  return (
    <Animated.View
      style={{
        // transform: [{ translateY: pinAnim }, { scale: pinScale }],
        alignItems: "center",
      }}
    >
      {!hasStartedDragging && (
        <View
          className="bg-neutral-900/90 rounded-lg absolute"
          style={{ top: -35, width: 220, alignItems: "center" }}
        >
          <Text className="text-white text-[11px] p-1.5 text-center">
            Drag the pin to select your exact delivery location
          </Text>
        </View>
      )}
      {/* Image Shadow Wrapper */}
      <View
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.35,
          shadowRadius: 8,
          shadowOffset: {
            width: 0,
            height: 4,
          },
          elevation: 10,
        }}
      >
        <Image
          source={require("@/src/assets/images/map/pushpin.png")}
          className="w-14 h-14"
          resizeMode="contain"
        />

        {/* Ground Shadow
        <View
          className="bg-black rounded-full"
          style={{
            width: 18,
            height: 5,
          }}
        /> */}
      </View>
    </Animated.View>
  );
};

export default MapPin;
