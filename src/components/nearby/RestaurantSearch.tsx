import ScreenView from "@/src/components/ui/ScreenView";
import SearchShopsHeader from "@/src/components/ui/SearchShopsHeader";
import { FlashList } from "@shopify/flash-list";
import React, { useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import CatalogueBottomSheet from "@/src/components/ui/CatalogueBottomSheet";
import HorizontalRestaurants from "@/src/components/ui/HorizontalRestaurants";
import { FOOD_CATEGORIES } from "@/src/mockData/restaurant/foodCategories";
import { ACTIVE_RESTAURANTS } from "@/src/mockData/shops/searchShops";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import RestaurantBigcard from "@/src/components/shops/restaurantShop/RestaurantBigcard";
import type { RestaurantItem, SearchListItem } from "@/src/types/search";
import { router } from "expo-router";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList as React.ComponentType<any>,
);

const RestaurantSearch = () => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const [shops, setShops] = useState<RestaurantItem[]>(ACTIVE_RESTAURANTS);
  const [centeredItemId, setCenteredItemId] = useState<string | null>(null);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    const restaurants = viewableItems.filter(
      (v: any) => v.item && !("type" in v.item && v.item.type === "header"),
    );

    if (restaurants.length > 0) {
      const centerIndex = Math.floor((restaurants.length - 1) / 2);
      setCenteredItemId(restaurants[centerIndex].item.id);
    } else {
      setCenteredItemId(null);
    }
  }).current;

  const UP_THRESHOLD = 100;
  const DOWN_TRESHOLD = 150;

  const toggleSave = (id: string) => {
    setShops((prevShops) =>
      prevShops.map((shop) =>
        shop.id === id ? { ...shop, isSaved: !shop.isSaved } : shop,
      ),
    );
  };

  const listData = useMemo(() => {
    const activeShops = shops.filter((shop) => !shop.isClosed);
    const closedShops = shops.filter((shop) => shop.isClosed);

    const data: SearchListItem[] = [];

    // Active Shops
    data.push({
      type: "header",
      title: "Restaurants Nearby",
      id: "header-active-shops",
    });
    data.push(...activeShops);

    data.push({
      type: "header",
      title: "Also sell Food",
      id: "header-also-sell-food",
    });

    data.push({
      type: "horizontal_restaurants",
      id: "horizontal-restaurants",
      restaurants: ACTIVE_RESTAURANTS.slice(0, 5),
    });

    if (closedShops.length > 0) {
      data.push({
        type: "header",
        title: "Currently Closed",
        id: "header-closed",
      });
      data.push(...closedShops);
    }

    return data;
  }, [shops]);

  const isOpen = useSharedValue(true);
  const progress = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      const currentY = event.contentOffset.y;

      if (currentY > UP_THRESHOLD && isOpen.value) {
        isOpen.value = false;

        progress.value = withTiming(1, { duration: 150 });
      } else if (currentY < DOWN_TRESHOLD && !isOpen.value) {
        isOpen.value = true;

        progress.value = withTiming(0, { duration: 150 });
      }
    },
  });

  return (
    <ScreenView style={{ backgroundColor: "#fff" }}>
      <SearchShopsHeader progress={progress} title="Food" />

      <View className="flex-1">
        <AnimatedFlashList
          data={listData}
          keyExtractor={(item: SearchListItem) => item.id}
          getItemType={(item: SearchListItem) =>
            "type" in item ? item.type : "restaurant"
          }
          ItemSeparatorComponent={({ leadingItem, trailingItem }: any) => {
            if (leadingItem && leadingItem.type === "header") return null;
            if (trailingItem && trailingItem.type === "header") return null;
            if (leadingItem && leadingItem.type === "horizontal_restaurants")
              return null;
            if (trailingItem && trailingItem.type === "horizontal_restaurants")
              return null;
            return <View className="h-[1px] w-full bg-gray-100 mt-0 mb-3.5" />;
          }}
          renderItem={({ item }: { item: SearchListItem }) => {
            if ("type" in item) {
              if (item.type === "header") {
                return (
                  <View className="flex-row items-center pt-4 pb-2 px-1">
                    <View className="mx-4 flex-row items-center gap-2">
                      <Text className="text-[15.5px] font-bold text-gray-900 ">
                        {item.title}
                      </Text>
                    </View>
                  </View>
                );
              }
              if (item.type === "horizontal_restaurants") {
                return <HorizontalRestaurants restaurants={item.restaurants} />;
              }
              return null;
            }

            const restaurant = item as RestaurantItem;

            return (
              <View className="items-center w-full">
                <RestaurantBigcard
                  name={restaurant.name}
                  deliveryTime={restaurant.deliveryTime}
                  rating={restaurant.rating}
                  type={restaurant.tags.join(", ")}
                  data={restaurant.data}
                  distance={restaurant.distance}
                  isSaved={restaurant.isSaved || false}
                  onSavePress={() => toggleSave(restaurant.id)}
                  onPress={() =>
                    router.push({
                      pathname: "/shop-page",
                      params: { shopType: "Food" },
                    })
                  }
                  isFastest={restaurant.isFastest}
                  isClosed={restaurant.isClosed}
                  couponCode={restaurant.couponCode}
                  isCentered={restaurant.id === centeredItemId}
                />
              </View>
            );
          }}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
          estimatedItemSize={250}
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={onViewableItemsChanged}
          extraData={centeredItemId}
        />
      </View>

      {/* Floating All Categories Button */}
      <Pressable
        className="absolute right-4 w-14 h-14 rounded-full bg-black items-center justify-center shadow-lg active:scale-[0.98]"
        style={{
          bottom: Math.max(insets.bottom + 16, 32),
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
        onPress={() => bottomSheetRef.current?.present()}
      >
        <Ionicons name="grid" size={24} color="white" />
      </Pressable>

      <CatalogueBottomSheet
        ref={bottomSheetRef}
        categories={FOOD_CATEGORIES}
        title="Food Categories"
        themeColor="#e11d48" // Rose/red theme for food
      />
    </ScreenView>
  );
};

export default RestaurantSearch;
