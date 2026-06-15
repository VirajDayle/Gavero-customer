import type { Coupon } from "@/src/types/coupon";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
  Layout,
} from "react-native-reanimated";

interface CouponExpandableRowProps {
  coupon: Coupon;
  isExpanded: boolean;
  onToggle: () => void;
}

export const CouponExpandableRow = ({
  coupon,
  isExpanded,
  onToggle,
}: CouponExpandableRowProps) => {
  return (
    <View className="mb-3 border border-gray-100 rounded-2xl bg-gray-50/50 overflow-hidden">
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onToggle}
        className="flex-row items-center justify-between p-4 bg-white"
      >
        <View className="flex-1 pr-3">
          <View className="flex-row items-center space-x-2 mb-1">
            <View className="bg-orange-100 px-2 py-0.5 rounded-md">
              <Text className="text-[10px] font-bold text-orange-700 tracking-wider uppercase">
                {coupon.code}
              </Text>
            </View>
          </View>
          <Text
            className="text-sm font-semibold text-gray-800"
            numberOfLines={2}
          >
            {coupon.description}
          </Text>
        </View>

        <View className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center">
          {isExpanded ? (
            <ChevronUp size={16} color="#4b5563" />
          ) : (
            <ChevronDown size={16} color="#4b5563" />
          )}
        </View>
      </TouchableOpacity>

      {isExpanded && (
        <Animated.View
          entering={FadeInUp.duration(200)}
          exiting={FadeOutDown.duration(150)}
          layout={Layout.springify()}
          className="border-t border-gray-100 bg-gray-50 p-4"
        >
          <View className="flex-row items-start space-x-1.5">
            <View className="flex-1">
              <Text className="text-xs font-semibold text-gray-700 mb-1">
                Terms & Conditions:
              </Text>
              <Text className="text-xs text-gray-500 leading-relaxed">
                {coupon.terms ||
                  "Valid on selected fresh fruits, vegetables, and dairy items. Cannot be combined with other offers. Minimum purchase thresholds may apply at checkout."}
              </Text>
            </View>
          </View>
        </Animated.View>
      )}
    </View>
  );
};
