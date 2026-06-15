import { STATUS } from "@/src/components/orders/OrderCard";
import OrderStatusTracker, {
  OrderStatusKey,
} from "@/src/components/orders/OrderStatusTracker";
import RatingBottomSheet from "@/src/components/orders/RatingBottomSheet";
import TrackingMap from "@/src/components/orders/TrackingMap";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRouter } from "expo-router";
import { MapPin } from "lucide-react-native";
import React, { useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ExpandOrder = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isPaymentExpanded, setIsPaymentExpanded] = useState(false);
  const [isDeliveryExpanded, setIsDeliveryExpanded] = useState(false);
  const ratingBottomSheetRef = React.useRef<BottomSheetModal>(null);

  // Hardcoded for UI demo, you can pass this via params or fetch it from a store later
  let currentStatus: OrderStatusKey = "DELIVERED";
  let deliveryMethod: "DELIVERY" | "PICKUP" = "DELIVERY";

  const gradientColors = [...STATUS[currentStatus].gradient];

  return (
    <View className="flex-1 bg-[#FAFAF7]">
      {/* Header with Gradient Background */}
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ paddingTop: insets.top }}
      >
        <View className="flex-row items-center justify-between px-4 py-3 pb-2">
          <View className="flex-row items-center gap-3">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 rounded-full bg-white/40 items-center justify-center active:opacity-60"
              hitSlop={8}
            >
              <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
            </Pressable>
            <View className="flex-row items-center gap-3">
              <View className="h-14 w-14 overflow-hidden rounded-full border border-white/50 bg-gray-50 shadow-sm">
                <Image
                  source={require("@/src/assets/images/balajimart.png")}
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>
              <View>
                <Text
                  className="text-[17px] font-bold text-gray-900"
                  numberOfLines={1}
                >
                  Balaji Mart
                </Text>
              </View>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Order Info Highlight Bar (Attached below header) */}
      <View className="bg-gray-200/60 px-4 py-2.5 flex-row justify-between items-center border-b border-gray-200">
        <Text className="text-[13px] font-bold text-gray-800">
          Order ID: #123456789
        </Text>
        <Text className="text-[12px] font-semibold text-gray-600">
          Today, 10:30 AM
        </Text>
      </View>

      {/* Rejected / Cancelled Highlight Bar */}
      {(currentStatus === "REJECTED" || currentStatus === "CANCELLED") && (
        <View className="bg-red-50 px-4 py-3 flex-row items-start border-b border-red-100 z-10">
          <Ionicons
            name="alert-circle"
            size={18}
            color="#ef4444"
            style={{ marginRight: 8, marginTop: 1 }}
          />
          <View className="flex-1">
            <Text className="text-[13px] font-bold text-red-700 tracking-wide">
              {currentStatus === "CANCELLED"
                ? "Order Cancelled"
                : "Order Rejected"}
            </Text>
            <Text className="text-[12px] font-medium text-red-600 mt-0.5">
              {currentStatus === "CANCELLED"
                ? "Reason: You cancelled this order."
                : "Reason: Selected items are currently out of stock."}
            </Text>
          </View>
        </View>
      )}

      {/* Success Highlight Bar */}
      {(currentStatus === "DELIVERED" || currentStatus === "PICKED_UP") && (
        <View className="bg-green-600 px-4 py-2 flex-row justify-center items-center shadow-sm z-10">
          <Ionicons
            name="checkmark-circle"
            size={16}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text className="text-[13px] font-bold text-white tracking-wide">
            {currentStatus === "DELIVERED"
              ? "Order successfully delivered!"
              : "Order successfully picked up!"}
          </Text>
        </View>
      )}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Order Content */}
        <View className="px-4 pt-4 pb-24">
          {/* ETA Display */}
          {currentStatus !== "PENDING" &&
            currentStatus !== "DELIVERED" &&
            currentStatus !== "PICKED_UP" &&
            currentStatus !== "REJECTED" &&
            currentStatus !== "CANCELLED" &&
            currentStatus !== "REFUNDED" && (
              <View className="mb-6">
                <View className="flex-row items-center justify-between px-1">
                  <View>
                    <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                      {currentStatus === "READY_FOR_PICKUP"
                        ? "Shop Distance"
                        : deliveryMethod === "DELIVERY"
                          ? "Estimated Delivery"
                          : "Estimated Pickup"}
                    </Text>
                    <View className="flex-row items-center gap-2">
                      {currentStatus !== "READY_FOR_PICKUP" && (
                        <>
                          {deliveryMethod === "DELIVERY" ? (
                            <Text className="text-[32px] font-black text-gray-900 tracking-tighter">
                              15-20{" "}
                              <Text className="text-[16px] font-bold text-gray-600">
                                mins
                              </Text>
                            </Text>
                          ) : (
                            <Text className="text-[32px] font-black text-gray-900 tracking-tighter">
                              5-7{" "}
                              <Text className="text-[16px] font-bold text-gray-600">
                                PM
                              </Text>
                            </Text>
                          )}
                          <Text className="text-[20px] text-gray-300">•</Text>
                        </>
                      )}
                      <Text
                        className={`${currentStatus === "READY_FOR_PICKUP" ? "text-[32px]" : "text-[18px]"} font-black text-gray-900 tracking-tighter`}
                      >
                        2.5{" "}
                        <Text
                          className={`${currentStatus === "READY_FOR_PICKUP" ? "text-[16px]" : "text-[14px]"} font-bold text-gray-600`}
                        >
                          km
                        </Text>
                      </Text>
                    </View>
                    {currentStatus !== "READY_FOR_PICKUP" && (
                      <Text className="text-[11px] font-medium text-gray-500 mt-1">
                        {deliveryMethod === "DELIVERY"
                          ? "Preparing + Delivery Time"
                          : "Your chosen pickup time slot"}
                      </Text>
                    )}
                  </View>
                  <View className="h-12 w-12 bg-blue-100/60 rounded-full border border-blue-200/50 items-center justify-center">
                    <Ionicons
                      name={
                        deliveryMethod === "DELIVERY" ? "bicycle" : "storefront"
                      }
                      size={24}
                      color="#3b82f6"
                    />
                  </View>
                </View>

                {currentStatus === "READY_FOR_PICKUP" && (
                  <Pressable
                    className="mt-4 bg-blue-600 rounded-xl py-3.5 flex-row justify-center items-center active:bg-blue-700 mx-1 shadow-sm"
                    onPress={() =>
                      Linking.openURL(
                        "https://www.google.com/maps/search/?api=1&query=Balaji+Mart",
                      )
                    }
                  >
                    <Ionicons
                      name="navigate"
                      size={18}
                      color="white"
                      style={{ marginRight: 8 }}
                    />
                    <Text className="text-[14px] font-bold text-white tracking-wide">
                      Get Directions to Shop
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

          {/* Rider Info & Map (Only for OUT_FOR_DELIVERY) */}
          {currentStatus === "OUT_FOR_DELIVERY" &&
            deliveryMethod === "DELIVERY" && (
              <View className="mb-6 rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-white">
                {/* Live Tracking Map Area */}
                <View className="h-48 relative">
                  <TrackingMap />
                </View>
                {/* Rider Info */}
                <View className="p-3 flex-row items-center justify-between bg-white">
                  <View className="flex-row items-center gap-3">
                    <View className="h-10 w-10 bg-gray-100 rounded-full items-center justify-center border border-gray-200">
                      <Ionicons name="person" size={20} color="#6b7280" />
                    </View>
                    <View>
                      <Text className="text-[14px] font-bold text-gray-800">
                        Amit Sharma
                      </Text>
                      <Text className="text-[11px] font-medium text-gray-500">
                        Delivery Partner • 4.8 ★
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <Pressable
                      className="h-9 w-9 bg-green-50 rounded-full items-center justify-center border border-green-200 active:opacity-70"
                      onPress={() => Linking.openURL("tel:+919876543210")}
                    >
                      <Ionicons name="call" size={16} color="#16a34a" />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}

          {/* Token QR Code (For OUT_FOR_DELIVERY and READY_FOR_PICKUP) */}
          {(currentStatus === "OUT_FOR_DELIVERY" ||
            currentStatus === "READY_FOR_PICKUP") && (
            <View
              className="mb-2 bg-white rounded-xl border p-5 items-center justify-center"
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
              }}
            >
              <Text className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-4">
                {deliveryMethod === "PICKUP" ? "Pickup Code" : "Delivery Code"}
              </Text>
              <View className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
                <QRCode
                  value="TOKEN-4582"
                  size={160}
                  color="#1f2937"
                  backgroundColor="white"
                />
              </View>
              <Text className="text-[36px] font-black text-gray-800 tracking-[0.2em] mt-1">
                4582
              </Text>
              <Text className="text-[12px] font-medium text-gray-500 mt-2 text-center px-4">
                Show this code to the{" "}
                {deliveryMethod === "PICKUP"
                  ? "shop owner"
                  : "delivery partner"}
              </Text>
            </View>
          )}

          {/* Order Summary Button */}
          <View className="mb-2">
            <Pressable
              className="p-2 bg-white rounded-xl border active:opacity-70"
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
              }}
              onPress={() => router.push("/(app)/(auth)/order-summary")}
            >
              <View className="flex-row justify-between items-center gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center">
                    <Ionicons
                      name="receipt-outline"
                      size={20}
                      color="#1f2937"
                    />
                  </View>
                  <View>
                    <Text className="text-[14px] font-medium text-gray-800">
                      Order Summary
                    </Text>
                    <Text className="text-[10px] font-normal text-gray-500">
                      View items and bill details
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={15} color="#6b7280" />
              </View>
            </Pressable>
          </View>

          {/* Delivery / Pickup Details */}
          {currentStatus !== "REJECTED" &&
            currentStatus !== "CANCELLED" &&
            currentStatus !== "REFUNDED" && (
              <View className="mb-2">
                <Pressable
                  className="p-2 bg-white rounded-xl border"
                  style={{
                    borderWidth: 1,
                    borderColor: "#d1d5db",
                  }}
                  onPress={() => setIsDeliveryExpanded(!isDeliveryExpanded)}
                >
                  <View className="flex-row justify-between items-center gap-2">
                    <View className="flex-row items-center gap-2">
                      <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center">
                        <MapPin size={20} color="#1f2937" />
                      </View>
                      <View>
                        <View className="flex-row items-center gap-2">
                          <Text className="text-[14px] font-medium text-gray-800">
                            {deliveryMethod === "DELIVERY"
                              ? currentStatus === "DELIVERED"
                                ? "Delivered To"
                                : "Delivery To"
                              : currentStatus === "PICKED_UP"
                                ? "Picked Up By"
                                : "Pickup By"}
                          </Text>
                          {deliveryMethod === "DELIVERY" && (
                            <View className="bg-orange-100 px-1.5 py-[2px] rounded text-center items-center justify-center">
                              <Text className="text-[9px] font-bold text-orange-700 tracking-wide uppercase leading-none">
                                Home
                              </Text>
                            </View>
                          )}
                        </View>
                        <Text className="text-[10px] font-normal text-gray-500 mt-0.5">
                          {deliveryMethod === "DELIVERY"
                            ? "View delivery address and contact"
                            : "View pickup person details"}
                        </Text>
                      </View>
                    </View>
                    <Ionicons
                      name={isDeliveryExpanded ? "chevron-up" : "chevron-down"}
                      size={15}
                      color="#6b7280"
                    />
                  </View>

                  {isDeliveryExpanded && (
                    <View className="mt-3 pt-3 border-t border-gray-100">
                      <View className="pl-1">
                        {deliveryMethod === "DELIVERY" && (
                          <Text className="text-[12px] text-gray-600 leading-tight mb-2">
                            123 Main Street, Near City Center, {"\n"}Apartment
                            4B, New Delhi
                          </Text>
                        )}
                        <View className="self-start bg-gray-100 rounded-full px-2.5 py-1 flex-row items-center gap-1">
                          <Text className="text-[11px] font-semibold text-gray-700">
                            Viraj Dayle
                          </Text>
                          <Text className="text-[11px] text-gray-400">•</Text>
                          <Text className="text-[11px] font-medium text-gray-600">
                            +91 9876543210
                          </Text>
                        </View>
                      </View>
                    </View>
                  )}
                </Pressable>
              </View>
            )}

          {/* Payment Details Button */}
          <View className="mb-2">
            <Pressable
              className="p-2 bg-white rounded-xl border"
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
              }}
              onPress={() => setIsPaymentExpanded(!isPaymentExpanded)}
            >
              <View className="flex-row justify-between items-center gap-2">
                <View className="flex-row items-center gap-2">
                  <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center">
                    <Ionicons name="card-outline" size={20} color="#1f2937" />
                  </View>
                  <View>
                    <Text className="text-[14px] font-medium text-gray-800">
                      Payment Details
                    </Text>
                    <Text className="text-[10px] font-normal text-gray-500">
                      View payment method and status
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={isPaymentExpanded ? "chevron-up" : "chevron-down"}
                  size={15}
                  color="#6b7280"
                />
              </View>

              {/* Expanded Content */}
              {isPaymentExpanded && (
                <View className="mt-3 pt-3 border-t border-gray-100 px-1 gap-2">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-[12px] text-gray-500 font-medium">
                      Amount Paid:
                    </Text>
                    <Text className="text-[13px] text-gray-800 font-bold">
                      ₹540
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-[12px] text-gray-500 font-medium">
                      Payment Method:
                    </Text>
                    <Text className="text-[13px] text-gray-800 font-bold">
                      UPI
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center">
                    <Text className="text-[12px] text-gray-500 font-medium">
                      Payment Status:
                    </Text>
                    <Text className="text-[13px] text-green-600 font-bold">
                      Paid ✅
                    </Text>
                  </View>
                  <View className="flex-row justify-between items-center mt-1">
                    <Text className="text-[12px] text-gray-500 font-medium">
                      Transaction ID:
                    </Text>
                    <Text className="text-[12px] text-gray-700 font-semibold tracking-wide">
                      TXN123456789
                    </Text>
                  </View>

                  {/* Refund Information */}
                  {currentStatus === "REFUNDED" && (
                    <>
                      <View className="h-[1px] bg-gray-200 my-2" />
                      <View className="flex-row justify-between items-center mt-1">
                        <Text className="text-[12px] text-gray-500 font-medium">
                          Refund Amount:
                        </Text>
                        <Text className="text-[13px] text-gray-800 font-bold">
                          ₹540
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center mt-1">
                        <Text className="text-[12px] text-gray-500 font-medium">
                          Refund Status:
                        </Text>
                        <Text className="text-[13px] text-green-600 font-bold">
                          Refunded ✅
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center mt-1">
                        <Text className="text-[12px] text-gray-500 font-medium">
                          Refund Reference ID:
                        </Text>
                        <Text className="text-[12px] text-gray-700 font-semibold tracking-wide">
                          REF987654321
                        </Text>
                      </View>
                      <View className="flex-row justify-between items-center mt-1">
                        <Text className="text-[12px] text-gray-500 font-medium">
                          Refund Date:
                        </Text>
                        <Text className="text-[12px] text-gray-700 font-semibold">
                          08 Jun 2026, 06:15 PM
                        </Text>
                      </View>
                    </>
                  )}
                </View>
              )}
            </Pressable>
          </View>
          <OrderStatusTracker
            currentStatus={currentStatus}
            deliveryMethod={deliveryMethod}
          />

          {currentStatus === "REFUNDED" && (
            <View className="mt-6 mb-6 p-3 bg-green-50 rounded-xl border border-green-100 flex-row items-start">
              <Ionicons
                name="checkmark-circle"
                size={18}
                color="#16a34a"
                style={{ marginTop: 2, marginRight: 8 }}
              />
              <Text className="flex-1 text-[12px] text-green-800 leading-tight font-medium">
                Your payment is refunded!
              </Text>
            </View>
          )}

          {(currentStatus === "REJECTED" || currentStatus === "CANCELLED") && (
            <View className="mt-6 mb-6 p-3 bg-red-50 rounded-xl border border-red-100 flex-row items-start">
              <Ionicons
                name="information-circle"
                size={18}
                color="#ef4444"
                style={{ marginTop: 2, marginRight: 8 }}
              />
              <Text className="flex-1 text-[12px] text-red-800 leading-tight font-medium">
                {currentStatus === "CANCELLED"
                  ? "Your order is cancelled! Don't worry, your payment will be refunded to your account within 7 working days."
                  : "Your order was rejected. Don't worry, your payment will be refunded to your account within 7 working days."}
              </Text>
            </View>
          )}

          {currentStatus === "PENDING" && (
            <View className="mt-6 mb-6">
              <View className="flex-row items-start  p-3">
                {/* <Ionicons name="information-circle" size={16} color="#6b7280" /> */}
                <Text className="flex-1 text-[11px] text-gray-500 leading-tight font-medium">
                  Note: On cancelling the order, your payment will be refunded
                  to your account within 7 working days.
                </Text>
              </View>
              <Pressable
                className="w-full bg-red-50 border border-red-200 rounded-xl py-3 items-center justify-center active:opacity-70 flex-row gap-2"
                onPress={() => console.log("Cancel Order")}
              >
                {/* <Ionicons name="close-circle-outline" size={18} color="#EF4444" /> */}
                <Text className="text-red-500 font-bold text-[14px]">
                  Cancel Order
                </Text>
              </Pressable>
            </View>
          )}

          {/* Action Buttons (Only for completed orders) */}
          {(currentStatus === "DELIVERED" || currentStatus === "PICKED_UP") && (
            <View className="mt-2 mb-6 flex-row gap-3">
              <Pressable
                className="flex-1 bg-white border border-gray-300 rounded-xl py-3.5 items-center justify-center flex-row gap-2 active:bg-gray-50 shadow-sm shadow-gray-100"
                onPress={() => ratingBottomSheetRef.current?.present()}
              >
                <Ionicons name="star-outline" size={18} color="#4B5563" />
                <Text className="text-gray-700 font-bold text-[14px] tracking-wide">
                  Rate Us
                </Text>
              </Pressable>
              <Pressable
                className="flex-1 bg-blue-500 rounded-xl py-3.5 items-center justify-center flex-row gap-2 active:opacity-80 shadow-sm shadow-blue-200"
                onPress={() => console.log("Reorder")}
              >
                <Ionicons name="refresh" size={18} color="white" />
                <Text className="text-white font-bold text-[14px] tracking-wide">
                  Reorder
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Help Button */}
      <Pressable
        className="absolute right-4 w-14 h-14 rounded-full bg-black items-center justify-center shadow-lg active:scale-[0.98]"
        style={{
          bottom: Math.max(insets.bottom + 16, 32),
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
        }}
        onPress={() => router.push("/help-support")}
      >
        <Ionicons name="help-buoy-outline" size={28} color="white" />
      </Pressable>

      <RatingBottomSheet
        ref={ratingBottomSheetRef}
        deliveryMethod={deliveryMethod}
      />
    </View>
  );
};

export default ExpandOrder;
