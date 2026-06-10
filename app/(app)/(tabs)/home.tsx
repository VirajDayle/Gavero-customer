import SpotlightTruss from "@/src/components/home/SpotlightTruss";
import HomeHeader from "@/src/components/tabs/HomeHeader";
import { styled } from "nativewind";
import React from "react";
import { Dimensions, Image, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

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

const home = () => {
  const scrollProgress = useSharedValue(0);
  const scrollY = useSharedValue(0);
  const carouselProgress = useSharedValue(0);
  const isCollapsed = useSharedValue(false);

  const onScroll = useAnimatedScrollHandler((event) => {
    "worklet";
    const y = event.contentOffset.y;
    scrollY.value = y;

    if (y > COLLAPSE_AT && !isCollapsed.value) {
      isCollapsed.value = true;
      scrollProgress.value = withTiming(1, { duration: 300 });
    } else if (y < EXPAND_AT && isCollapsed.value) {
      isCollapsed.value = false;
      scrollProgress.value = withTiming(0, { duration: 300 });
    }
  });

  const animatedGradientStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: -Math.max(0, scrollY.value) }],
    };
  });

  const { width } = Dimensions.get("window");

  const CARD_WIDTH = width * 0.7;
  const SIDE_SPACING = (width - CARD_WIDTH) / 3;

  return (
    <SafeAreaView className="flex-1">
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
      <Animated.ScrollView onScroll={onScroll} scrollEventThrottle={16}>
        <SpotlightTruss
          progress={carouselProgress}
          spotColors={CAROUSAL_DATA.map((item) => item.colour)}
        />

        <View className="mt-20 mb-5 z-10 relative">
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
              parallaxScrollingScale: 0.88,
              parallaxScrollingOffset: 50,
            }}
            onProgressChange={(_, absoluteProgress) => {
              carouselProgress.value = absoluteProgress;
            }}
            onConfigurePanGesture={(gesture) => {
              gesture.activeOffsetX([-10, 10]);
            }}
            style={{ width: width }}
            renderItem={({ item }) => (
              <View className="flex-1 rounded-2xl overflow-hidden shadow-sm bg-white/50 border border-white/20">
                <Image
                  source={item.src}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>
        <View className="flex-1 gap-5">
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
          <View className="h-20 w-full bg-amber-100" />
          <View className="h-20 w-full bg-red-400" />
          <View className="h-20 w-full bg-purple-400" />
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
};

export default home;
