import type { SectionItem, Sections } from "@/src/types/grocery";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback } from "react";
import { View } from "react-native";
import {
  createAnimatedComponent,
  useAnimatedScrollHandler,
} from "react-native-reanimated";

const AnimatedFlashList = createAnimatedComponent(FlashList);

interface RestaurantShopProps {
  sections: Sections;
  headerHeight: number;
  onScroll: ReturnType<typeof useAnimatedScrollHandler>;
  activeColor?: string;
}

const RestaurantShop = ({
  sections,
  headerHeight,
  onScroll,
  activeColor,
}: RestaurantShopProps) => {
  const renderItem = useCallback(({ item }: { item: SectionItem }) => {
    return (
      <View className="p-4 items-center justify-center h-40 bg-white m-2 rounded-xl shadow-sm">
        <Text className="text-lg font-bold text-gray-800">{item.title || item.type}</Text>
      </View>
    );
  }, []);

  return (
    <View className="flex-1 bg-[#FAFAF7]">
      <AnimatedFlashList
        data={sections}
        keyExtractor={(item) => (item as SectionItem).id}
        renderItem={renderItem as any}
        getItemType={(item) => (item as SectionItem).type}
        ListHeaderComponent={
          <View style={{ height: headerHeight, justifyContent: "flex-end" }}>
            <View
              style={{
                height: 100,
                backgroundColor: activeColor ?? "#FFD1D1",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        estimatedItemSize={400}
      />
    </View>
  );
};

export default RestaurantShop;
