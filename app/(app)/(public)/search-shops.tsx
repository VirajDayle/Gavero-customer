import SearchShopsHeader from "@/src/components/ui/SearchShopsHeader";
import { FlashList } from "@shopify/flash-list";
import { styled } from "nativewind";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

import ShopCard from "@/src/components/ui/ShopCard";
import { ACTIVE_SHOPS, ListItem, ShopItem } from "@/src/mockData/search-shops";
import { router } from "expo-router";

const AnimatedFlashList = Animated.createAnimatedComponent(
  FlashList as React.ComponentType<any>,
);

const SearchShops = () => {
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

    const data: ListItem[] = [];

    // Active Shops
    data.push({
      type: "header",
      title: "Shops Nearby",
      id: "header-active-shops",
    });
    data.push(...activeShops);

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
    <SafeAreaView className="flex-1 bg-white">
      <SearchShopsHeader progress={progress} />

      {/* <View className="border-b border-gray-100" /> */}

      <View className="flex-1">
        <AnimatedFlashList
          data={listData}
          keyExtractor={(item: ListItem) => item.id}
          getItemType={(item: ListItem) =>
            "type" in item ? item.type : "shop"
          }
          ItemSeparatorComponent={({ leadingItem }: any) => {
            if (leadingItem && leadingItem.type === "header") return null;
            return <View className="border-t border-gray-100" />;
          }}
          // ListHeaderComponent={ShopTopSections}
          renderItem={({ item }: { item: ListItem }) => {
            if ("type" in item && item.type === "header") {
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
                onPress={()=> router.push("/shop-page")}
              />
            );
          }}
          onScroll={scrollHandler}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default SearchShops;
