import Header from "@/src/components/ui/Header";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const FAQS = [
  {
    category: "Payment & Refunds",
    items: [
      {
        q: "When will I get my refund?",
        a: "Refunds are typically processed within 5-7 business days depending on your bank. If the order was cancelled by the shop, the refund is initiated instantly from our end.",
      },
      {
        q: "My payment failed but money was deducted.",
        a: "Don't worry! Failed transactions are automatically reversed by your bank within 48 to 72 hours. Your money is safe.",
      },
      {
        q: "How do I use a coupon code?",
        a: "You can apply available coupon codes at the cart page before proceeding to checkout. Click on 'Apply Coupon' to see eligible offers.",
      },
    ],
  },
  {
    category: "Delivery & Orders",
    items: [
      {
        q: "How can I track my order?",
        a: "You can track your active orders in the 'Orders' tab. Tap on an active order to see live tracking and rider details.",
      },
      {
        q: "Can I cancel my order?",
        a: "You can cancel your order before the shop confirms it. Once confirmed or preparing, cancellation is not allowed to prevent food wastage.",
      },
      {
        q: "What if my delivery is late?",
        a: "We try our best to deliver on time. In case of unexpected delays due to weather or traffic, our support team is available to assist you.",
      },
    ],
  },
  {
    category: "Account & Other",
    items: [
      {
        q: "How can I change my delivery address?",
        a: "You can add or modify your addresses from the Cart page during checkout, or from your Profile > Saved Addresses.",
      },
      {
        q: "How do I report an issue with an item?",
        a: "Please navigate to the specific order in your Orders history, and use the 'Help' or 'Chat Support' option to report item issues within 24 hours.",
      },
    ],
  },
];

const FAQItem = ({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="mb-2">
      <Pressable
        className={clsx(
          "p-3 bg-white",
          expanded ? "rounded-t-xl border-b-0" : "rounded-xl border",
        )}
        style={{ borderWidth: 1, borderColor: "#d1d5db" }}
        onPress={() => setExpanded(!expanded)}
      >
        <View className="flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-3 flex-1 pr-2">
            <View className="h-8 w-8 bg-gray-100 rounded-lg items-center justify-center">
              <Ionicons name="help" size={16} color="#4b5563" />
            </View>
            <Text className="text-[13px] font-medium text-gray-800 flex-1">
              {question}
            </Text>
          </View>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#6b7280"
          />
        </View>
      </Pressable>
      {expanded && (
        <View
          className="bg-gray-50/50 p-4 rounded-b-xl border-t-0 mt-0"
          style={{ borderWidth: 1, borderColor: "#d1d5db" }}
        >
          <Text className="text-[13px] text-gray-600 leading-relaxed">
            {answer}
          </Text>
        </View>
      )}
    </View>
  );
};

