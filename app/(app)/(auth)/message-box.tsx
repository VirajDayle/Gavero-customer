import Header from "@/src/components/ui/Header";
import { FlashList } from "@shopify/flash-list";
import {
  BadgeCheck,
  Bike,
  CircleCheck,
  CircleX,
  Package,
  Shield,
  ShoppingBag,
  Star,
  User,
  Wallet,
} from "lucide-react-native";
import { styled } from "nativewind";
import React, { useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

type NotificationType =
  | "ORDER_RECEIVED"
  | "ORDER_ACCEPTED"
  | "ORDER_CANCELLED"
  | "ORDER_PACKED"
  | "RIDER_ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "RATING_REQUEST"
  | "OTP"
  | "PAYMENT";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  shopName?: string;
  shopLogo?: string;
}

const MOCK_NOTIFICATIONS: { title: string; data: Notification[] }[] = [
  {
    title: "Today",
    data: [
      {
        id: "1",
        type: "OUT_FOR_DELIVERY",
        title: "Your order is on the way",
        description: "Rahul has picked up your order and is heading your way.",
        timestamp: "5m ago",
        isRead: false,
        shopName: "Burger Hub",
        shopLogo:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop",
      },
      {
        id: "2",
        type: "OTP",
        title: "Delivery Verification",
        description:
          "Delivery partner has arrived. Your verification OTP is 4582.",
        timestamp: "20m ago",
        isRead: false,
        shopName: "Burger Hub",
      },
      {
        id: "3",
        type: "ORDER_PACKED",
        title: "Order Prepared",
        description: "Your order is packed and ready for dispatch.",
        timestamp: "35m ago",
        isRead: true,
        shopName: "Burger Hub",
        shopLogo:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop",
      },
      {
        id: "8",
        type: "ORDER_ACCEPTED",
        title: "Order Accepted",
        description:
          "Burger Hub has accepted your order and started preparing it.",
        timestamp: "50m ago",
        isRead: true,
        shopName: "Burger Hub",
        shopLogo:
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=200&h=200&fit=crop",
      },
    ],
  },
  {
    title: "Yesterday",
    data: [
      {
        id: "4",
        type: "RATING_REQUEST",
        title: "Rate your experience",
        description: "How was your food from Pizza Paradise? Leave a rating.",
        timestamp: "1d",
        isRead: true,
        shopName: "Pizza Paradise",
        shopLogo:
          "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&h=200&fit=crop",
      },
      {
        id: "5",
        type: "DELIVERED",
        title: "Order Delivered",
        description: "Your order has been successfully delivered.",
        timestamp: "1d",
        isRead: true,
      },
    ],
  },
  {
    title: "Earlier",
    data: [
      {
        id: "6",
        type: "PAYMENT",
        title: "Refund Processed",
        description:
          "₹249 refund has been processed successfully to your wallet.",
        timestamp: "5 Jun",
        isRead: true,
      },
      {
        id: "7",
        type: "ORDER_CANCELLED",
        title: "Order Cancelled",
        description:
          "Your order from Fresh Mart was cancelled. Refund details are available.",
        timestamp: "5 Jun",
        isRead: true,
        shopName: "Fresh Mart",
        shopLogo:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop",
      },
      {
        id: "9",
        type: "ORDER_RECEIVED",
        title: "Order Received",
        description:
          "Your order has been received and is awaiting confirmation.",
        timestamp: "5 Jun",
        isRead: true,
        shopName: "Fresh Mart",
        shopLogo:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop",
      },
    ],
  },
];

const getNotificationIcon = (type: NotificationType, isSmall = false) => {
  const iconProps = { size: isSmall ? 16 : 28, strokeWidth: 2 };
  switch (type) {
    case "ORDER_RECEIVED":
      return <ShoppingBag {...iconProps} color="#2563eb" />; // blue-600
    case "ORDER_ACCEPTED":
      return <CircleCheck {...iconProps} color="#059669" />; // emerald-600
    case "ORDER_CANCELLED":
      return <CircleX {...iconProps} color="#dc2626" />; // red-600
    case "ORDER_PACKED":
      return <Package {...iconProps} color="#d97706" />; // amber-600
    case "RIDER_ASSIGNED":
      return <User {...iconProps} color="#4f46e5" />; // indigo-600
    case "OUT_FOR_DELIVERY":
      return <Bike {...iconProps} color="#7c3aed" />; // violet-600
    case "DELIVERED":
      return <BadgeCheck {...iconProps} color="#059669" />; // emerald-600
    case "RATING_REQUEST":
      return <Star {...iconProps} color="#ca8a04" />; // yellow-600
    case "OTP":
      return <Shield {...iconProps} color="#0d9488" />; // teal-600
    case "PAYMENT":
      return <Wallet {...iconProps} color="#0891b2" />; // cyan-600
  }
};

