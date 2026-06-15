import { Ionicons } from "@expo/vector-icons";
import { Heart } from "lucide-react-native";
import React, { memo, useCallback, useState } from "react";
import {
  Image,
  Pressable,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { runOnJS, useSharedValue } from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import RestaurantBigcardPagination from "./RestaurantBigcardPagination";

// --- Types ---
export type RestaurantCardItem = {
  itemName: string;
  price: number;
  imageUrl?: string;
  isVeg?: boolean;
};

export interface RestaurantHorizontalCardProps {
  name: string;
  deliveryTime: string;
  rating: number;
  type: string;
  data: RestaurantCardItem[];
  distance: string;
  isSaved: boolean;
  onSavePress: () => void;
  onPress: () => void;
  isFastest?: boolean;
  couponCode?: string;
  isClosed?: boolean;
  isCentered?: boolean;
  customWidth?: number;
}

interface ImageCarouselProps {
  data: RestaurantCardItem[];
  carouselWidth: number;
  isCentered?: boolean;
}

const SCROLL_ANIMATION_DURATION = 600;
const AUTO_PLAY_INTERVAL = 2500;

// --- Memoized Sub-Component ---
const ImageCarousel = memo(
  ({ data, carouselWidth, isCentered = true }: ImageCarouselProps) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const activeIndexShared = useSharedValue(0);

    const handleProgressChange = useCallback(
      (offsetProgress: number, absoluteProgress: number) => {
        let nextIndex = Math.round(absoluteProgress) % data.length;
        if (nextIndex < 0) {
          nextIndex = data.length + nextIndex;
        }
        if (nextIndex !== activeIndexShared.value) {
          activeIndexShared.value = nextIndex;
          runOnJS(setActiveIndex)(nextIndex);
        }
      },
      [data.length],
    );

    if (!data || data.length === 0) {
      return (
        <View className="w-full h-48 bg-gray-200 items-center justify-center rounded-t-xl">
          <Text className="text-gray-400 font-medium">No Images Available</Text>
        </View>
      );
    }

    return (
      <View className="relative w-full rounded-xl overflow-hidden">
        <Carousel
          loop={data.length > 1}
          width={carouselWidth}
          height={180}
          data={data}
          autoPlay={data.length > 1 && isCentered}
          autoPlayInterval={AUTO_PLAY_INTERVAL}
          onConfigurePanGesture={(gesture) => {
            gesture.activeOffsetX([-10, 10]);
          }}
          // scrollAnimationDuration={SCROLL_ANIMATION_DURATION}
          onProgressChange={handleProgressChange}
          renderItem={({ item }) => (
            <View className="relative w-full h-full rounded-xl overflow-hidden">
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={{
                    uri: "https://unsplash.com/photos/round-cooked-pizza-x00CzBt4Dfk",
                  }}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              )}
              {/* Item Tag Overlay */}
              <View
                className="flex-row items-center absolute top-2.5 left-2 px-3 py-1 rounded-full"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.7)" }}
              >
                <View
                  className={`w-3 h-3 border items-center justify-center mr-1.5 ${
                    item.isVeg ? "border-green-500" : "border-red-600"
                  }`}
                >
                  <View
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.isVeg ? "bg-green-500" : "bg-red-600"
                    }`}
                  />
                </View>
                <Text
                  className="text-white text-xs font-semibold max-w-30"
                  numberOfLines={1}
                >
                  {item.itemName}
                </Text>
                <View className="h-3 w-px bg-gray-400 mx-2" />
                <Text className="text-amber-400 text-xs font-bold">
                  ₹{item.price}
                </Text>
              </View>
            </View>
          )}
        />
        {data.length > 1 && (
          <View className="absolute bottom-4 right-3 z-10">
            <RestaurantBigcardPagination
              data={data}
              activeIndex={activeIndex}
            />
          </View>
        )}
      </View>
    );
  },
);

ImageCarousel.displayName = "ImageCarousel";

// --- Main Component ---
const RestaurantHorizontalCard = ({
  name,
  deliveryTime,
  rating,
  data,
  distance,
  isSaved,
  onSavePress,
  onPress,
  isFastest,
  couponCode,
  isClosed = false,
  isCentered = true,
  customWidth,
}: RestaurantHorizontalCardProps) => {
  const { width: windowWidth } = useWindowDimensions();
  const cardWidth = customWidth ?? (windowWidth - 32);

  return (
    <Pressable
      onPress={onPress}
      disabled={isClosed}
      accessibilityRole="button"
      accessibilityLabel={`${name}, restaurant card.`}
      accessibilityHint={
        isClosed
          ? "This restaurant is currently closed"
          : "Double tap to view restaurant menu"
      }
      className={`bg-white p-2 rounded-2xl ${isClosed ? "opacity-60" : ""}`}
      style={{ width: cardWidth }}
    >
      {/* Upper Section: Image Slider */}
      <View className="relative">
        <ImageCarousel
          data={data}
          carouselWidth={cardWidth - 16}
          isCentered={isCentered}
        />

        {/* Favorite/Save Button */}
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            onSavePress();
          }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="absolute top-3 right-3 z-10"
          accessibilityRole="checkbox"
          accessibilityLabel={
            isSaved ? "Remove from favorites" : "Save to favorites"
          }
        >
          <Heart
            size={19}
            color="#FFFFFF"
            strokeWidth={1.4}
            fill={isSaved ? "#EF4444" : "transparent"}
          />
        </Pressable>

        {isFastest && !isClosed && (
          <View className="absolute bottom-3 left-3 bg-emerald-600 px-2.5 py-1 rounded-md">
            <Text className="text-white text-xs font-bold tracking-wide">
              ⚡ FASTEST
            </Text>
          </View>
        )}
      </View>

      {/* Lower Section: Details */}
      <View className="px-2 pb-2 pt-2">
        <View className="flex-row justify-between items-start mb-1">
          <Text
            className="text-lg font-bold text-gray-900 flex-1 mr-2"
            numberOfLines={1}
          >
            {name}
          </Text>
          <View className="flex-row items-center justify-center rounded bg-green-700 px-1.5 py-0.5 min-w-[42px]">
            <Text className="text-xs font-bold text-white">
              {rating.toFixed(1)}
            </Text>
            <Ionicons
              name="star"
              size={10}
              color="#fcd34d"
              style={{ marginLeft: 2 }}
            />
          </View>
        </View>
        <View className="flex-row items-center justify-between text-xs text-gray-600 font-medium">
          <View className="flex-row items-center gap-1.5">
            <View className="flex-row items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5">
              <Ionicons name="time-outline" size={13} color="#6B7280" />
              <Text className="text-xs font-medium text-gray-600">
                {deliveryTime}
              </Text>
            </View>
            <View className="h-1 w-1 rounded-full bg-gray-300" />
            <Text className="text-xs text-gray-500">{distance}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

export default memo(RestaurantHorizontalCard);
