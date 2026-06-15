import CatalogueBottomSheet from "@/src/components/ui/CatalogueBottomSheet";
import { GROCERY_CATEGORIES } from "@/src/mockData/grocery/groceryCategories";
import ScreenView from "@/src/components/ui/ScreenView";
import SearchShopsHeader from "@/src/components/ui/SearchShopsHeader";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import React, { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import HorizontalShops from "@/src/components/ui/HorizontalShops";
import ShopCard from "@/src/components/ui/ShopCard";
import { ACTIVE_SHOPS } from "@/src/mockData/shops/searchShops";
import type { SearchListItem, ShopItem } from "@/src/types/search";
import { router } from "expo-router";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList as React.ComponentType<any>,
);

const GrocerySearch = () => {
  const insets = useSafeAreaInsets();
  const bottomSheetRef = React.useRef<BottomSheetModal>(null);
  const [shops, setShops] = useState<ShopItem[]>(ACTIVE_SHOPS);
  const previousY = useSharedValue(0);

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
      title: "Shops Nearby",
      id: "header-active-shops",
    });
    data.push(...activeShops);

    data.push({
      type: "header",
      title: "Also sell grocery",
      id: "header-also-sell-grocery",
    });

    data.push({
      type: "horizontal_shops",
      id: "horizontal-shops",
      shops: shops.slice(2, 7),
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

  const translateX = useSharedValue(0);
  const isOpen = useSharedValue(true); // track state here too
  const searchHeight = useSharedValue(48); // your searchbar height
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
      <SearchShopsHeader progress={progress} title="Grocery" />

      {/* <View className="border-b border-gray-100" /> */}
      {/* Chnage this too in the component to render shop redirect page shop wise if want  */}
      <View className="flex-1">
        <AnimatedFlashList
          data={listData}
          keyExtractor={(item: SearchListItem) => item.id}
          getItemType={(item: SearchListItem) =>
            "type" in item ? item.type : "shop"
          }
          ItemSeparatorComponent={({ leadingItem, trailingItem }: any) => {
            if (leadingItem && leadingItem.type === "header") return null;
            if (trailingItem && trailingItem.type === "header") return null;
            if (leadingItem && leadingItem.type === "horizontal_shops")
              return null;
            if (trailingItem && trailingItem.type === "horizontal_shops")
              return null;
            return <View className="border-t border-gray-100" />;
          }}
          // ListHeaderComponent={ShopTopSections}
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
              if (item.type === "horizontal_shops") {
                return <HorizontalShops shops={item.shops} />;
              }
              return null;
            }

            return (
              <ShopCard
                name={item.name}
                tagline={item.tagline}
                rating={item.rating}
                reviews={item.reviews}
                distance={item.distance}
                deliveryTime={item.deliveryTime}
                tags={item.tags}
                imageSource={item.imageSource}
                isFastest={item.isFastest}
                isClosed={item.isClosed}
                couponCode={item.couponCode}
                isSaved={item.isSaved}
                onSavePress={() => toggleSave(item.id)}
                onPress={() =>
                  router.push({
                    pathname: "/shop-page",
                    params: { shopType: "Grocery" },
                  })
                }
              />
            );
          }}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
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
        categories={GROCERY_CATEGORIES}
        title="Grocery Categories"
        themeColor="#166534"
      />
    </ScreenView>
  );
};

export default GrocerySearch;
