import ShopHeader from "@/src/components/ui/ShopHeader";
import { SECTIONS } from "@/src/mockData/grocery/sections";
import { SHOP_CATEGORIES } from "@/src/mockData/shops/shopCategories";
import { SHOP_FACES, type ShopType } from "@/src/types/shop";
import { useLocalSearchParams } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import { View } from "react-native";
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const ShopPage = () => {
  const scrollY = useSharedValue(0);
  const [headerHeight, setHeaderHeight] = useState(0);

  const { shopType } = useLocalSearchParams<{ shopType: ShopType }>();
  const [currentShop, setCurrentShop] = useState<ShopType>(
    shopType ?? "Grocery",
  );

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const ShopFace = SHOP_FACES[currentShop];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View style={{ flex: 1 }}>
        {headerHeight > 0 && (
          <ShopFace
            sections={SECTIONS}
            headerHeight={headerHeight}
            onScroll={onScroll}
            activeColor={
              SHOP_CATEGORIES.find((c) => c.title === currentShop)?.color
            }
          />
        )}
        <View
          style={{ position: "absolute", top: 0, left: 0, right: 0 }}
          pointerEvents="box-none"
        >
          <ShopHeader
            scrollY={scrollY}
            currentShop={currentShop}
            onShopChange={setCurrentShop}
            onLayout={(e) => setHeaderHeight(e.nativeEvent.layout.height)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ShopPage;
