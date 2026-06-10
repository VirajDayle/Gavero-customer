import Header from "@/src/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useCallback, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  SafeAreaView as RNSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// ─────────────────────────────────────────────────────────────
// GroceryCardItem
// ─────────────────────────────────────────────────────────────
interface GroceryCardProp {
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export interface GroceryCardProp {
  id?: string | number;
  name: string;
  image: string;
  price: number;
  quantity: number;
  onQuantityChange?: (id: string | number, newQuantity: number) => void;
  onRemoveItem?: (id: string | number) => void;
}

export const GroceryCardItem = ({
  id,
  name,
  image,
  price,
  quantity,
  onQuantityChange,
  onRemoveItem,
}: GroceryCardProp) => {
  const [currentQuantity, setQuantity] = useState<number>(quantity);

  // 2. Performance Optimization: Memoize Handlers
  const handleIncrement = useCallback(() => {
    const nextQty = currentQuantity + 1;
    setQuantity(nextQty);
    onQuantityChange?.(id, nextQty);
  }, [id, currentQuantity, onQuantityChange]);

  const handleDecrement = useCallback(() => {
    if (currentQuantity === 1) {
      onRemoveItem?.(id);
    } else if (currentQuantity > 1) {
      const nextQty = currentQuantity - 1;
      setQuantity(nextQty);
      onQuantityChange?.(id, nextQty);
    }
  }, [id, currentQuantity, onQuantityChange, onRemoveItem]);

  // 3. Format Currency Safely
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price * currentQuantity); // Showing total price for that item quantity

  return (
    <View className="flex-row justify-between items-center py-2">
      {/* Left Section: Image and Name */}
      <View className="flex-row items-center gap-3 flex-1">
        <View className="h-15 w-15 rounded-md  overflow-hidden border border-gray-100">
          <Image
            source={{ uri: image || "https://via.placeholder.com/150" }} // Fallback image
            className="h-full w-full"
            resizeMode="contain"
          />
        </View>
        <View className="flex-1 pr-2">
          {/* Replaced hardcoded w-53 with flex-1 for better responsiveness */}
          <Text
            className="text-[13px] font-medium text-gray-800"
            numberOfLines={2}
          >
            {name}
          </Text>
        </View>
      </View>

      {/* Right Section: Controls and Price */}
      <View className="items-end gap-1.5">
        <View className="flex-row items-center justify-between bg-green-900 px-2 py-1.5 rounded-full w-24">
          <Pressable
            onPress={handleIncrement}
            accessibilityLabel="Increase quantity"
            accessibilityRole="button"
            className="active:opacity-60 p-0.5"
          >
            <Ionicons name="add" color="#ffffff" size={16} />
          </Pressable>

          <Text className="text-white text-[12px] font-bold min-w-[20px] text-center">
            {currentQuantity}
          </Text>

          <Pressable
            onPress={handleDecrement}
            accessibilityLabel={
              currentQuantity === 1
                ? "Remove item from cart"
                : "Decrease quantity"
            }
            accessibilityRole="button"
            className="active:opacity-60 p-0.5"
          >
            <Ionicons
              name={currentQuantity === 1 ? "trash-outline" : "remove-outline"}
              color="#ffffff"
              size={16}
            />
          </Pressable>
        </View>

        <Text className="text-[12px] font-bold text-gray-900 pr-1">
          {formattedPrice}
        </Text>
      </View>
    </View>
  );
};
// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────
const GROCERY_ITEMS = [
  {
    name: "Tata Tea Premium | Desh Ki Chai | Unique Blend Crafted For Chai Lovers Across India | Black Tea | 1.5kg",
    image: "https://m.media-amazon.com/images/I/41wospnFmoL.AC_SX250.jpg",
    price: 507,
    quantity: 7,
  },
  {
    name: "NESCAFE Classic Instant Coffee Powder | Great start to your morning | 100% Pure Coffee | 200g Pouch",
    image:
      "https://m.media-amazon.com/images/I/41b6lQgmXlL._SY300_SX300_QL70_FMwebp_.jpg",
    price: 507,
    quantity: 7,
  },
  {
    name: "Tata Tea Premium | Desh Ki Chai | Unique Blend Crafted For Chai Lovers Across India | Black Tea | 1.5kg",
    image: "https://m.media-amazon.com/images/I/71Hiy0dmhlL._SL1100_.jpg",
    price: 507,
    quantity: 7,
  },
  {
    name: "MAGGI 2-Minute Vegetarian Special Masala, Instant Noodles, Pack of 12, 840g",
    image: "https://m.media-amazon.com/images/I/41wospnFmoL.AC_SX250.jpg",
    price: 507,
    quantity: 7,
  },
  {
    name: "Tomato Ketchup - Classic Blend, 850 G| No MSG |100% vegan | Tomato Sauce",
    image: "https://m.media-amazon.com/images/I/41AnPXMbDGL.AC_SX250.jpg",
    price: 507,
    quantity: 7,
  },
  {
    name: "Pasta & Pizza Sauce Herby Tomato (280G) I Vegan I 0 Trans Fat",
    image:
      "https://m.media-amazon.com/images/I/41vKsFZnxlL._SY300_SX300_QL70_FMwebp_.jpg",
    price: 507,
    quantity: 7,
  },
  {
    name: "Sofit Soya Drink Vanilla, 1000ml | Vegan | Enriched with plant protein, dietary fibers, vitamins and calcium | Lactose Free",
    image: "https://m.media-amazon.com/images/I/41jrm4AmLHL.AC_SX250.jpg",
    price: 507,
    quantity: 7,
  },
];

