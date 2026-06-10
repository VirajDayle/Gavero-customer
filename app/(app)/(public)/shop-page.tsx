import { RESTAURANT_SECTIONS } from "@/src/components/shops/restaurantShop/mockRestaurantData";
import NewShopHeader from "@/src/components/ui/NewShopHeader";
import { GROCERY_SECTIONS } from "@/src/mockData/grocery/sections";
import { GrocerySectionItem } from "@/src/types/grocery";
import { SHOP_FACES, type ShopType } from "@/src/types/shop";
import { useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import React, { useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import {
  SafeAreaView as RNSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const ACTIVE_CATEGEORY = [
  {
    id: "1",
    iconActive: require("@/src/assets/images/shopCategeory/groceryActive.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Grocery",
    color: "#B7ECCD",
  },
  {
    id: "3",
    iconActive: require("@/src/assets/images/shopCategeory/restaurant.png"),
    icon: require("@/src/assets/images/shopCategeory/grocery.png"),
    title: "Restaurant",
    color: "#121212",
  },
];

type GrocerySection = {
  id: string;
  name: string;
  items: GrocerySectionItem[];
};

// type RestaurantSection = {
//   id: string;
//   name: string;
//   items: FoodItem[];
// };

const ShopPage = () => {
  const scrollY = useSharedValue(0);
  const headerHeightSv = useSharedValue(162.66665649414062);

  const { shopType } = useLocalSearchParams<{ shopType: ShopType }>();
  const [currentShop, setCurrentShop] = useState<ShopType>(
    shopType ?? "Grocery",
  );
  const insets = useSafeAreaInsets();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const ShopFace = SHOP_FACES[currentShop];
  const SHOP_DATA = {
    Grocery: GROCERY_SECTIONS,
    Restaurant: RESTAURANT_SECTIONS,
  };

  return (
    <>
      <StatusBar translucent={true} style="dark" backgroundColor="red" />
      <SafeAreaView className="flex-1 bg-white">
        <View style={{ flex: 1 }}>
          {/* TODO: Replace with lazy-mount (mountedShops Set) + neighbor prefetch
        before connecting real API. Current opacity-stack is fine for mock
        data */}
          {(Object.entries(SHOP_FACES) as [ShopType, React.ElementType][]).map(
            ([shopKey, ShopComponent]) => (
              <View
                key={shopKey}
                style={[
                  {
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: currentShop === shopKey ? 1 : 0,
                    opacity: currentShop === shopKey ? 1 : 0,
                  },
                ]}
                pointerEvents={currentShop === shopKey ? "auto" : "none"}
              >
                <ShopComponent
                  sections={SHOP_DATA[currentShop]}
                  onScroll={onScroll}
                  headerHeightSv={headerHeightSv}
                  currentShop={currentShop}
                  changeShop={setCurrentShop}
                  scrollY={scrollY}
                />
              </View>
            ),
          )}
        </View>
        <Animated.View
          style={{
            position: "absolute",
            top: insets.top,
            left: 0,
            right: 0,
            zIndex: 10,
          }}
          pointerEvents="box-none"
        >
          <NewShopHeader headerHeightSv={headerHeightSv} scrollY={scrollY} />
        </Animated.View>
      </SafeAreaView>
    </>
  );
};

export default ShopPage;
