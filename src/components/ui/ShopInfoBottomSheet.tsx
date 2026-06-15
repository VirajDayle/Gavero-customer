import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { forwardRef, useCallback, useMemo } from "react";
import { Pressable, Text, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ShopInfoBottomSheetProps {
  onClose?: () => void;
  headerHeight?: number;
}

const ShopInfoBottomSheet = forwardRef<
  BottomSheetModal,
  ShopInfoBottomSheetProps
>(({ onClose, headerHeight = 120 }, ref) => {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const snapPoints = useMemo(() => {
    return [height - headerHeight - 24];
  }, [height, headerHeight]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.2}
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
      enableDynamicSizing={false}
      enableOverDrag={false}
      enableContentPanningGesture={false}
      backgroundStyle={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
      }}
      handleComponent={() => (
        <View className="items-center py-2.5 bg-white rounded-t-[20px]">
          <View className="w-10 h-1 bg-gray-200 rounded-full" />
        </View>
      )}
    >
      {/* Sticky Top Header */}
      <View className="flex-row justify-between items-center px-4 pb-3 border-b border-gray-100 bg-white">
        <View>
          <Text className="text-base font-bold text-gray-900 tracking-tight">
            Shop Information
          </Text>
          <Text className="text-[11px] text-gray-400 mt-0.5">
            All details about the store
          </Text>
        </View>
        <Pressable
          onPress={() => {
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current.dismiss();
            }
            onClose?.();
          }}
          className="h-7 w-7 bg-gray-100 items-center justify-center rounded-full active:opacity-70"
        >
          <Ionicons name="close" size={16} color="#4B5563" />
        </Pressable>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{
          padding: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="bg-white rounded-3xl p-5 mb-5 border border-gray-100">
          {/* Header Section */}
          <View className="flex-row justify-between items-start mb-4 border-b border-gray-100 pb-4">
            <View className="flex-1 mr-3">
              <Text className="text-[19px] font-extrabold text-gray-900 leading-tight mb-1.5">
                Balaji Mart & Restaurant
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="person-outline" size={14} color="#6B7280" />
                <Text className="text-[13px] font-medium text-gray-500 ml-1.5">
                  Rahul Sharma
                </Text>
              </View>
            </View>
            <View className="h-12 w-12 rounded-2xl bg-orange-50 items-center justify-center">
              <Ionicons name="storefront" size={22} color="#EA580C" />
            </View>
          </View>

          {/* Tags Section */}
          <View className="flex-row items-center mb-4">
            <View className="bg-green-50 px-3 py-1.5 rounded-lg mr-2 border border-green-100">
              <Text className="text-[10px] font-bold text-green-800 uppercase tracking-widest">
                Grocery
              </Text>
            </View>
            <View className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
              <Text className="text-[10px] font-bold text-gray-800 uppercase tracking-widest">
                Restaurant
              </Text>
            </View>
          </View>

          {/* Location Section */}
          <View className="flex-row items-center bg-[#FAFAF7] p-3.5 rounded-xl border border-gray-100">
            <View className="h-8 w-8 rounded-full bg-green-100 items-center justify-center mr-3">
              <Ionicons name="location" size={16} color="#16A34A" />
            </View>
            <Text className="text-[13px] text-gray-700 font-medium flex-1 leading-relaxed">
              123 Premium Street, City Center
            </Text>
          </View>
        </View>

        <Text className="text-[15px] font-bold text-gray-900 mb-3 ml-1">
          Store Details
        </Text>

        {/* Item 1 */}
        <View
          className="flex-row items-center p-3 bg-white rounded-xl mb-3"
          style={{ borderWidth: 1, borderColor: "#e5e7eb" }}
        >
          <View className="h-10 w-10 rounded-full bg-green-50 items-center justify-center mr-3">
            <Ionicons name="time-outline" size={20} color="#16A34A" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-bold text-gray-800 mb-0.5">
              Opening Hours
            </Text>
            <Text className="text-[12px] text-gray-500">
              Mon - Sun: 8:00 AM - 11:00 PM
            </Text>
          </View>
        </View>

        {/* Item 2 */}
        <View
          className="flex-row items-center p-3 bg-white rounded-xl mb-3"
          style={{ borderWidth: 1, borderColor: "#e5e7eb" }}
        >
          <View className="h-10 w-10 rounded-full bg-orange-50 items-center justify-center mr-3">
            <Ionicons name="star-outline" size={20} color="#EA580C" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-bold text-gray-800 mb-0.5">
              Rating
            </Text>
            <Text className="text-[12px] text-gray-500">
              4.5 Stars (108 Reviews)
            </Text>
          </View>
        </View>

        {/* Item 3 */}
        <View
          className="flex-row items-center p-3 bg-white rounded-xl mb-3"
          style={{ borderWidth: 1, borderColor: "#e5e7eb" }}
        >
          <View className="h-10 w-10 rounded-full bg-purple-50 items-center justify-center mr-3">
            <Ionicons
              name="shield-checkmark-outline"
              size={20}
              color="#9333EA"
            />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-bold text-gray-800 mb-0.5">
              Gavero Partner Since
            </Text>
            <Text className="text-[12px] text-gray-500">January 2023</Text>
          </View>
        </View>

        {/* Item 4 */}
        <View
          className="flex-row items-center p-3 bg-white rounded-xl mb-3"
          style={{ borderWidth: 1, borderColor: "#e5e7eb" }}
        >
          <View className="h-10 w-10 rounded-full bg-teal-50 items-center justify-center mr-3">
            <Ionicons name="bicycle-outline" size={20} color="#0D9488" />
          </View>
          <View className="flex-1">
            <Text className="text-[14px] font-bold text-gray-800 mb-0.5">
              Total Orders
            </Text>
            <Text className="text-[12px] text-gray-500">10,000+</Text>
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheetModal>
  );
});

export default ShopInfoBottomSheet;
