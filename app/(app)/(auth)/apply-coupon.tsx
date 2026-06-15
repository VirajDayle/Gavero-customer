import Header from "@/src/components/ui/Header";
import { MOCK_COUPONS } from "@/src/mockData/grocery/coupon";
import { Coupon } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// Mock restaurant coupons for demonstration
const RESTAURANT_COUPONS: Coupon[] = [
  {
    id: "r1",
    code: "TASTY50",
    description: "Flat ₹50 OFF on orders above ₹299",
    category: "Food Delivery",
    terms: "Valid on all restaurant orders.",
    imageType: "food",
  },
  {
    id: "r2",
    code: "BINGE100",
    description: "10% OFF up to ₹100",
    category: "Food Delivery",
    terms: "Valid on orders above ₹499.",
    imageType: "food",
  },
];

const ApplyCoupon = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<
    "Grocery" | "Restaurant"
  >("Grocery");
  const [selectedCoupons, setSelectedCoupons] = useState<string[]>([]);

  const toggleCoupon = (id: string) => {
    setSelectedCoupons((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const activeCoupons =
    selectedCategory === "Grocery" ? MOCK_COUPONS : RESTAURANT_COUPONS;

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF7]">
      <Header title="Apply Coupon" back border />

      {/* Category Chips */}
      <View className="py-4 bg-white border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-5"
        >
          <Pressable
            onPress={() => setSelectedCategory("Grocery")}
            className={`px-6 py-2 rounded-full border mr-3 ${
              selectedCategory === "Grocery"
                ? "bg-orange-500 border-orange-500"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedCategory === "Grocery" ? "text-white" : "text-gray-600"
              }`}
            >
              Grocery
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedCategory("Restaurant")}
            className={`px-6 py-2 rounded-full border mr-3 ${
              selectedCategory === "Restaurant"
                ? "bg-orange-500 border-orange-500"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedCategory === "Restaurant"
                  ? "text-white"
                  : "text-gray-600"
              }`}
            >
              Restaurant
            </Text>
          </Pressable>
        </ScrollView>
      </View>

      <ScrollView className="pt-4" showsVerticalScrollIndicator={false}>
        <View className="px-5 gap-4 mb-6">
          {activeCoupons.map((coupon) => {
            const isSelected = selectedCoupons.includes(coupon.id);
            return (
              <Pressable
                key={coupon.id}
                onPress={() => toggleCoupon(coupon.id)}
                className={`flex-row items-start p-4 border rounded-2xl ${
                  isSelected
                    ? "border-orange-500 bg-orange-50/50 shadow-sm"
                    : "border-gray-200 bg-white shadow-sm"
                }`}
              >
                {/* Checkbox for multiple selection */}
                <View
                  className={`h-5 w-5 rounded-[6px] border-[1.5px] mt-0.5 mr-3 items-center justify-center ${
                    isSelected
                      ? "border-orange-500 bg-orange-500"
                      : "border-gray-300 bg-transparent"
                  }`}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>

                {/* Coupon Details */}
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View className="bg-orange-100 border border-orange-200 px-2.5 py-1 rounded-md mr-2">
                      <Text className="text-[12px] font-bold text-orange-700 tracking-widest uppercase">
                        {coupon.code}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className="text-[14px] font-semibold text-gray-800 mb-1"
                    numberOfLines={2}
                  >
                    {coupon.description}
                  </Text>
                  {coupon.terms && (
                    <Text className="text-[11px] text-gray-500 leading-tight">
                      {coupon.terms}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          })}
        </View>
        <View className="h-10" />
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View className="px-5 py-4 border-t border-gray-200 bg-white">
        <Pressable
          className={`px-10 py-3.5 rounded-2xl items-center ${
            selectedCoupons.length > 0
              ? "bg-orange-500 active:bg-orange-600"
              : "bg-gray-300"
          }`}
          disabled={selectedCoupons.length === 0}
          onPress={() => router.back()}
        >
          <Text
            className={`font-bold text-[16px] ${
              selectedCoupons.length > 0 ? "text-white" : "text-gray-500"
            }`}
          >
            APPLY{" "}
            {selectedCoupons.length > 0 ? `(${selectedCoupons.length})` : ""}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default ApplyCoupon;
