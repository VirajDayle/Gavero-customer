import { ShopType } from "@/src/types";
import type { Coupon } from "@/src/types/coupon";
import type { SectionItem, Sections } from "@/src/types/grocery";
import type { Product } from "@/src/types/product";
import { Ionicons } from "@expo/vector-icons";
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
import { Pressable, Text, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import SearchBar from "../ui/SearchBar";
import ShopTopSections from "../ui/ShopTopSections";
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

const HeaderSpacerItem = ({
  style,
  currentShop,
  changeShop,
  onLayout,
}: {
  style: any;
  currentShop: ShopType;
  changeShop: React.Dispatch<React.SetStateAction<ShopType>>;
  onLayout?: (e: any) => void;
}) => (
  <View onLayout={onLayout}>
    <Animated.View style={style} />
    <View className="bg-[#FAFAF7]">
      <ShopTopSections currentShop={currentShop} changeShop={changeShop} />
    </View>
  </View>
);

const StickySearchBarItem = ({
  scrollY,
  scrollThresholdSv,
}: {
  scrollY: SharedValue<number>;
  scrollThresholdSv: SharedValue<number>;
}) => {
  const animatedBackButtonStyle = useAnimatedStyle(() => {
    // Add a small buffer (e.g., 20px) to make sure it only shows when fully sticky
    const threshold =
      scrollThresholdSv.value > 0 ? scrollThresholdSv.value - 20 : 200;
    const isSticky = scrollY.value >= threshold;
    return {
      opacity: withTiming(isSticky ? 1 : 0, { duration: 180 }),
      width: withTiming(isSticky ? 40 : 0, { duration: 180 }),
      marginRight: withTiming(isSticky ? 3 : 0, { duration: 180 }),
      marginTop: withTiming(isSticky ? 8 : 0, { duration: 180 }),
    };
  });

  return (
    <View style={{ backgroundColor: "#B7ECCD" }}>
      <View className="px-3 flex-row items-center justify-between h-14 mb-2">
        <Animated.View
          style={[animatedBackButtonStyle, { overflow: "hidden" }]}
        >
          <Pressable
            className="w-9 h-9 items-center justify-center bg-white rounded-full active:opacity-60"
            hitSlop={8}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </Pressable>
        </Animated.View>
        <View className="flex-1 justify-center mt-2">
          <SearchBar className="w-full" placeholderText="search from grocery" />
        </View>
      </View>
      {/* ── Animated Bottom Border ── */}
      <View className="absolute -bottom-px left-0 right-0 h-px bg-gray-200" />
    </View>
  );
};

interface GroceryShopProps {
  sections: Sections;
  onScroll: ReturnType<typeof useAnimatedScrollHandler>;
  headerHeightSv: SharedValue<number>;
  currentShop: ShopType;
  changeShop: React.Dispatch<React.SetStateAction<ShopType>>;
  scrollY: SharedValue<number>;
}

const GroceryShop = ({
  sections,
  onScroll,
  headerHeightSv,
  currentShop,
  changeShop,
  scrollY,
}: GroceryShopProps) => {
  const scrollThresholdSv = useSharedValue(200);

  const headerSpacerStyle = useAnimatedStyle(() => ({
    height: headerHeightSv.value,
  }));

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

  const extendedData = useMemo(
    () => [
      { id: "header-spacer", type: "headerSpacer" } as SectionItem,
      { id: "sticky-search-bar", type: "stickySearchBar" } as SectionItem,
      ...sections,
    ],
    [sections],
  );

  const renderItem = useCallback(
    ({ item }: { item: SectionItem }) => {
      if (item.type === "headerSpacer") {
        return (
          <HeaderSpacerItem
            style={headerSpacerStyle}
            currentShop={currentShop}
            changeShop={changeShop}
            onLayout={(e) => {
              scrollThresholdSv.value = e.nativeEvent.layout.height;
            }}
          />
        );
      }

      let content = null;
      if (item.type === "stickySearchBar") {
        content = (
          <StickySearchBarItem
            scrollY={scrollY}
            scrollThresholdSv={scrollThresholdSv}
          />
        );
      } else if (item.type === "internalCategory") {
        content = (
          <View>
            <InternalCategeory categories={item.data} />
          </View>
        );
      } else if (item.type === "couponSection") {
        content = (
          <View>
            <CouponCode coupons={item.data} onOpenSheet={handleOpenSheet} />
          </View>
        );
      } else if (item.type === "quickGo") {
        content = (
          <QuickGo
            title={item.title}
            categories={item.data}
            onCategoryPress={handleQuickGoPress}
          />
        );
      } else if (item.type === "goToSection") {
        content = (
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
      } else if (item.type === "bundles") {
        content = (
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
      } else if (item.type === "topDeal") {
        content = (
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
      } else if (item.type === "flashSale") {
        content = (
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
      } else if (item.type === "customRow") {
        content = (
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

      if (!content) return null;

      return <View className="bg-[#FAFAF7]">{content}</View>;
    },
    [
      handleOpenSheet,
      topDealCart,
      handleTopDealAdd,
      handleTopDealIncrement,
      handleTopDealDecrement,
      handleSeeAllPress,
      headerSpacerStyle,
      currentShop,
      changeShop,
      scrollY,
      scrollThresholdSv,
    ],
  );

  return (
    <View className="flex-1 z-10">
      <AnimatedFlashList
        data={extendedData}
        keyExtractor={(item) => (item as SectionItem).id}
        renderItem={renderItem as any}
        getItemType={(item) => (item as SectionItem).type}
        stickyHeaderIndices={[1]}
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
