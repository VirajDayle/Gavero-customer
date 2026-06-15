import Header from "@/src/components/ui/Header";
import { FlashList } from "@shopify/flash-list";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const CHIPS = ["Coins", "Earns", "Usage", "Refund"];

// Mock Data
const MOCK_SHOPS = [
  {
    id: "1",
    name: "Balaji Mart",
    logo: require("@/src/assets/images/balajimart.png"),
    coins: 120,
  },
  {
    id: "2",
    name: "Fresh Market",
    logo: require("@/src/assets/images/groceryShop/fruitsandvegitable.png"),
    coins: 45,
  },
  {
    id: "3",
    name: "The Pizza Place",
    logo: require("@/src/assets/images/restaurantShop/hot-delivery.png"),
    coins: 20,
  },
  {
    id: "4",
    name: "Spicy Treats",
    logo: require("@/src/assets/images/restaurantShop/hot-delivery.png"),
    coins: 15,
  },
  {
    id: "5",
    name: "Daily Needs Grocery",
    logo: require("@/src/assets/images/groceryShop/grainsandstaple.png"),
    coins: 80,
  },
  {
    id: "6",
    name: "Burger King",
    logo: require("@/src/assets/images/restaurantShop/hot-delivery.png"),
    coins: 5,
  },
  {
    id: "7",
    name: "City Supermarket",
    logo: require("@/src/assets/images/groceryShop/snacksandbiscuit.png"),
    coins: 35,
  },
  {
    id: "8",
    name: "Healthy Foods",
    logo: require("@/src/assets/images/groceryShop/fruitsandvegitable.png"),
    coins: 60,
  },
  {
    id: "9",
    name: "Sweet Shop",
    logo: require("@/src/assets/images/restaurantShop/chef-hat.png"),
    coins: 10,
  },
  {
    id: "10",
    name: "Corner Store",
    logo: require("@/src/assets/images/groceryShop/dal.png"),
    coins: 25,
  },
  {
    id: "11",
    name: "City Supermarket",
    logo: require("@/src/assets/images/groceryShop/snacksandbiscuit.png"),
    coins: 35,
  },
  {
    id: "12",
    name: "Healthy Foods",
    logo: require("@/src/assets/images/groceryShop/fruitsandvegitable.png"),
    coins: 60,
  },
  {
    id: "13",
    name: "Sweet Shop",
    logo: require("@/src/assets/images/restaurantShop/chef-hat.png"),
    coins: 10,
  },
  {
    id: "14",
    name: "Corner Store",
    logo: require("@/src/assets/images/groceryShop/dal.png"),
    coins: 25,
  },
];

const MOCK_USAGE = [
  {
    id: "u1",
    orderId: "#ORD-89234",
    shopName: "Balaji Mart",
    logo: require("@/src/assets/images/balajimart.png"),
    coins: -50,
    date: "10 Jun, 12:30 PM",
  },
  {
    id: "u2",
    orderId: "#ORD-89211",
    shopName: "Fresh Market",
    logo: require("@/src/assets/images/groceryShop/fruitsandvegitable.png"),
    coins: -15,
    date: "08 Jun, 09:15 AM",
  },
  {
    id: "u3",
    orderId: "#ORD-89105",
    shopName: "Daily Needs Grocery",
    logo: require("@/src/assets/images/groceryShop/grainsandstaple.png"),
    coins: -30,
    date: "05 Jun, 10:20 AM",
  },
  {
    id: "u4",
    orderId: "#ORD-88992",
    shopName: "The Pizza Place",
    logo: require("@/src/assets/images/restaurantShop/hot-delivery.png"),
    coins: -10,
    date: "02 Jun, 08:30 PM",
  },
  {
    id: "u5",
    orderId: "#ORD-88741",
    shopName: "City Supermarket",
    logo: require("@/src/assets/images/groceryShop/snacksandbiscuit.png"),
    coins: -25,
    date: "28 May, 04:15 PM",
  },
  {
    id: "u6",
    orderId: "#ORD-88500",
    shopName: "Sweet Shop",
    logo: require("@/src/assets/images/restaurantShop/chef-hat.png"),
    coins: -5,
    date: "25 May, 06:45 PM",
  },
  {
    id: "u7",
    orderId: "#ORD-88210",
    shopName: "Balaji Mart",
    logo: require("@/src/assets/images/balajimart.png"),
    coins: -40,
    date: "20 May, 11:10 AM",
  },
];

