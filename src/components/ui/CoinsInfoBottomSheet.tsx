import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Image, Pressable, Text, View } from "react-native";

interface CoinsInfoBottomSheetProps {
  onClose?: () => void;
}

const CoinsInfoBottomSheet = forwardRef<
  BottomSheetModal,
  CoinsInfoBottomSheetProps
>(({ onClose }, ref) => {
  const snapPoints = useMemo(() => ["60%"], []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={{ backgroundColor: "#D1D5DB", width: 40 }}
      backgroundStyle={{ backgroundColor: "#FFFFFF", borderRadius: 24 }}
    >
      <View className="flex-row justify-between items-center px-5 pb-3 pt-1 bg-white">
        <Text className="text-[18px] font-extrabold text-gray-900 tracking-tight">
          Gavero Coins
        </Text>
        <Pressable
          onPress={() => {
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current.dismiss();
            }
            onClose?.();
          }}
          className="h-8 w-8 bg-gray-100 items-center justify-center rounded-full active:opacity-70"
        >
          <Ionicons name="close" size={20} color="#4B5563" />
        </Pressable>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Dark Theme Hero Banner */}
        <View className="bg-[#111827] rounded-2xl p-4 flex-row items-center justify-between mb-6 shadow-sm">
          <View className="flex-row items-center gap-4 flex-1">
            <View className="h-16 w-16 justify-center drop-shadow-md">
              <Image
                source={require("@/src/assets/images/profile/GaveroJar.png")}
                className="h-full w-full"
                resizeMode="contain"
              />
            </View>
            <View className="flex-1 pr-2">
              <Text className="text-[16px] font-bold text-white mb-1 tracking-wide">
                Earn & Redeem
              </Text>
              <Text className="text-[12px] text-gray-400 leading-4">
                Use your coins on your next order to unlock exclusive discounts!
              </Text>
            </View>
          </View>
        </View>

        <Text className="text-[15px] font-bold text-gray-900 mb-3 ml-1">
          How to earn?
        </Text>

        {/* Item 1 */}
        <View
          className="flex-row items-center p-3 bg-white rounded-xl mb-3"
          style={{ borderWidth: 1, borderColor: "#d1d5db" }}
        >
          <View className="h-12 w-12 rounded-xl bg-orange-50 items-center justify-center mr-3">
            <Ionicons name="cart-outline" size={24} color="#EA580C" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-bold text-gray-800 mb-0.5">
              Large Orders
            </Text>
            <Text className="text-[12px] text-gray-500">
              Get +5 coins on cart value over ₹500
            </Text>
          </View>
          <View className="bg-orange-100 px-2.5 py-1 rounded-lg">
            <Text className="text-orange-700 font-extrabold text-[11px]">+5</Text>
          </View>
        </View>

        {/* Item 2 */}
        <View
          className="flex-row items-center p-3 bg-white rounded-xl mb-3"
          style={{ borderWidth: 1, borderColor: "#d1d5db" }}
        >
          <View className="h-12 w-12 rounded-xl bg-blue-50 items-center justify-center mr-3">
            <Ionicons name="calendar-outline" size={24} color="#2563EB" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-bold text-gray-800 mb-0.5">
              Monthly Milestone
            </Text>
            <Text className="text-[12px] text-gray-500">
              Get +10 coins on monthly orders above ₹10,000
            </Text>
          </View>
          <View className="bg-blue-100 px-2.5 py-1 rounded-lg">
            <Text className="text-blue-700 font-extrabold text-[11px]">+10</Text>
          </View>
        </View>

        {/* Item 3 */}
        <View
          className="flex-row items-center p-3 bg-white rounded-xl mb-3"
          style={{ borderWidth: 1, borderColor: "#d1d5db" }}
        >
          <View className="h-12 w-12 rounded-xl bg-green-50 items-center justify-center mr-3">
            <Ionicons name="bag-check-outline" size={24} color="#16A34A" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-bold text-gray-800 mb-0.5">
              Every Order
            </Text>
            <Text className="text-[12px] text-gray-500">
              Get +1 coin on every successful order
            </Text>
          </View>
          <View className="bg-green-100 px-2.5 py-1 rounded-lg">
            <Text className="text-green-700 font-extrabold text-[11px]">+1</Text>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default CoinsInfoBottomSheet;
