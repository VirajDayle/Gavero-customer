import { FlashList } from "@shopify/flash-list";
import { styled } from "nativewind";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { BottomSheetModal } from "@gorhom/bottom-sheet";
import OrderCard, { OrderType } from "@/src/components/orders/OrderCard";
import RatingBottomSheet from "@/src/components/orders/RatingBottomSheet";
import { mockOrders } from "@/src/mockData/ordersMock";

const SafeAreaView = styled(RNSafeAreaView);

const TABS = ["Active", "History"];

const ACTIVE_STATUSES = [
  "PENDING",
  "ACCEPTED",
  "PREPARING",
  "ASSIGNED",
  "OUT_FOR_DELIVERY",
  "READY_FOR_PICKUP",
];

const Orders = () => {
  const [activeTab, setActiveTab] = useState("Active");
  const ratingBottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState<OrderType | null>(null);

  const handleRatePress = useCallback((order: OrderType) => {
    setSelectedOrderForRating(order);
    ratingBottomSheetRef.current?.present();
  }, []);

  const filteredOrders = useMemo(() => {
    if (activeTab === "Active") {
      return mockOrders.filter((order) =>
        ACTIVE_STATUSES.includes(order.statusKey)
      );
    } else {
      return mockOrders.filter(
        (order) => !ACTIVE_STATUSES.includes(order.statusKey)
      );
    }
  }, [activeTab]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 flex-1">
        <Text className="text-[24px] font-extrabold text-gray-900 mt-2 tracking-tight">
          My Orders
        </Text>

        <View className="mt-3 flex-1">
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                gap: 8,
                paddingRight: 16,
                paddingBottom: 12,
              }}
            >
              {TABS.map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={`px-5 py-1.5 rounded-full border ${
                      isActive
                        ? "bg-gray-900 border-gray-900 shadow-sm shadow-gray-200"
                        : "bg-white border-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-[14px] font-semibold tracking-wide ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          <View className="flex-1 mt-2">
            <FlashList
              data={filteredOrders}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              estimatedItemSize={250}
              contentContainerStyle={{ paddingBottom: 100 }}
              renderItem={({ item }) => <OrderCard order={item} onRatePress={handleRatePress} />}
              ListEmptyComponent={() => (
                <View className="py-10 items-center justify-center">
                  <Text className="text-gray-500 font-medium">
                    No {activeTab.toLowerCase()} orders found.
                  </Text>
                </View>
              )}
            />
          </View>
        </View>
      </View>
      
      <RatingBottomSheet
        ref={ratingBottomSheetRef}
        shopName={selectedOrderForRating?.shopName}
        deliveryPartnerName={selectedOrderForRating?.deliveryPartnerName}
        deliveryMethod={selectedOrderForRating?.deliveryMethod}
      />
    </SafeAreaView>
  );
};

export default Orders;