const PICKUP_TIMES = [
  "08:00 AM - 9:00 AM",
  "09:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
];

const TIP_OPTIONS = [10, 20, 30, 50, 100];

// ─────────────────────────────────────────────────────────────
// ViewCart
// ─────────────────────────────────────────────────────────────
const ViewCart = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const [selectedCoupon, setSelectedCoupon] = useState<string | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery",
  );
  const [deliveryType, setDeliveryType] = useState<"express" | "group">(
    "express",
  );
  const [pickupTime, setPickupTime] = useState<string>("10:00 AM - 12:00 PM");
  const [selectedTip, setSelectedTip] = useState<number | null>(null);

  const totalAmount =
    1521 +
    350 +
    (deliveryMethod === "pickup" ? 0 : 40) +
    5 +
    (deliveryMethod === "delivery" && selectedTip ? selectedTip : 0) -
    (selectedCoupon ? 50 : 0);

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF7]">
      <Header title="Checkout" back border />

      <ScrollView>
        <LinearGradient
          colors={["#C2410C", "#FDBA74", "#F3F4F6"]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={{
            flex: 1,
            height: 250,
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: -1,
          }}
        />
        {/* Delivery Address */}
        <View className="px-2 mx-3 bg-orange-100 py-1 rounded-t-xl mt-2 border-orange-500 border">
          <Text className="text-[12px] text-gray-500 uppercase mb-0.5">
            <Text className="font-bold">deliver to </Text>
            <Text className="font-semibold">Home</Text>
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="font-semibold text-[#C2410C] uppercase">
              89 Tilak Marg Barwaha
            </Text>
          </View>
        </View>
        {/* Shop Card */}
        <View className="mt-1 rounded-b-2xl bg-white mx-3">
          <View className="flex-row justify-between items-center px-4 pt-2 pb-1">
            <View className="flex-row items-center gap-3.5">
              <View className="mt-0.5 h-14.5 w-14.5 shrink-0 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
                <Image
                  source={require("../../../src/assets/images/balajimart.png")}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text
                  className="text-[16.5px] font-semibold text-gray-900"
                  numberOfLines={1}
                >
                  Balaji mart and restaurant
                </Text>
              </View>
            </View>
          </View>

          <View className="flex-row mx-5 gap-2 items-center justify-center">
            <View className="h-17 w-17 p-2 border border-gray-400 bg-[#B7ECCD] rounded-xl">
              <Image
                source={require("../../../src/assets/images/shopCategeory/groceryActive.png")}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>
            <View className="h-17 w-17 p-2 border border-gray-400 rounded-xl">
              <Image
                source={require("../../../src/assets/images/shopCategeory/restaurant.png")}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>
          </View>

          <View className="mx-3 mt-4 pb-3 gap-1.5">
            {GROCERY_ITEMS.map((item, index) => (
              <>
                <GroceryCardItem
                  key={index}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  quantity={item.quantity}
                />
                {index !== GROCERY_ITEMS.length - 1 && (
                  <View className="border-b border-gray-200" />
                )}
              </>
            ))}
          </View>
        </View>
        {/* Apply Coupon */}
        <Pressable
          onPress={() => router.push("/apply-coupon")}
          className="flex-row items-center justify-between mx-3 border border-gray-100 mt-2 rounded-2xl p-4 bg-white"
        >
          <View className="flex-row items-center gap-3">
            <View className="h-8 w-8">
              <Image
                source={require("@/src/assets/images/groceryShop/offer.png")}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>
            <View>
              <Text className="text-[15px] font-semibold text-gray-800">
                Apply Coupon
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#6b7280" />
        </Pressable>
        {/* Delivery / Pickup Options */}
        <View className="mx-3 border border-gray-100 mt-2 rounded-2xl p-4 bg-white ">
          {/* Segmented Control */}
          <View className="flex-row bg-gray-200 p-1 rounded-full mb-4">
            <Pressable
              className={`flex-1 py-2 rounded-full items-center ${
                deliveryMethod === "delivery" ? "bg-white shadow-sm" : ""
              }`}
              onPress={() => setDeliveryMethod("delivery")}
            >
              <Text
                className={`font-semibold ${
                  deliveryMethod === "delivery"
                    ? "text-green-700 font-bold"
                    : "text-gray-500"
                }`}
              >
                Delivery
              </Text>
            </Pressable>
            <Pressable
              className={`flex-1 py-2 rounded-full items-center ${
                deliveryMethod === "pickup" ? "bg-white shadow-sm" : ""
              }`}
              onPress={() => {
                setDeliveryMethod("pickup");
                handlePresentModalPress();
              }}
            >
              <Text
                className={`font-semibold ${
                  deliveryMethod === "pickup"
                    ? "text-green-700 font-bold"
                    : "text-gray-500"
                }`}
              >
                Pick Up
              </Text>
            </Pressable>
          </View>

          {deliveryMethod === "delivery" ? (
            <View className="gap-3">
              <Pressable
                onPress={() => setDeliveryType("express")}
                className={`flex-row items-center p-3 border rounded-xl ${
                  deliveryType === "express"
                    ? "border-green-600 bg-green-50/30"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Ionicons
                  name="flash"
                  size={20}
                  color={deliveryType === "express" ? "#16a34a" : "#6b7280"}
                />
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-gray-800">
                    Express Delivery
                  </Text>
                  <Text className="text-[11px] text-gray-500 mt-0.5">
                    Delivered in 30-45 mins
                  </Text>
                </View>
                <View
                  className={`h-5 w-5 rounded-full border-[1.5px] items-center justify-center ${
                    deliveryType === "express"
                      ? "border-green-600"
                      : "border-gray-300"
                  }`}
                >
                  {deliveryType === "express" && (
                    <View className="h-2.5 w-2.5 rounded-full bg-green-600" />
                  )}
                </View>
              </Pressable>

              <Pressable
                onPress={() => setDeliveryType("group")}
                className={`flex-row items-center p-3 border rounded-xl ${
                  deliveryType === "group"
                    ? "border-green-600 bg-green-50/30"
                    : "border-gray-200 bg-gray-50"
                }`}
              >
                <Ionicons
                  name="people"
                  size={20}
                  color={deliveryType === "group" ? "#16a34a" : "#6b7280"}
                />
                <View className="ml-3 flex-1">
                  <Text className="font-semibold text-gray-800">
                    Group Delivery
                  </Text>
                  <Text className="text-[11px] text-gray-500 mt-0.5">
                    Save on delivery fee, delivered later
                  </Text>
                </View>
                <View
                  className={`h-5 w-5 rounded-full border-[1.5px] items-center justify-center ${
                    deliveryType === "group"
                      ? "border-green-600"
                      : "border-gray-300"
                  }`}
                >
                  {deliveryType === "group" && (
                    <View className="h-2.5 w-2.5 rounded-full bg-green-600" />
                  )}
                </View>
              </Pressable>
            </View>
          ) : (
            <View>
              <Text className="text-[14px] font-semibold text-gray-800 mb-3">
                Selected Pickup Time
              </Text>
              <Pressable
                onPress={handlePresentModalPress}
                className="flex-row items-center justify-between p-3 border border-gray-200 rounded-xl bg-white"
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time-outline" size={20} color="#16a34a" />
                  <Text className="font-semibold text-gray-800 text-[15px]">
                    {pickupTime}
                  </Text>
                </View>
                <Ionicons name="chevron-down" size={20} color="#6b7280" />
              </Pressable>
            </View>
          )}
        </View>
        {/* Tip Rider */}
        {deliveryMethod === "delivery" && (
          <View className="mx-3 border border-gray-100 rounded-2xl p-4 bg-orange-200 mt-2">
            <View className="flex-row items-center mb-3">
              {/* <View className="h-10 w-10 bg-gray-200 rounded-md p-1 mr-2">
                <Image
                  source={
                    require("@/src/assets/images/restaurantShop/hot-delivery.png")
                  }
                  className="h-full w-full"
                  resizeMode="contain"
                />
              </View> */}

              <View>
                <Text className="text-[15px] font-semibold text-gray-800">
                  Tip your delivery partner
                </Text>
                <Text className="text-[12px] text-gray-700">
                  A small tip make their day big.
                </Text>
                <Text className="text-[12px] text-gray-700">
                  100% of the tip goes to the rider!
                </Text>
              </View>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="flex-row mt-2 "
            >
              {TIP_OPTIONS.map((tip) => (
                <Pressable
                  key={tip}
                  onPress={() =>
                    setSelectedTip(tip === selectedTip ? null : tip)
                  }
                  className={`mr-3 px-5 py-2 border rounded-xl flex-row items-center ${
                    selectedTip === tip
                      ? "border-orange-400 bg-green-50/50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <Text
                    className={`font-semibold ${
                      selectedTip === tip ? "text-orange-400" : "text-gray-700"
                    }`}
                  >
                    ₹{tip}
                  </Text>
                  {selectedTip === tip && (
                    <Ionicons
                      name="close"
                      size={14}
                      className="text-orange-400"
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </Pressable>
              ))}
              {/* <Pressable className="mr-3 px-5 py-2 border border-gray-200 rounded-xl bg-white justify-center">
                <Text className="font-semibold text-gray-700">Other</Text>
              </Pressable> */}
            </ScrollView>
          </View>
        )}
        {/* Bill Details */}
        <View className="mx-3 border border-gray-100 rounded-2xl text-gray-100 mb-2 mt-2">
          <View className="bg-[#292524] py-2.5 px-2 rounded-t-2xl">
            <Text className="text-[16px] font-semibold text-gray-100">
              Bill Details
            </Text>
          </View>
          <View className="gap-1 p-2 bg-[#292524]">
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] text-gray-100 underline">
                Grocery Item Total
              </Text>
              <Text className="text-[13px] font-medium text-gray-100">
                ₹1,521
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] text-gray-100 underline">
                Restaurant Item Total
              </Text>
              <Text className="text-[13px] font-medium text-gray-100">
                ₹350
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] text-gray-100 underline">
                Delivery Fee
              </Text>
              <Text className="text-[13px] font-medium text-gray-100">
                {deliveryMethod === "pickup" ? "₹0" : "₹40"}
              </Text>
            </View>
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] text-gray-100 underline">
                Platform Fee
              </Text>
              <Text className="text-[13px] font-medium text-gray-100">₹5</Text>
            </View>
            {deliveryMethod === "delivery" && selectedTip && (
              <View className="flex-row justify-between items-center">
                <Text className="text-[13px] text-gray-100 underline">
                  Delivery Partner Tip
                </Text>
                <Text className="text-[13px] font-medium text-gray-100">
                  ₹{selectedTip}
                </Text>
              </View>
            )}
            {selectedCoupon && (
              <View className="flex-row justify-between items-center">
                <Text className="text-[13px] text-green-600 font-medium">
                  Coupon Discount
                </Text>
                <Text className="text-[13px] font-medium text-green-600">
                  -₹50
                </Text>
              </View>
            )}
          </View>
          {/* <View className="h-[1px] bg-gray-300 my-4 mx-2" /> */}
          <View className="flex-row justify-between items-center px-2 py-4 bg-[#292524] rounded-b-xl border-t-[0.5px] border-white">
            <Text className="text-[15px] font-bold text-gray-100">
              Total To Pay
            </Text>
            <Text className="text-[15px] font-bold text-gray-100">
              ₹{totalAmount}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Bar */}
      <View
        className="px-5 py-4 border-t border-gray-200 bg-white"
        style={{ elevation: 6 }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-[12px] font-bold text-gray-500 mb-0.5 uppercase tracking-wider">
              Total Pay
            </Text>
            <Text className="text-[20px] font-bold text-gray-900">
              ₹{totalAmount}
            </Text>
          </View>
          <Pressable className="rounded-full py-2 flex-row items-center justify-center gap-2 bg-orange-500 px-5">
            <Text className="text-lg text-white font-bold">Pay Now</Text>
          </Pressable>
        </View>
      </View>

      {/* Pickup Time Bottom Sheet */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        snapPoints={["45%"]}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Sheet Header */}
          <View
            style={{
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderBottomWidth: 0.5,
              borderBottomColor: "#f3f4f6",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
              Select Pickup Time
            </Text>
            <Pressable onPress={() => bottomSheetModalRef.current?.dismiss()}>
              <Ionicons name="close" size={24} color="#374151" />
            </Pressable>
          </View>

          <BottomSheetFlatList
            data={PICKUP_TIMES}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: Math.max(insets.bottom + 60, 80),
            }}
            renderItem={({ item }) => {
              const isSelected = pickupTime === item;
              return (
                <Pressable
                  onPress={() => {
                    setPickupTime(item);
                    bottomSheetModalRef.current?.dismiss();
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingVertical: 16,
                    paddingHorizontal: 20,
                    borderBottomWidth: 0.5,
                    borderBottomColor: "#f3f4f6",
                    backgroundColor: isSelected ? "#f0fdf4" : "#fff",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: isSelected ? "700" : "500",
                      color: isSelected ? "#15803d" : "#374151",
                    }}
                  >
                    {item}
                  </Text>
                  {isSelected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color="#15803d"
                    />
                  )}
                </Pressable>
              );
            }}
          />
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default ViewCart;
