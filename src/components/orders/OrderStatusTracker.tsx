import React, { useEffect } from "react";
import { Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { STATUS } from "./OrderCard";

export type OrderStatusKey =
  | "PENDING"
  | "ACCEPTED"
  | "PREPARING"
  | "ASSIGNED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "READY_FOR_PICKUP"
  | "PICKED_UP"
  | "REJECTED"
  | "CANCELLED"
  | "REFUNDED";

interface OrderStatusTrackerProps {
  currentStatus: OrderStatusKey;
  deliveryMethod?: "DELIVERY" | "PICKUP";
}

const HAPPY_FLOW = [
  {
    id: "PENDING",
    title: "Pending Confirmation",
    desc: "Your order has been placed and we are waiting for the shop to accept.",
  },
  {
    id: "ACCEPTED",
    title: "Accepted",
    desc: "The shop has accepted your order.",
  },
  {
    id: "PREPARING",
    title: "Preparing/Packing",
    desc: "The shop is preparing your order.",
  },
  {
    id: "ASSIGNED",
    title: "Delivery Partner Assigned",
    desc: "A delivery partner has been assigned to your order.",
  },
  {
    id: "OUT_FOR_DELIVERY",
    title: "Out for Delivery",
    desc: "Your order is out for delivery.",
  },
  {
    id: "DELIVERED",
    title: "Delivered",
    desc: "Your order has been delivered.",
  },
];

const PICKUP_FLOW = [
  {
    id: "PENDING",
    title: "Pending Confirmation",
    desc: "Your order has been placed and we are waiting for the shop to accept.",
  },
  {
    id: "ACCEPTED",
    title: "Accepted",
    desc: "The shop has accepted your order.",
  },
  {
    id: "PREPARING",
    title: "Preparing/Packing",
    desc: "The shop is preparing your order.",
  },
  {
    id: "READY_FOR_PICKUP",
    title: "Ready for Pickup",
    desc: "Your order is ready to be picked up from the shop.",
  },
  {
    id: "PICKED_UP",
    title: "Picked Up",
    desc: "You have picked up your order.",
  },
];

const ITEM_HEIGHT = 56; // h-14 is 56px to give a bit more breathing room

const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({
  currentStatus,
  deliveryMethod = "DELIVERY",
}) => {
  const progressHeight = useSharedValue(0);

  const isNegative = ["REJECTED", "CANCELLED", "REFUNDED"].includes(
    currentStatus,
  );

  // Auto-infer pickup flow if the status is explicitly a pickup status
  const isPickupStatus =
    currentStatus === "READY_FOR_PICKUP" || currentStatus === "PICKED_UP";
  const actualDeliveryMethod = isPickupStatus ? "PICKUP" : deliveryMethod;

  const flowBase = actualDeliveryMethod === "PICKUP" ? PICKUP_FLOW : HAPPY_FLOW;
  let displayFlow = [...flowBase];
  let targetIndex = flowBase.findIndex((s) => s.id === currentStatus);

  if (isNegative) {
    if (currentStatus === "REFUNDED") {
      displayFlow = [
        flowBase[0],
        {
          id: "CANCELLED",
          title: "Cancelled / Rejected",
          desc: "Your order was cancelled or rejected.",
        },
        {
          id: "REFUNDED",
          title: "Refunded",
          desc: "Your payment has been successfully refunded.",
        },
      ];
      targetIndex = 2;
    } else {
      displayFlow = [
        flowBase[0],
        {
          id: currentStatus,
          title: currentStatus === "CANCELLED" ? "Cancelled" : "Rejected",
          desc: `Your order has been ${currentStatus.toLowerCase()}.`,
        },
      ];
      targetIndex = 1;
    }
  } else if (targetIndex === -1) {
    targetIndex = 0;
  }

  useEffect(() => {
    // The height should reach the center of the current active item.
    // If targetIndex is 0, height = ITEM_HEIGHT / 2
    const target = targetIndex * ITEM_HEIGHT + ITEM_HEIGHT / 2;
    progressHeight.value = withSpring(target, {
      damping: 25,
      stiffness: 50,
    });
  }, [currentStatus, targetIndex]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      height: progressHeight.value,
    };
  });

  return (
    <View className="mt-4 mx-2">
      <View className="flex-row items-center gap-2 mb-4 ml-1">
        <Text className="text-[16px] font-bold text-gray-900">
          Order Status
        </Text>
        <View className="bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">
          <Text className="text-[10px] font-bold text-blue-600 tracking-wider uppercase">
            {actualDeliveryMethod}
          </Text>
        </View>
      </View>
      <View className="flex-row gap-5 relative ml-2">
        {/* Background Gray Line */}
        <View
          className="w-px bg-gray-200 absolute left-0 top-0"
          style={{
            height: (displayFlow.length - 1) * ITEM_HEIGHT + ITEM_HEIGHT / 2,
          }}
        />

        {/* Animated Progress Line */}
        <Animated.View
          className="w-px absolute left-0 top-0 items-center z-10 overflow-visible"
          style={[
            animatedStyle,
            { backgroundColor: STATUS[currentStatus].textColor },
          ]}
        >
          <View
            className="h-3 w-3 rounded-full absolute -bottom-1.5"
            style={{ backgroundColor: STATUS[currentStatus].textColor }}
          />
        </Animated.View>

        {/* Status Items */}
        <View className="flex-1 ml-5">
          {displayFlow.map((item, index) => {
            const isReached = index <= targetIndex;
            const isCurrent = index === targetIndex;

            return (
              <View
                key={item.id}
                className="justify-center pr-2"
                style={{ height: ITEM_HEIGHT }}
              >
                <Text
                  className={`text-base font-semibold leading-5 ${
                    isReached ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {item.title}
                  {item.id === "PREPARING" && (
                    <Text className="text-[12px] font-medium text-gray-500">
                      {" "}
                      (10-15 mins)
                    </Text>
                  )}
                </Text>
                <Text
                  className={`text-sm italic leading-4 mt-1 ${
                    isReached ? "text-gray-500" : "text-gray-400"
                  }`}
                  numberOfLines={2}
                >
                  {item.desc}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

export default OrderStatusTracker;