type ListItem =
  | { type: "header"; title: string }
  | { type: "item"; notification: Notification; isLastInSection: boolean };

const MessageBox = () => {
  const handlePress = (notification: Notification) => {
    // Navigate based on notification type
    // e.g., if (notification.type === 'OTP') router.push('/order-details')
    console.log("Pressed notification:", notification.title);
  };

  const flattenedData = useMemo(() => {
    const data: ListItem[] = [];
    MOCK_NOTIFICATIONS.forEach((section) => {
      data.push({ type: "header", title: section.title });
      section.data.forEach((notification, index) => {
        data.push({
          type: "item",
          notification,
          isLastInSection: index === section.data.length - 1,
        });
      });
    });
    return data;
  }, []);

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === "header") {
      return (
        <View className="px-4">
          <Text className="text-gray-500 font-bold text-xs mt-4 mb-3 uppercase tracking-wider">
            {item.title}
          </Text>
        </View>
      );
    }

    const { notification, isLastInSection } = item;
    const isUnread = !notification.isRead;

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => handlePress(notification)}
        className={`px-4 py-3 flex-row items-start ${
          isUnread ? "bg-blue-50/50" : "bg-white"
        } ${isLastInSection ? "" : "border-b border-gray-100"}`}
      >
        {/* Avatar Area */}
        <View className="mr-3.5 items-center justify-center">
          <View
            className={`w-14 h-14 rounded-full items-center justify-center ${
              notification.shopLogo
                ? ""
                : isUnread
                  ? "bg-white shadow-sm shadow-blue-100/50"
                  : "bg-gray-50"
            }`}
          >
            {notification.shopLogo ? (
              <Image
                source={{ uri: notification.shopLogo }}
                className="w-14 h-14 rounded-full border border-gray-100"
                resizeMode="cover"
              />
            ) : (
              getNotificationIcon(notification.type, false)
            )}
          </View>
          {/* Small badge if shop logo is present */}
          {notification.shopLogo && (
            <View className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-50">
              {getNotificationIcon(notification.type, true)}
            </View>
          )}
        </View>

        {/* Content Area */}
        <View className="flex-1 justify-center py-0.5">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-2">
              {notification.shopName && (
                <Text
                  className={`text-[10px] font-bold mb-0.5 uppercase tracking-wider ${
                    isUnread ? "text-blue-600" : "text-slate-400"
                  }`}
                >
                  {notification.shopName}
                </Text>
              )}
              <Text
                className={`text-[15px] leading-5 ${
                  isUnread
                    ? "font-bold text-gray-900"
                    : "font-medium text-gray-700"
                }`}
                numberOfLines={1}
              >
                {notification.title}
              </Text>
            </View>
            <View className="flex-row items-center mt-1">
              {isUnread && (
                <View className="w-2 h-2 rounded-full bg-blue-500 mr-1.5" />
              )}
              <Text
                className={`text-[11px] ${
                  isUnread
                    ? "text-blue-600 font-semibold"
                    : "text-gray-400 font-medium"
                }`}
              >
                {notification.timestamp}
              </Text>
            </View>
          </View>
          <Text
            className={`text-[13px] mt-1 ${
              isUnread ? "text-gray-700" : "text-gray-500"
            }`}
            style={{ lineHeight: 18 }}
            numberOfLines={2}
          >
            {notification.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header title="Notifications" back border />
      <View className="flex-1">
        <FlashList
          data={flattenedData}
          renderItem={renderItem}
          estimatedItemSize={120}
          getItemType={(item) => item.type}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, paddingTop: 8 }}
        />
      </View>
    </SafeAreaView>
  );
};

export default MessageBox;
