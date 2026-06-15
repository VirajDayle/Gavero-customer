import RestaurantHorizontalCard from "@/src/components/shops/restaurantShop/RestaurantHorizontalCard";
import type { RestaurantItem } from "@/src/types/search";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import React from "react";
import { View, useWindowDimensions } from "react-native";

interface HorizontalRestaurantsProps {
  restaurants: RestaurantItem[];
}

export default function HorizontalRestaurants({
  restaurants,
}: HorizontalRestaurantsProps) {
  const { width } = useWindowDimensions();
  // slightly smaller than full width so the next card peeks in
  const cardWidth = width * 0.85;

  return (
    <View className="py-4 bg-zinc-800">
      <FlashList
        horizontal
        data={restaurants}
        estimatedItemSize={cardWidth}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View className="w-4" />}
        snapToInterval={cardWidth + 16}
        decelerationRate="fast"
        renderItem={({ item }) => (
          <View style={{ width: cardWidth }}>
            <RestaurantHorizontalCard
              name={item.name}
              deliveryTime={item.deliveryTime}
              rating={item.rating}
              type={item.tags.join(", ")}
              data={item.data}
              distance={item.distance}
              isSaved={item.isSaved || false}
              onSavePress={() => {}}
              onPress={() =>
                router.push({
                  pathname: "/shop-page",
                  params: { shopType: "Restaurant" },
                })
              }
              isFastest={item.isFastest}
              isClosed={item.isClosed}
              couponCode={item.couponCode}
              isCentered={false}
              customWidth={cardWidth}
            />
          </View>
        )}
      />
    </View>
  );
}