const HelpSupport = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Bottom Sheet & Toast State
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["65%", "85%"], []);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const toastTranslateY = useSharedValue(-150);
  const [toastMessage, setToastMessage] = useState("");

  const handlePresentModalPress = useCallback((order: any) => {
    setSelectedOrder(order);
    setSelectedIssue(null);
    bottomSheetModalRef.current?.present();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.3}
      />
    ),
    [],
  );

  const handleRegisterComplaint = () => {
    bottomSheetModalRef.current?.dismiss();
    setToastMessage(
      `Complaint registered for Order #${selectedOrder?.orderId}. Our team will contact you shortly.`,
    );
    toastTranslateY.value = withTiming(60, { duration: 400 });
    setTimeout(() => {
      toastTranslateY.value = withTiming(-150, { duration: 400 });
    }, 5000);
  };

  const animatedToastStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: toastTranslateY.value }],
    position: "absolute",
    top: 0,
    left: 16,
    right: 16,
    zIndex: 100,
  }));

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAF7]">
      <Header title="Help & Support" back border />

      {/* Toast Notification */}
      <Animated.View
        style={animatedToastStyle}
        className="bg-green-50 border border-green-200 p-4 rounded-2xl shadow-sm flex-row items-center gap-3"
      >
        <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
        <Text className="text-[13px] text-gray-800 font-medium flex-1 leading-5">
          {toastMessage}
        </Text>
      </Animated.View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Contact Options */}
        <View className="px-4 mt-5 mb-6">
          <Text className="text-[16px] font-bold text-gray-900 mb-4">
            Get in touch
          </Text>

          <View className="flex-row gap-3">
            <Pressable
              className="flex-1 bg-emerald-50 rounded-[20px] py-3.5 px-3 items-center justify-center overflow-hidden border border-emerald-100/60 active:opacity-80"
              onPress={() => Linking.openURL("tel:18001234567")}
            >
              <View
                className="h-10 w-10 bg-white rounded-full items-center justify-center mb-1.5"
                style={{
                  shadowColor: "#10b981",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons name="call" size={18} color="#059669" />
              </View>
              <Text className="text-[13px] font-extrabold text-emerald-900 tracking-tight">
                Call Us
              </Text>
              <Text className="text-[9px] font-bold text-emerald-700/80 mt-0.5 tracking-wider uppercase">
                Instantly
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 bg-blue-50 rounded-[20px] py-3.5 px-3 items-center justify-center overflow-hidden border border-blue-100/60 active:opacity-80"
              onPress={() => Linking.openURL("mailto:support@gavero.com")}
            >
              <View
                className="h-10 w-10 bg-white rounded-full items-center justify-center mb-1.5"
                style={{
                  shadowColor: "#3b82f6",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons name="mail" size={18} color="#2563eb" />
              </View>
              <Text className="text-[13px] font-extrabold text-blue-900 tracking-tight">
                Email Us
              </Text>
              <Text className="text-[9px] font-bold text-blue-700/80 mt-0.5 tracking-wider uppercase">
                Within 24H
              </Text>
            </Pressable>

            <Pressable
              className="flex-1 bg-green-50 rounded-[20px] py-3.5 px-3 items-center justify-center overflow-hidden border border-green-100/60 active:opacity-80"
              onPress={() => Linking.openURL("https://wa.me/18001234567")}
            >
              <View
                className="h-10 w-10 bg-white rounded-full items-center justify-center mb-1.5"
                style={{
                  shadowColor: "#22c55e",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Ionicons name="logo-whatsapp" size={18} color="#16a34a" />
              </View>
              <Text className="text-[13px] font-extrabold text-green-900 tracking-tight">
                WhatsApp
              </Text>
              <Text className="text-[9px] font-bold text-green-700/80 mt-0.5 tracking-wider uppercase">
                Live Chat
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Recent Orders Horizontal Scroll */}
        <View className="mb-6">
          <View className="px-4 flex-row justify-between items-center mb-3">
            <Text className="text-[16px] font-bold text-gray-900">
              Help with recent orders
            </Text>
            <Pressable onPress={() => router.push("/(app)/(tabs)/orders")}>
              <Text className="text-[12px] font-bold text-orange-600">
                View All
              </Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {[1, 2].map((_, idx) => {
              const orderId = idx === 0 ? "OD98237462" : "OD45829371";
              return (
                <Pressable
                  key={idx}
                  className="w-[280px] p-3 bg-white rounded-xl border"
                  style={{ borderColor: "#d1d5db", borderWidth: 1 }}
                  onPress={() =>
                    handlePresentModalPress({
                      id: idx,
                      shopName: "Balaji Mart",
                      orderId,
                    })
                  }
                >
                  <View className="flex-row justify-between items-start mb-3 border-b border-gray-100 pb-2">
                    <View className="flex-row items-start gap-2">
                      <View className="h-10 w-10 bg-gray-100 rounded-xl items-center justify-center overflow-hidden border border-gray-200 mt-0.5">
                        <Image
                          source={require("@/src/assets/images/balajimart.png")}
                          className="h-full w-full"
                          resizeMode="cover"
                        />
                      </View>
                      <View>
                        <Text className="text-[14px] font-bold text-gray-800">
                          Balaji Mart
                        </Text>
                        <Text className="text-[10px] font-bold text-gray-500 mt-0.5">
                          Order #{orderId}
                        </Text>
                        <Text className="text-[10px] font-medium text-gray-500 mt-0.5">
                          {idx === 0
                            ? "Today, 10:30 AM"
                            : "Yesterday, 08:15 PM"}
                        </Text>
                      </View>
                    </View>
                    <View className="bg-green-50 px-2 py-1 rounded border border-green-200 mt-1">
                      <Text className="text-[9px] font-bold text-green-700 uppercase tracking-wider">
                        Delivered
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row justify-between items-center bg-gray-50/50 p-2 rounded-lg border border-gray-100">
                    <Text className="text-[12px] font-semibold text-gray-700">
                      {idx === 0 ? "₹1,862 • 2 items" : "₹450 • 1 item"}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <Text className="text-[11px] font-medium text-gray-800">
                        Get Help
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={12}
                        color="#4b5563"
                      />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* FAQs Section */}
        <View className="px-4 mb-12">
          <Text className="text-[16px] font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </Text>

          {FAQS.map((faqGroup, idx) => (
            <View key={idx} className="mb-6">
              <Text className="text-[12px] font-bold text-gray-500 mb-3 px-1 uppercase tracking-widest">
                {faqGroup.category}
              </Text>
              <View className="gap-2">
                {faqGroup.items.map((item, itemIdx) => (
                  <FAQItem key={itemIdx} question={item.q} answer={item.a} />
                ))}
              </View>
            </View>
          ))}

          {/* Footer Text */}
          <View className="items-center mt-4 mb-8">
            <Text className="text-[12px] text-gray-400 font-medium">
              Gavero Customer App v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Sheet for Reporting Issues */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView
          style={{
            flex: 1,
            backgroundColor: "#fff",
          }}
        >
          <View className="px-5 py-4 border-b border-gray-100 flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-900">
              Report an Issue
            </Text>
            <Pressable
              onPress={() => bottomSheetModalRef.current?.dismiss()}
              className="p-1.5 rounded-full bg-gray-100 active:opacity-60"
            >
              <Ionicons name="close" size={20} color="#374151" />
            </Pressable>
          </View>
          <BottomSheetScrollView
            className="flex-1 px-5"
            contentContainerStyle={{
              paddingBottom: Math.max(insets.bottom, 100),
              paddingTop: 16,
            }}
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-[15px] font-medium text-gray-800 mb-4 leading-6">
              What went wrong with your order from{" "}
              <Text className="font-bold">{selectedOrder?.shopName}</Text>?
            </Text>

            <View className="gap-3">
              {[
                "Item missing from order",
                "Order was delayed",
                "Food quality issue",
                "Wrong item delivered",
                "Packaging was damaged",
                "Payment not processed properly",
                "Delivery partner behavior",
                "Cancel order",
              ].map((issue, index) => (
                <Pressable
                  key={index}
                  onPress={() => setSelectedIssue(issue)}
                  className={clsx(
                    "p-4 rounded-xl border flex-row items-center justify-between",
                    selectedIssue === issue
                      ? "bg-green-50 border-green-500"
                      : "bg-white border-gray-200",
                  )}
                >
                  <Text
                    className={clsx(
                      "text-[14px] font-medium",
                      selectedIssue === issue
                        ? "text-green-800"
                        : "text-gray-700",
                    )}
                  >
                    {issue}
                  </Text>
                  <View
                    className={clsx(
                      "h-5 w-5 rounded-full border items-center justify-center",
                      selectedIssue === issue
                        ? "border-green-500 bg-green-500"
                        : "border-gray-300 bg-white",
                    )}
                  >
                    {selectedIssue === issue && (
                      <Ionicons name="checkmark" size={12} color="#fff" />
                    )}
                  </View>
                </Pressable>
              ))}
            </View>

            <Pressable
              className={clsx(
                "mt-6 py-4 rounded-xl items-center justify-center",
                selectedIssue
                  ? "bg-green-700 active:bg-green-800 shadow-sm"
                  : "bg-gray-200",
              )}
              disabled={!selectedIssue}
              onPress={handleRegisterComplaint}
            >
              <Text
                className={clsx(
                  "text-[15px] font-bold",
                  selectedIssue ? "text-white" : "text-gray-400",
                )}
              >
                Register Complaint
              </Text>
            </Pressable>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </SafeAreaView>
  );
};

export default HelpSupport;
