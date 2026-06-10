import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { Dimensions, FlatList, Image, Pressable, View } from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function GroceryBigImages() {
  const params = useLocalSearchParams();
  const images: string[] = params.images
    ? JSON.parse(params.images as string)
    : [];
  const initialIndex = params.initialIndex
    ? parseInt(params.initialIndex as string, 10)
    : 0;

  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Reanimated shared values for zoom and pan
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);

  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);

  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      const newScale = savedScale.value * e.scale;
      // Allow slightly shrinking below 1 during pinch, but limit max zoom to 4 during gesture
      scale.value = Math.min(Math.max(newScale, 0.5), 4);
    })
    .onEnd(() => {
      if (scale.value < 1) {
        scale.value = withSpring(1);
        savedScale.value = 1;
      } else if (scale.value > 3) {
        // Snap back to max scale of 3 if they zoom too much
        scale.value = withSpring(3);
        savedScale.value = 3;
      } else {
        savedScale.value = scale.value;
      }
    });

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (scale.value > 1) {
        // Allow panning only when zoomed in
        focalX.value = e.translationX;
        focalY.value = e.translationY;
      }
    })
    .onEnd(() => {
      focalX.value = withSpring(0);
      focalY.value = withSpring(0);
    });

  const composed = Gesture.Simultaneous(pinchGesture, panGesture);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: focalX.value },
        { translateY: focalY.value },
        { scale: scale.value },
      ],
    };
  });

  const handleThumbnailPress = (index: number) => {
    setCurrentIndex(index);
    scale.value = withSpring(1);
    savedScale.value = 1;
    focalX.value = withSpring(0);
    focalY.value = withSpring(0);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-2 z-10 absolute top-12 left-0 right-0">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 rounded-full bg-[#f5f5f5] items-center justify-center active:opacity-60 shadow-sm"
            hitSlop={10}
            style={{ elevation: 2 }}
          >
            <Ionicons name="close" size={24} color="#1a1a1a" />
          </Pressable>
        </View>

        {/* Main Image */}
        <View className="flex-1 items-center justify-center bg-white overflow-hidden">
          {images.length > 0 && (
            <GestureDetector gesture={composed}>
              <Animated.View
                style={[animatedStyle, { width: width, height: height * 0.6 }]}
                className="items-center justify-center"
              >
                <Image
                  source={{ uri: images[currentIndex] }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
              </Animated.View>
            </GestureDetector>
          )}
        </View>

        {/* Thumbnails */}
        <View className="h-32 bg-white pb-6 pt-4 border-t border-gray-100 shadow-sm">
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 20,
              alignItems: "center",
              gap: 12,
            }}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => handleThumbnailPress(index)}
                className={`w-20 h-20 rounded-xl border-2 overflow-hidden bg-gray-50 ${
                  currentIndex === index
                    ? "border-green-700"
                    : "border-transparent"
                }`}
              >
                <Image
                  source={{ uri: item }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </Pressable>
            )}
          />
        </View>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
