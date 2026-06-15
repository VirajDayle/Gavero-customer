import GroceryItemCatalogue from "@/src/components/home/GroceryItemCatalogue ";
import SpotlightTruss from "@/src/components/home/SpotlightTruss";
import ProductCard from "@/src/components/shops/groceryShop/ProductCard";
import HomeHeader from "@/src/components/tabs/HomeHeader";
import ScreenView from "@/src/components/ui/ScreenView";
import { useTabBar } from "@/src/context/TabBarContext";
import { FlashList } from "@shopify/flash-list";
import React, { useMemo } from "react";
import { Dimensions, Image, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

// Scroll past this → collapse header top row
const COLLAPSE_AT = 80;
// Scroll back below this → expand
const EXPAND_AT = 40;

const CAROUSAL_DATA = [
  {
    id: "1",
    title: "Carousel 1",
    colour: "#74d4ff",
    src: require("@/src/assets/images/spotLightBanner/balajiMartGrocery.png"),
  },
  {
    id: "2",
    title: "Carousel 2",
    colour: "#fda5d5",
    src: require("@/src/assets/images/spotLightBanner/shakeShake.png"),
  },
  {
    id: "3",
    title: "Carousel 3",
    colour: "#7bf1a8",
    src: require("@/src/assets/images/spotLightBanner/khandelwalBakeryy.png"),
  },
  {
    id: "4",
    title: "Carousel 4",
    colour: "#ffdf20",
    src: require("@/src/assets/images/spotLightBanner/parathaJunction.png"),
  },
];

import { GROCERY_CATEGORIES } from "@/src/mockData/grocery/groceryCategories";

const MOCK_PRODUCTS = GROCERY_CATEGORIES.flatMap((c) =>
  c.subSections.flatMap((s) => s.products),
).slice(0, 30);

const home = () => {
  const { hideProgress } = useTabBar();
  const scrollProgress = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const carouselProgress = useSharedValue(0);
  const isCollapsed = useSharedValue(false);
  const lastScrollY = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    "worklet";
    const y = event.contentOffset.y;
    scrollY.value = y;

    // Header collapse logic
    if (y > COLLAPSE_AT && !isCollapsed.value) {
      isCollapsed.value = true;
      scrollProgress.value = withTiming(1, { duration: 300 });
    } else if (y < EXPAND_AT && isCollapsed.value) {
      isCollapsed.value = false;
      scrollProgress.value = withTiming(0, { duration: 300 });
    }

    // Tab bar hide/show logic
    if (y > lastScrollY.value && y > 100) {
      hideProgress.value = withTiming(1, { duration: 300 });
    } else if (y < lastScrollY.value || y <= 100) {
      hideProgress.value = withTiming(0, { duration: 300 });
    }

    lastScrollY.value = y;
  });

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -Math.max(0, scrollY.value) }],
    };
  });

  const { width } = Dimensions.get("window");

  const ListHeaderComponent = useMemo(
    () => (
      <>
        <View style={{ marginLeft: -10, width: width }}>
          <SpotlightTruss
            progress={carouselProgress}
            spotColors={CAROUSAL_DATA.map((item) => item.colour)}
          />
        </View>

        <View
          className="mt-20 z-10 relative"
          style={{ marginLeft: -10, width: width }}
        >
          <Carousel
            loop={true}
            width={width}
            height={450}
            data={CAROUSAL_DATA}
            autoPlay={true}
            autoPlayInterval={3000}
            scrollAnimationDuration={1000}
            mode="parallax"
            modeConfig={{
              parallaxScrollingScale: 0.9,
              parallaxScrollingOffset: 60,
            }}
            onProgressChange={(_, absoluteProgress) => {
              carouselProgress.value = absoluteProgress;
            }}
            onConfigurePanGesture={(gesture) => {
              gesture.activeOffsetX([-10, 10]);
            }}
            style={{ width: width }}
            renderItem={({ item }) => (
              <View className="flex-1 px-3">
                <View className="flex-1 rounded-2xl overflow-hidden shadow-sm bg-white/50 border border-white/20">
                  <Image
                    source={item.src}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              </View>
            )}
          />
        </View>

        <GroceryItemCatalogue />

        <View className="h-6" />
      </>
    ),
    [carouselProgress, width],
  );

  return (
    <ScreenView>
      {CAROUSAL_DATA.map((item, index) => {
        const fadeStyle = useAnimatedStyle(() => {
          const len = CAROUSAL_DATA.length;
          let diff = carouselProgress.value - index;
          diff = ((((diff + len / 2) % len) + len) % len) - len / 2;
          const opacity = Math.max(0, 1 - Math.abs(diff));
          return { opacity };
        });

        return (
          <Animated.View
            key={item.id}
            style={[
              {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 500,
              },
              animatedGradientStyle,
              fadeStyle,
            ]}
          >
            <LinearGradient
              colors={[
                item.colour,
                item.colour.slice(0, 7) + "B3",
                item.colour.slice(0, 7) + "4D",
                "#FFFFFF00", // transparent white (better fade)
              ]}
              locations={[0, 0.2, 0.9, 1]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        );
      })}

      <HomeHeader scrollProgress={scrollProgress} />

      <AnimatedFlashList
        data={MOCK_PRODUCTS}
        numColumns={3}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(item: any) => String(item.id)}
        ListHeaderComponent={ListHeaderComponent}
        estimatedItemSize={250}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 100 }}
        renderItem={({ item }: { item: any }) => (
          <View className="flex-1 px-1.5 py-2">
            <ProductCard
              item={item}
              shopName={item.shopName}
              quantity={0}
              onAdd={() => {}}
              onIncrement={() => {}}
              onDecrement={() => {}}
              width="100%"
              hideActions={true}
            />
          </View>
        )}
      />
    </ScreenView>
  );
};

export default home;
