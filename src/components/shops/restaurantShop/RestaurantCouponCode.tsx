import type { Coupon } from "@/src/types/coupon";
import React, { useCallback, useState } from "react";
import { Dimensions, Image, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Carousel from "react-native-reanimated-carousel";
import { CouponPagination } from "../groceryShop/CouponPagination"; // Reusing your existing pagination component

const { width } = Dimensions.get("window");

type CouponCodeProps = {
  coupons: Coupon[];
  onOpenSheet: (coupons: Coupon[], preExpandId?: string | number) => void;
};

const RestaurantCouponCode = ({ coupons, onOpenSheet }: CouponCodeProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const handlePresentModalPress = useCallback(
    (coupon: Coupon) => {
      onOpenSheet(coupons, coupon.id || coupon.code);
    },
    [coupons, onOpenSheet],
  );

  return (
    <View className="py-2.5">
      <Carousel
        loop
        width={width}
        height={90} // Slightly taller for better text spacing
        data={coupons}
        onProgressChange={(_, absoluteProgress) => {
          const currentIdx = Math.round(absoluteProgress);
          // Infinite loop index normalizing safety check
          const normalizedIdx =
            ((currentIdx % coupons.length) + coupons.length) % coupons.length;

          if (normalizedIdx !== activeIndex) {
            setActiveIndex(normalizedIdx);
          }
        }}
        renderItem={({ item }) => (
          <LinearGradient
            // Premium Restaurant Theme: Midnight Charcoal to Vibrant Fire Red/Crimson
            colors={["#1e1b4b", "#dc2626"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="mx-3 flex-1 shadow-lg"
            style={{ borderRadius: 14 }}
          >
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => handlePresentModalPress(item)}
              className="flex-row h-full items-center relative overflow-hidden"
            >
              {/* Subtle Elegant Background Graphic overlay for food texture vibe */}
              <View className="absolute inset-0 bg-black/10 opacity-40" />

              {/* LEFT SECTION: Offer details */}
              <View className="flex-1 justify-center pl-4 pr-1 py-2 z-10">
                <View className="flex-row items-center mb-1">
                  {/* Small culinary-themed tag/icon */}
                  <Image
                    source={require("@/src/assets/images/restaurantShop/chef-hat.png")}
                    className="h-3.5 w-3.5"
                    style={{ tintColor: "#fda4af" }}
                    resizeMode="contain"
                  />
                  <Text className="text-[10px] font-bold text-rose-300 uppercase tracking-widest ml-1.5">
                    {item.category || "Gourmet Deal"}
                  </Text>
                </View>

                {/* Offer Headline */}
                <Text
                  className="text-base font-extrabold text-white leading-tight mb-1.5 tracking-tight"
                  numberOfLines={1}
                >
                  {item.description}
                </Text>

                {/* Promo Code Pill - Styled clean & modern */}
                <View className="self-start bg-white px-2 py-0.5 rounded-md shadow-sm">
                  <Text className="text-[10px] font-mono font-black text-neutral-900 tracking-wider">
                    {item.code}
                  </Text>
                </View>
              </View>

              {/* RIGHT SECTION: The feature image container */}
              <View className="justify-center items-center pr-4 pl-2 h-full z-10">
                <View className="h-16 w-16 p-1 items-center justify-center">
                  <Image
                    source={
                      item.imageType === "delivery"
                        ? require("@/src/assets/images/restaurantShop/hot-delivery.png")
                        : require("@/src/assets/images/restaurantShop/chef-hat.png")
                    }
                    className="h-full w-full"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </TouchableOpacity>
          </LinearGradient>
        )}
      />

      {/* Reusing your indicator */}
      <CouponPagination coupons={coupons} activeIndex={activeIndex} />
    </View>
  );
};

export default RestaurantCouponCode;
