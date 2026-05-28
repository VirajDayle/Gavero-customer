import type { Coupon } from "@/src/types/coupon";
import type { SectionItem, Sections } from "@/src/types/grocery";
import type { Product } from "@/src/types/product";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { FlashList } from "@shopify/flash-list";
import { router } from "expo-router";
import { Ticket } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Text, View } from "react-native";
import {
  createAnimatedComponent,
  useAnimatedScrollHandler,
} from "react-native-reanimated";
import Bundles from "./groceryShop/Bundles";
import CouponCode from "./groceryShop/CouponCode";
import { CouponExpandableRow } from "./groceryShop/CouponExpandableRow";
import CustomRow from "./groceryShop/CustomRow";
import FlashSale from "./groceryShop/FlashSale";
import GoToSection from "./groceryShop/GoToSection";
import InternalCategeory from "./groceryShop/InternalCategeory";
import QuickGo from "./groceryShop/QuickGo";
import TopDeal from "./groceryShop/TopDeal";

const AnimatedFlashList = createAnimatedComponent(FlashList);

interface GroceryShopProps {
  sections: Sections;
  headerHeight: number;
  onScroll: ReturnType<typeof useAnimatedScrollHandler>;
  activeColor?: string;
}

const GroceryShop = ({
  sections,
  headerHeight,
  onScroll,
  activeColor,
}: GroceryShopProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const [sheetCoupons, setSheetCoupons] = useState<Coupon[]>([]);
  const [expandedCouponId, setExpandedCouponId] = useState<
    string | number | null
  >(null);

  // Local cart state for the Top Deal horizontal list
  const [topDealCart, setTopDealCart] = useState<Record<number, number>>({});

  const handleTopDealAdd = useCallback((product: Product) => {
    setTopDealCart((prev) => ({ ...prev, [product.id]: 1 }));
  }, []);

  const handleTopDealIncrement = useCallback((product: Product) => {
    setTopDealCart((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] ?? 0) + 1,
    }));
  }, []);

  const handleTopDealDecrement = useCallback((product: Product) => {
    setTopDealCart((prev) => {
      const next = { ...prev };
      if ((next[product.id] ?? 0) <= 1) {
        delete next[product.id];
      } else {
        next[product.id] -= 1;
      }
      return next;
    });
  }, []);

  const snapPoints = useMemo(() => ["75%"], []);

  const handleOpenSheet = useCallback(
    (coupons: Coupon[], preExpandId?: string | number) => {
      setSheetCoupons(coupons);
      setExpandedCouponId(preExpandId ?? null);
      bottomSheetModalRef.current?.present();
    },
    [],
  );

  const toggleExpand = (id: string | number) => {
    setExpandedCouponId((prev) => (prev === id ? null : id));
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    [],
  );

  const handleSeeAllPress = useCallback((sectionId: string) => {
    router.push({ pathname: "/expand-rows", params: { sectionId } });
  }, []);

  const handleQuickGoPress = useCallback((categoryId: string) => {
    router.push({ pathname: "/shop-expand", params: { categoryId } });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: SectionItem }) => {
      if (item.type === "internalCategory") {
        return (
          <View>
            <InternalCategeory categories={item.data} />
          </View>
        );
      }

      if (item.type === "couponSection") {
        return (
          <View>
            <CouponCode coupons={item.data} onOpenSheet={handleOpenSheet} />
          </View>
        );
      }

      if (item.type === "quickGo") {
        return (
          <QuickGo
            title={item.title}
            categories={item.data}
            onCategoryPress={handleQuickGoPress}
          />
        );
      }

      if (item.type === "goToSection") {
        return (
          <GoToSection
            title={item.title}
            products={item.data}
            cartQuantities={topDealCart}
            onAddProduct={handleTopDealAdd}
            onIncrementProduct={handleTopDealIncrement}
            onDecrementProduct={handleTopDealDecrement}
            onSeeAllPress={() => handleSeeAllPress(item.id)}
          />
        );
      }

      if (item.type === "bundles") {
        return (
          <Bundles
            title={item.title}
            products={item.data}
            cartQuantities={topDealCart}
            onAddProduct={handleTopDealAdd}
            onIncrementProduct={handleTopDealIncrement}
            onDecrementProduct={handleTopDealDecrement}
            onSeeAllPress={() => handleSeeAllPress(item.id)}
          />
        );
      }

      if (item.type === "topDeal") {
        return (
          <View>
            <TopDeal
              title={item.title}
              products={item.data}
              cartQuantities={topDealCart}
              onAddProduct={handleTopDealAdd}
              onIncrementProduct={handleTopDealIncrement}
              onDecrementProduct={handleTopDealDecrement}
              onSeeAllPress={() => handleSeeAllPress(item.id)}
            />
          </View>
        );
      }

      if (item.type === "flashSale") {
        return (
          <View>
            <FlashSale
              title={item.title}
              products={item.data}
              endTime={item.endTime}
              cartQuantities={topDealCart}
              onAddProduct={handleTopDealAdd}
              onIncrementProduct={handleTopDealIncrement}
              onDecrementProduct={handleTopDealDecrement}
            />
          </View>
        );
      }

      if (item.type === "customRow") {
        return (
          <View>
            <CustomRow
              title={item.title}
              products={item.data}
              cartQuantities={topDealCart}
              onAddProduct={handleTopDealAdd}
              onIncrementProduct={handleTopDealIncrement}
              onDecrementProduct={handleTopDealDecrement}
              onSeeAllPress={() => handleSeeAllPress(item.id)}
            />
          </View>
        );
      }

      return null;
    },
    [
      handleOpenSheet,
      topDealCart,
      handleTopDealAdd,
      handleTopDealIncrement,
      handleTopDealDecrement,
      handleSeeAllPress,
    ],
  );

  return (
    <View className="flex-1 bg-[#FAFAF7]">
      <AnimatedFlashList
        data={sections}
        keyExtractor={(item) => (item as SectionItem).id}
        renderItem={renderItem as any}
        getItemType={(item) => (item as SectionItem).type}
        ListHeaderComponent={
          <View style={{ height: headerHeight, justifyContent: "flex-end" }}>
            <View
              style={{
                height: 100,
                backgroundColor: activeColor ?? "#B7ECCD",
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
              }}
            />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        estimatedItemSize={400}
      />

      {/* Bottom Sheet lives OUTSIDE the FlashList — required for portal to work */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 48 }}
      >
        <BottomSheetView className="flex-1 px-4 pt-2">
          {/* Header */}
          <View className="flex-row items-center space-x-2.5 mb-5 pb-3 border-b border-gray-100">
            <View className="p-2 bg-orange-50 rounded-xl">
              <Ticket size={22} color="#ea580c" />
            </View>
            <View className="ml-2">
              <Text className="text-lg font-bold text-gray-900">
                Available Coupons
              </Text>
              <Text className="text-xs text-gray-500">
                Tap on any coupon voucher to view constraints
              </Text>
            </View>
          </View>

          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {sheetCoupons.map((coupon) => {
              const couponId = coupon.id || coupon.code;
              return (
                <CouponExpandableRow
                  key={couponId}
                  coupon={coupon}
                  isExpanded={expandedCouponId === couponId}
                  onToggle={() => toggleExpand(couponId)}
                />
              );
            })}
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default GroceryShop;