const MOCK_REFUND = [
  {
    id: "r1",
    orderId: "#ORD-89190",
    shopName: "The Pizza Place",
    logo: require("@/src/assets/images/restaurantShop/hot-delivery.png"),
    coins: 20,
    reason: "Order Cancelled",
    date: "05 Jun, 08:45 PM",
  },
  {
    id: "r2",
    orderId: "#ORD-88905",
    shopName: "Fresh Market",
    logo: require("@/src/assets/images/groceryShop/fruitsandvegitable.png"),
    coins: 15,
    reason: "Item Unavailable",
    date: "01 Jun, 10:00 AM",
  },
  {
    id: "r3",
    orderId: "#ORD-88620",
    shopName: "Burger King",
    logo: require("@/src/assets/images/restaurantShop/hot-delivery.png"),
    coins: 5,
    reason: "Order Cancelled",
    date: "26 May, 09:30 PM",
  },
  {
    id: "r4",
    orderId: "#ORD-88350",
    shopName: "City Supermarket",
    logo: require("@/src/assets/images/groceryShop/snacksandbiscuit.png"),
    coins: 35,
    reason: "Damaged Items",
    date: "22 May, 02:20 PM",
  },
  {
    id: "r5",
    orderId: "#ORD-88012",
    shopName: "Healthy Foods",
    logo: require("@/src/assets/images/groceryShop/fruitsandvegitable.png"),
    coins: 60,
    reason: "Order Cancelled",
    date: "15 May, 11:45 AM",
  },
];

const MOCK_EARNS = [
  {
    id: "e1",
    orderId: "#ORD-89234",
    shopName: "Balaji Mart",
    logo: require("@/src/assets/images/balajimart.png"),
    coins: 12,
    date: "10 Jun, 12:30 PM",
  },
  {
    id: "e2",
    orderId: "#ORD-89211",
    shopName: "Fresh Market",
    logo: require("@/src/assets/images/groceryShop/fruitsandvegitable.png"),
    coins: 5,
    date: "08 Jun, 09:15 AM",
  },
  {
    id: "e3",
    orderId: "#ORD-89105",
    shopName: "Daily Needs Grocery",
    logo: require("@/src/assets/images/groceryShop/grainsandstaple.png"),
    coins: 8,
    date: "05 Jun, 10:20 AM",
  },
  {
    id: "e4",
    orderId: "#ORD-88992",
    shopName: "The Pizza Place",
    logo: require("@/src/assets/images/restaurantShop/hot-delivery.png"),
    coins: 2,
    date: "02 Jun, 08:30 PM",
  },
];

