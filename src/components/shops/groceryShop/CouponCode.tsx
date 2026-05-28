import type { Coupon } from "@/src/types/coupon";
import React, { useCallback, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Carousel from "react-native-reanimated-carousel";
import { CouponPagination } from "./CouponPagination";

const { width } = Dimensions.get("window");

type CouponCodeProps = {
  coupons: Coupon[];
  onOpenSheet: (coupons: Coupon[], preExpandId?: string | number) => void;
};

const CouponCode = ({ coupons, onOpenSheet }: CouponCodeProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handlePresentModalPress = useCallback(
    (coupon: Coupon) => {
      onOpenSheet(coupons, coupon.id || coupon.code);
    },
    [coupons, onOpenSheet],
  );

  return (
    <View className="py-2">
      <Carousel
        loop
        width={width}
        height={85}
        data={coupons}
        // 1. Remove onSnapToItem completely
        // onSnapToItem={(index) => setActiveIndex(index)} 

        // 2. Add onProgressChange for instant tracking
        onProgressChange={(_, absoluteProgress) => {
          // Round to the nearest whole index instantly during the swipe
          const currentIdx = Math.round(absoluteProgress);

          // Safety check to avoid index out-of-bounds loops
          if (currentIdx >= 0 && currentIdx < coupons.length && currentIdx !== activeIndex) {
            setActiveIndex(currentIdx);
          }
        }}
        renderItem={({ item }) => (
          <LinearGradient
            colors={["#ea580c", "#9a3412"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            className="mx-3 flex-1 shadow-md"
            style={{ borderRadius: 16 }}
          >
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => handlePresentModalPress(item)}
              className="flex-row h-full items-center relative overflow-hidden"
            >
              {/* LEFT SECTION */}
              <View className="flex-1 justify-center pl-4 pr-2 py-3">
                <View className="flex-row items-center space-x-2 mb-1">
                  <View className="h-5 w-5 bg-white/20 rounded-full items-center justify-center">
                    <Image
                      source={require("@/src/assets/images/groceryShop/offer.png")}
                      className="h-5 w-5 tint-white"
                      resizeMode="contain"
                    />
                  </View>
                  <Text className="text-xs font-medium text-orange-200 uppercase tracking-wider ml-1">
                    {"Dairy and Breakfast"}
                  </Text>
                </View>

                <Text
                  className="text-base font-bold text-white leading-tight mb-2"
                  numberOfLines={1}
                >
                  {item.description}
                </Text>

                <View className="self-start bg-white/15 border border-white/30 px-2.5 py-0.5 rounded-md">
                  <Text className="text-[11px] font-mono font-bold text-white tracking-widest uppercase">
                    {item.code}
                  </Text>
                </View>
              </View>

              {/* MIDDLE: Ticket Cutout */}
              <View className="items-center justify-between h-full py-2">
                <View
                  className="w-4 h-2 bg-white rounded-b-full absolute -top-1"
                  style={{ backgroundColor: "#fff" }}
                />
                <View className="w-px flex-1 border-r border-dashed border-white/40 my-1" />
                <View
                  className="w-4 h-2 bg-white rounded-t-full absolute -bottom-1"
                  style={{ backgroundColor: "#fff" }}
                />
              </View>

              {/* RIGHT SECTION */}
              <View className="justify-center items-center px-2 bg-black/10 h-full">
                <View className="h-20 w-20  items-center justify-center">
                  <Image
                    source={require("@/src/assets/images/groceryShop/cleanImages/dairyandb.png")}
                    className="h-full w-full"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        )}
      />

      <CouponPagination coupons={coupons} activeIndex={activeIndex} />
    </View>
  );
};

export default CouponCode;
