import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Image,
  ImageSourcePropType,
  LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SearchBar from "./SearchBar";

export const SHOP_CATEGORIES = [
  {
    id: "1",
    iconActive: require("@/src/assets/images/shopCategeory/groceryActive.png"),
    title: "Grocery",
  },
  {
    id: "3",
    iconActive: require("@/src/assets/images/shopCategeory/restaurant.png"),
    title: "Restaurant",
  },
  {
    id: "2",
    iconActive: require("@/src/assets/images/shopCategeory/bakeryActive.png"),
    title: "Bakery",
    isActive: true,
  },
  {
    id: "4",
    iconActive: require("@/src/assets/images/shopCategeory/pharmacy.png"),
    title: "Pharmacy",
  },
  {
    id: "5",
    iconActive: require("@/src/assets/images/shopCategeory/stationary.png"),
    title: "Stationary",
  },
  {
    id: "7",
    iconActive: require("@/src/assets/images/shopCategeory/cosmetics.png"),
    title: "Cosmetics",
  },
  {
    id: "8",
    iconActive: require("@/src/assets/images/shopCategeory/petfood.png"),
    title: "Petfood",
  },
  {
    id: "9",
    iconActive: require("@/src/assets/images/shopCategeory/fruits.png"),
    title: "Fruits",
  },
];

export const GROCERY_SHOP_IMAGES = [
  { id: "1", source: require("@/src/assets/images/groceryShop/bewerages.png") },
  {
    id: "2",
    source: require("@/src/assets/images/groceryShop/dairyandbread.png"),
  },
  { id: "3", source: require("@/src/assets/images/groceryShop/dal.png") },
  {
    id: "4",
    source: require("@/src/assets/images/groceryShop/fruitsandvegitable.png"),
  },
  {
    id: "5",
    source: require("@/src/assets/images/groceryShop/grainsandstaple.png"),
  },
  { id: "6", source: require("@/src/assets/images/groceryShop/household.png") },
  { id: "7", source: require("@/src/assets/images/groceryShop/icecream.png") },
  {
    id: "8",
    source: require("@/src/assets/images/groceryShop/oilandghee.png"),
  },
  {
    id: "9",
    source: require("@/src/assets/images/groceryShop/snacksandbiscuit.png"),
  },
  { id: "10", source: require("@/src/assets/images/groceryShop/spices.png") },
];

type Item = {
  id: string;
  iconActive: ImageSourcePropType;
  icon: ImageSourcePropType;
  title: string;
  isActive?: boolean;
};

interface ShopCategoriesProps {
  className?: string;
  items: Item[];
}

interface CategoryChipProps {
  item: Item;
}

const CategoryChip = ({ item }: CategoryChipProps) => {
  return (
    <Pressable
      className={clsx(
        "items-center justify-end w-18 h-16 rounded-t-2xl",
        item.isActive
          ? "border-t-[0.5] border-r-[0.5] border-l-[0.5]  border-[#C0C0C0] bg-[#ffe86d]"
          : "border-b-[0.5] border-[#C0C0C0] bg-transparent",
      )}
      onPress={() => router.push("/(app)/(public)/search-shops")}
    >
      {({ pressed }) => (
        <>
          <Image
            source={item.iconActive}
            className={clsx("h-10 w-10", pressed && "opacity-90")}
            resizeMode="contain"
          />

          <Text
            className="text-label text-[10px] text-center"
            numberOfLines={1}
          >
            {item.title}
          </Text>
        </>
      )}
    </Pressable>
  );
};
const ShopHeader = () => {
  const insets = useSafeAreaInsets();

  // Tracks the active chip's center X as a fraction of the list row width
  const [gradientOriginX, setGradientOriginX] = useState(0.5);
  const listContainerWidth = useRef(0);

  const handleListLayout = (e: LayoutChangeEvent) => {
    listContainerWidth.current = e.nativeEvent.layout.width;
  };

  const handleActiveChipLayout = (e: LayoutChangeEvent) => {
    const { x, width } = e.nativeEvent.layout;
    const containerWidth = listContainerWidth.current;
    if (containerWidth > 0) {
      // Center of the active chip as a fraction of the row width
      const originX = (x + width / 2) / containerWidth;
      setGradientOriginX(Math.max(0, Math.min(1, originX)));
    }
  };

  return (
    <View className="bg-[#fff6c5]">
      <View style={{ marginTop: insets.top }}>
        <View className={clsx("flex-row items-center justify-between px-3")}>
          {/* Header */}
          <View className="flex-row items-center">
            <Pressable
              onPress={() => router.back()}
              className={clsx(
                "w-9 h-9 rounded-full items-center justify-center active:opacity-60 p-1",
              )}
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
            </Pressable>
          </View>
          <View className="flex-row items-center gap-2.5">
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Ionicons name="bookmark-outline" size={22} color="#111827" />
            </Pressable>
            <Pressable className="h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              <Ionicons name="share-outline" size={22} color="#111827" />
            </Pressable>
          </View>
        </View>

        {/* Hero */}
        <View className="flex-row px-3">
          <View className="mt-1 h-16.5 w-16.5 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 mr-2">
            <Image
              source={require("@/src/assets/images/balajimart.png")}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>

          <View className="flex-1">
            <Text className="text-gray-900 text-[22px] font-bold leading-6.5">
              Mahakal kirana house
            </Text>

            <View className="flex-row items-center">
              <View className="flex-row items-center  rounded-lg p-1 gap-1">
                <Ionicons name="location-outline" className="text-[10px]" />
                <Text className="text-[11px] font-medium text-gray-900">
                  2 km
                </Text>
              </View>
              <View className="h-1 w-1 rounded-full bg-gray-900 mx-2" />

              <View className="flex-row items-center gap-1  p-1 rounded-lg">
                <Ionicons name="time-outline" size={14} color="#4B5563" />
                <Text className="text-[11px] font-medium text-gray-900">
                  20-30 min
                </Text>
              </View>

              <View className="h-1 w-1 rounded-full bg-gray-900 mx-2" />

              <Text className="text-[11px] font-medium text-gray-900  p-1 rounded-lg">
                Grocery
              </Text>
            </View>
          </View>
        </View>

        <View className="mt-5" onLayout={handleListLayout}>
          <FlashList
            data={SHOP_CATEGORIES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 0 }}
            ItemSeparatorComponent={() => <View />}
            renderItem={({ item }) => (
              <CategoryChip
                item={item}
                onActiveLayout={handleActiveChipLayout}
              />
            )}
          />
        </View>
      </View>

      {/* 
        Gradient originates from the active chip's center X position.
        - start.x = gradientOriginX (active chip center)
        - end.x = 0.5 (spread to center-bottom for a natural fan)
        - The Y axis goes from top (chip bottom) to bottom of header
      */}
      <LinearGradient
        colors={["#ffe86d", "#ffe86d", "#f5d94f"]}
        locations={[0, 0.4, 1]}
        start={{ x: gradientOriginX, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      >
        <SearchBar
          className="mt-10 mx-4"
          placeholderText="search from balaji mart"
        />
        <View className="mt-4 mb-4 h-[90px]">
          <FlashList
            data={GROCERY_SHOP_IMAGES}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            ItemSeparatorComponent={() => <View className="w-3" />}
            renderItem={({ item }) => (
              <View className="h-20 w-20 overflow-hidden rounded-xl bg-white border border-gray-100 shadow-sm items-center justify-center">
                <Image
                  source={item.source}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>
      </LinearGradient>
    </View>
  );
};

export default ShopHeader;