const GaveroCoins = () => {
  const [activeChip, setActiveChip] = useState("Coins");
  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const animatedOuterStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollY.value,
      [0, 200],
      [240, 100],
      Extrapolation.CLAMP,
    );
    return { height };
  });

  const animatedInnerStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      scrollY.value,
      [0, 200],
      [1, 0.4],
      Extrapolation.CLAMP,
    );
    // Keep top edge constant by translating up (half height * (1 - scale))
    const translateY = -110 * (1 - scale);
    return { transform: [{ translateY }, { scale }] };
  });

  const getActiveData = () => {
    switch (activeChip) {
      case "Coins":
        return MOCK_SHOPS;
      case "Usage":
        return MOCK_USAGE;
      case "Refund":
        return MOCK_REFUND;
      case "Earns":
        return MOCK_EARNS;
      default:
        return [];
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    switch (activeChip) {
      case "Coins":
        return (
          <Pressable className="flex-row items-center gap-3 px-4 py-3 active:bg-gray-100 border-b border-gray-100 bg-white">
            <View className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
              <Image
                source={item.logo}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>

            <View className="flex-1 gap-1.5 min-w-0">
              <View className="flex-row items-center justify-between">
                <Text
                  className="flex-1 text-[14.5px] font-bold text-gray-900 pr-2"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                <View className="flex-row items-center justify-center bg-stone-800 pr-2 pl-1 rounded-full">
                  <Image
                    source={require("@/src/assets/images/profile/gaveroCoins.png")}
                    className="h-5 w-5"
                    resizeMode="contain"
                  />
                  <Text className="text-xs font-bold text-white ml-0.5">
                    {item.coins}
                  </Text>
                </View>
              </View>
            </View>
          </Pressable>
        );

      case "Usage":
        return (
          <Pressable className="flex-row items-center gap-3 px-4 py-3 active:bg-gray-100 border-b border-gray-100 bg-white">
            <View className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 items-center justify-center">
              <Image
                source={item.logo}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 gap-1 min-w-0">
              <View className="flex-row items-center justify-between">
                <Text
                  className="flex-1 text-[14.5px] font-bold text-gray-900 pr-2"
                  numberOfLines={1}
                >
                  {item.shopName}
                </Text>
                <View className="flex-row items-center justify-center pr-2 pl-1.5 py-0.5 rounded-full">
                  <Text className="text-xs font-bold text-red-600 ml-0.5">
                    {item.coins}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-[12px] font-medium text-gray-500">
                  Order {item.orderId}
                </Text>
                <Text className="text-[11px] text-gray-400 font-medium">
                  {item.date}
                </Text>
              </View>
            </View>
          </Pressable>
        );

      case "Refund":
        return (
          <Pressable className="flex-row items-center gap-3 px-4 py-3 active:bg-gray-100 border-b border-gray-100 bg-white">
            <View className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 items-center justify-center">
              <Image
                source={item.logo}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 gap-1 min-w-0">
              <View className="flex-row items-center justify-between">
                <Text
                  className="flex-1 text-[14.5px] font-bold text-gray-900 pr-2"
                  numberOfLines={1}
                >
                  {item.shopName}
                </Text>
                <View className="flex-row items-center justify-center">
                  <Text className="text-xs font-bold text-green-600 ml-0.5">
                    +{item.coins}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-[12px] font-medium text-gray-500">
                  Refund: {item.reason}
                </Text>
                <Text className="text-[11px] text-gray-400 font-medium">
                  {item.date}
                </Text>
              </View>
            </View>
          </Pressable>
        );

      case "Earns":
        return (
          <Pressable className="flex-row items-center gap-3 px-4 py-3 active:bg-gray-100 border-b border-gray-100 bg-white">
            <View className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50 items-center justify-center">
              <Image
                source={item.logo}
                className="h-full w-full"
                resizeMode="cover"
              />
            </View>
            <View className="flex-1 gap-1 min-w-0">
              <View className="flex-row items-center justify-between">
                <Text
                  className="flex-1 text-[14.5px] font-bold text-gray-900 pr-2"
                  numberOfLines={1}
                >
                  {item.shopName}
                </Text>
                <View className="flex-row items-center justify-center">
                  <Text className="text-xs font-bold text-green-600 ml-0.5">
                    +{item.coins}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between mt-1">
                <Text className="text-[12px] font-medium text-gray-500">
                  Order {item.orderId}
                </Text>
                <Text className="text-[11px] text-gray-400 font-medium">
                  {item.date}
                </Text>
              </View>
            </View>
          </Pressable>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Gavero Coins" back border />

      {/* Animated Big Coin Header */}
      <Animated.View
        style={animatedOuterStyle}
        className="items-center overflow-hidden w-full"
      >
        <Animated.View
          style={animatedInnerStyle}
          className="justify-center items-center h-[220px]"
        >
          <Image
            source={require("@/src/assets/images/profile/gaveroCoins.png")}
            className="h-[160px] w-[160px] opacity-90"
            resizeMode="contain"
          />
          <View className="flex-row items-baseline justify-center -mt-3">
            <Text className="text-[52px] font-black text-zinc-700 tracking-tighter">
              185
            </Text>
            <Text className="text-[30px] font-bold text-zinc-700 ml-1 mb-1">
              Gc
            </Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* Chips */}
      <View className="mt-2 mb-3 bg-white z-10">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
        >
          {CHIPS.map((chip, index) => (
            <Pressable
              key={index}
              onPress={() => setActiveChip(chip)}
              className={`px-5 py-1.5 rounded-full border ${
                activeChip === chip
                  ? "bg-gray-900 border-gray-900 shadow-sm shadow-gray-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-[14px] font-semibold tracking-wide ${
                  activeChip === chip ? "text-white" : "text-gray-600"
                }`}
              >
                {chip}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <View className="flex-1">
        <AnimatedFlashList
          data={getActiveData()}
          renderItem={renderItem}
          estimatedItemSize={80}
          keyExtractor={(item: any) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
        />
      </View>
    </SafeAreaView>
  );
};

export default GaveroCoins;
