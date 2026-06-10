import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, Modal, Pressable, Text, TextInput, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";

export const STATUS = {
  PENDING: {
    text: "Pending Confirmation",
    gradient: ["#F3F4F6", "#E5E7EB"],
    textColor: "#4B5563",
    borderColor: "#9CA3AF",
  },
  ACCEPTED: {
    text: "Accepted",
    gradient: ["#DBEAFE", "#93C5FD"],
    textColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  PREPARING: {
    text: "Preparing/Packing",
    gradient: ["#FEF3C7", "#FCD34D"],
    textColor: "#F59E0B",
    borderColor: "#F59E0B",
  },
  ASSIGNED: {
    text: "Delivery Partner Assigned",
    gradient: ["#EDE9FE", "#C4B5FD"],
    textColor: "#8B5CF6",
    borderColor: "#8B5CF6",
  },
  OUT_FOR_DELIVERY: {
    text: "Out for Delivery",
    gradient: ["#CCFBF1", "#5EEAD4"],
    textColor: "#14B8A6",
    borderColor: "#14B8A6",
  },
  DELIVERED: {
    text: "Delivered",
    gradient: ["#DCFCE7", "#86EFAC"],
    textColor: "#22C55E",
    borderColor: "#22C55E",
  },
  READY_FOR_PICKUP: {
    text: "Ready for Pickup",
    gradient: ["#FEF08A", "#FDE047"],
    textColor: "#EAB308",
    borderColor: "#EAB308",
  },
  PICKED_UP: {
    text: "Picked Up",
    gradient: ["#DCFCE7", "#86EFAC"],
    textColor: "#22C55E",
    borderColor: "#22C55E",
  },
  REJECTED: {
    text: "Rejected",
    gradient: ["#FEE2E2", "#FCA5A5"],
    textColor: "#EF4444",
    borderColor: "#EF4444",
  },
  CANCELLED: {
    text: "Cancelled",
    gradient: ["#FEE2E2", "#FCA5A5"],
    textColor: "#EF4444",
    borderColor: "#EF4444",
  },
  REFUNDED: {
    text: "Refunded",
    gradient: ["#F3E8FF", "#D8B4FE"],
    textColor: "#9333EA",
    borderColor: "#9333EA",
  },
} as const;

export type OrderType = {
  id: string;
  shopName: string;
  statusKey: keyof typeof STATUS;
  timestamp: string;
  price: string;
  paymentStatus: string;
  itemsCount: number;
  mainItemName: string;
  eta?: string;
  deliveryMethod?: "DELIVERY" | "PICKUP";
  pickupAddress?: string;
  deliveryAddress?: string;
  deliveryCode?: string;
  deliveryPartnerName?: string;
};

interface OrderCardProps {
  order: OrderType;
  onRatePress?: (order: OrderType) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onRatePress }) => {
  const router = useRouter();

  const statusObj = STATUS[order.statusKey];

  const isRefunded = statusObj.text === "Refunded";
  const isCancelled = ["Cancelled", "Rejected"].includes(statusObj.text);
  const isDelivered = statusObj.text === "Delivered" || statusObj.text === "Picked Up";
  const isPending = statusObj.text === "Pending Confirmation";
  const isPickupFlow = order.deliveryMethod === "PICKUP";

  const hideDeliveryInfo =
    isCancelled || isRefunded || isDelivered || isPending;
  const hideTrackOrder = hideDeliveryInfo;

  return (
    <Pressable
      className="border border-gray-200 rounded-xl bg-white mb-4 active:opacity-95"
      onPress={() => router.push("/(app)/(auth)/expand-order")}
    >
      {/* Shop Header Info */}
      <LinearGradient
        colors={[...statusObj.gradient]}
        start={{ x: 1, y: 0 }}
        end={{ x: 0, y: 0 }}
        style={{
          paddingVertical: 6,
          paddingHorizontal: 6,
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <View className="flex-row items-center gap-3">
          <View className="h-11 w-11 overflow-hidden rounded-full border border-gray-100 bg-gray-50">
            <Image
              source={require("@/src/assets/images/balajimart.png")}
              className="h-full w-full"
              resizeMode="cover"
            />
          </View>
          <Text
            className="text-[15px] font-semibold text-gray-900"
            numberOfLines={1}
          >
            {order.shopName}
          </Text>
        </View>

        <Text
          style={{
            color: statusObj.textColor,
            borderColor: statusObj.borderColor,
          }}
          className="text-[11px] px-2.5 py-1 bg-white font-extrabold rounded-full text-center border"
        >
          {statusObj.text}
        </Text>
      </LinearGradient>

      {/* Order ID & Time */}
      <View className="px-3 py-2 border-b border-gray-100 flex-row justify-between items-center bg-gray-50/50">
        <Pressable
          className="flex-row items-center gap-2 px-2.5 py-1 bg-white border border-gray-200 rounded-lg active:opacity-70 shadow-sm shadow-gray-100"
          onPress={async () => {
            await Clipboard.setStringAsync(order.id);
          }}
        >
          <Text className="text-[12px] font-bold text-gray-700 tracking-wide">
            {order.id}
          </Text>
          <View className="h-3 w-[1px] bg-gray-200" />
          <Ionicons name="copy-outline" size={12} color="#6B7280" />
        </Pressable>
        <Text className="text-[11px] font-medium text-gray-500">
          {order.timestamp}
        </Text>
      </View>

      {/* Delivery / Pickup Info & OTP */}
      {!hideDeliveryInfo ? (
        <View className="px-3 py-3 bg-white border-b border-gray-100 flex-row justify-between items-center">
          <View>
            <Text className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              {isPickupFlow ? "Expected Pickup" : "Expected Delivery"}
            </Text>
            <Text className="text-[18px] font-black text-blue-600 tracking-tight">
              {order.eta || (isPickupFlow ? "Ready in 15 mins" : "15-20 mins")}
            </Text>
            <View className="flex-row items-center gap-1 mt-1">
              <Ionicons name={isPickupFlow ? "storefront" : "location"} size={12} color="#6B7280" />
              <Text className="text-[12px] font-medium text-gray-600">
                {isPickupFlow ? (order.pickupAddress || "Shop Address") : (order.deliveryAddress || "Home • 89 Tilak Marg")}
              </Text>
            </View>
            {!isPickupFlow && (statusObj.text === "Delivery Partner Assigned" ||
              statusObj.text === "Out for Delivery") &&
              order.deliveryPartnerName && (
                <View className="flex-row items-center gap-1.5 mt-2.5 bg-indigo-50 px-2 py-1 rounded self-start border border-indigo-100">
                  <Ionicons name="bicycle" size={14} color="#4F46E5" />
                  <Text className="text-[11px] font-bold text-indigo-700">
                    {order.deliveryPartnerName} is arriving
                  </Text>
                </View>
              )}
            {isPickupFlow && statusObj.text === "Ready for Pickup" && (
                <View className="flex-row items-center gap-1.5 mt-2.5 bg-green-50 px-2 py-1 rounded self-start border border-green-100">
                  <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                  <Text className="text-[11px] font-bold text-green-700">
                    Ready to collect at shop
                  </Text>
                </View>
            )}
          </View>
          {statusObj.text !== "Accepted" &&
            statusObj.text !== "Preparing/Packing" && (
              <View className="items-end">
                <Text className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                  {isPickupFlow ? "Pickup Code" : "Delivery Code"}
                </Text>
                <View className="bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-200 flex-row items-center gap-2">
                  <Text className="text-[18px] font-black text-gray-800 tracking-widest">
                    {order.deliveryCode || "4582"}
                  </Text>
                  <View className="h-4 w-[1px] bg-gray-300" />
                  <Ionicons name="qr-code-outline" size={16} color="#4B5563" />
                </View>
              </View>
            )}
        </View>
      ) : isPending ? (
        <View className="px-3 py-2.5 bg-orange-50/50 border-b border-gray-100 flex-row items-center gap-2">
          <Ionicons name="time-outline" size={16} color="#EA580C" />
          <Text className="text-[12px] font-medium text-orange-700 flex-1">
            Waiting for {order.shopName} to confirm your order.
          </Text>
        </View>
      ) : null}

      {/* Products & Price */}
      <View className="px-3 py-3 flex-row justify-between items-start bg-white">
        <View className="flex-1 pr-4 gap-2">
          <View className="flex-row items-center gap-2">
            <View className="bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded text-center items-center justify-center min-w-[24px]">
              <Text className="text-[11px] font-extrabold text-blue-600 leading-tight">
                1x
              </Text>
            </View>
            <Text
              className="text-[13.5px] font-medium text-gray-700 flex-1"
              numberOfLines={1}
            >
              {order.mainItemName}
            </Text>
          </View>
          {order.itemsCount > 1 && (
            <View className="flex-row mt-0.5">
              <View className="bg-gray-100 px-2 py-0.5 rounded-md">
                <Text className="text-[11px] font-semibold text-gray-600">
                  + {order.itemsCount - 1} more{" "}
                  {order.itemsCount - 1 === 1 ? "item" : "items"}
                </Text>
              </View>
            </View>
          )}
        </View>
        <View className="items-end">
          <Text className="text-[15px] font-bold text-gray-900">
            {order.price}
          </Text>
          <Text className="text-[10px] text-gray-500 font-medium mt-0.5 uppercase tracking-wider">
            {order.paymentStatus}
          </Text>
        </View>
      </View>

      {/* Track Order Button or Cancellation Box */}
      {!hideTrackOrder ? (
        <View className="px-3 pb-3 pt-1 bg-white rounded-b-xl">
          <Pressable
            className="w-full bg-blue-500 rounded-lg py-2.5 items-center justify-center flex-row gap-2 active:opacity-80 shadow-sm shadow-blue-200"
            onPress={() => console.log("Track Order")}
          >
            <Ionicons name="location-outline" size={18} color="white" />
            <Text className="text-white font-bold text-[14px] tracking-wide">
              Track Order
            </Text>
          </Pressable>
        </View>
      ) : isPending ? (
        <View className="px-3 pb-3 pt-1 bg-white rounded-b-xl">
          <Pressable
            className="w-full bg-white border border-gray-300 rounded-lg py-2.5 items-center justify-center flex-row gap-2 active:bg-gray-50 shadow-sm shadow-gray-100"
            onPress={() => console.log("Cancel Order")}
          >
            <Ionicons name="close-circle-outline" size={18} color="#4B5563" />
            <Text className="text-gray-700 font-bold text-[14px] tracking-wide">
              Cancel Order
            </Text>
          </Pressable>
        </View>
      ) : isCancelled ? (
        <View className="px-3 py-3 bg-red-50/50 border-t border-red-100 rounded-b-xl">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons name="information-circle" size={16} color="#EF4444" />
            <Text className="text-[13px] font-bold text-red-600">
              Order Cancelled
            </Text>
          </View>
          <Text className="text-[12px] font-medium text-red-500 mb-2 leading-tight">
            Reason: Unfortunately, some items are out of stock.
          </Text>
          <Text className="text-[11px] font-semibold text-gray-500">
            Refund Status: Your payment will reflect in your account within 24
            hours.
          </Text>
        </View>
      ) : isRefunded ? (
        <View className="px-3 py-3 bg-purple-50/50 border-t border-purple-100 rounded-b-xl">
          <View className="flex-row items-center gap-1.5 mb-1">
            <Ionicons name="checkmark-circle" size={16} color="#9333EA" />
            <Text className="text-[13px] font-bold text-purple-600">
              Payment Refunded
            </Text>
          </View>
          <Text className="text-[12px] font-medium text-purple-500 leading-tight">
            Your order payment is refunded to your bank account!
          </Text>
        </View>
      ) : isDelivered ? (
        <View className="px-3 pb-3 pt-1 bg-white rounded-b-xl flex-row gap-2">
          <Pressable
            className="flex-1 bg-white border border-gray-300 rounded-lg py-2.5 items-center justify-center flex-row gap-1.5 active:bg-gray-50 shadow-sm shadow-gray-100"
            onPress={() => onRatePress?.(order)}
          >
            <Ionicons name="star-outline" size={16} color="#4B5563" />
            <Text className="text-gray-700 font-bold text-[13px] tracking-wide">
              Rate Us
            </Text>
          </Pressable>
          <Pressable
            className="flex-1 bg-blue-500 rounded-lg py-2.5 items-center justify-center flex-row gap-1.5 active:opacity-80 shadow-sm shadow-blue-200"
            onPress={() => console.log("Reorder")}
          >
            <Ionicons name="refresh" size={16} color="white" />
            <Text className="text-white font-bold text-[13px] tracking-wide">
              Reorder
            </Text>
          </Pressable>
        </View>
      ) : (
        <View className="pb-3 rounded-b-xl bg-white" />
      )}

    </Pressable>
  );
};

export default OrderCard;
