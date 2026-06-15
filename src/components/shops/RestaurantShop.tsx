import { ShopType } from "@/src/types";
import type { Coupon } from "@/src/types/coupon";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { FlashList, ViewToken } from "@shopify/flash-list";
import { BlurView } from "expo-blur";
import { Ticket } from "lucide-react-native";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  createAnimatedComponent,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import NewShopHeader from "../ui/NewShopHeader";
import ShopTopSections from "../ui/ShopTopSections";
import { CouponExpandableRow } from "./groceryShop/CouponExpandableRow";
import BigFoodItem from "./restaurantShop/BigFoodItem";
import ComboOfferDetails from "./restaurantShop/ComboOfferDetails";
import ComboOffers from "./restaurantShop/ComboOffers";
import { FoodItemCard } from "./restaurantShop/FoodItem";
import ItemUnder from "./restaurantShop/ItemUnder";
import RecommendedForYou from "./restaurantShop/RecommendedForYou";
import RestaurantCouponCode from "./restaurantShop/RestaurantCouponCode";
import RestaurantFilter, {
  FilterType,
} from "./restaurantShop/RestaurantFilter";
import StickyHeader from "./restaurantShop/StickyHeader";
import type {
  Combo,
  Item,
  MenuSection,
  SectionItem,
} from "./restaurantShop/type";

const MOCK_RESTAURANT_COUPONS: Coupon[] = [
  {
    id: "rest-1",
    code: "GAVERO50",
    description: "Get 50% off on your first gourmet meal",
    category: "Restaurant",
    terms: "Valid on orders above ₹299",
    imageType: "food",
  },
  {
    id: "rest-2",
    code: "FREEDEL",
    description: "Free delivery on orders above ₹499",
    category: "Restaurant",
    terms: "Valid on all restaurant orders",
    imageType: "delivery",
  },
];

const AnimatedFlashList = createAnimatedComponent(
  FlashList,
) as unknown as React.FC<any>;

const HeaderSpacerItem = ({
  currentShop,
  changeShop,
  onLayout,
  scrollY,
  headerHeightSv,
}: {
  currentShop: ShopType;
  changeShop: React.Dispatch<React.SetStateAction<ShopType>>;
  onLayout?: (e: any) => void;
  scrollY: SharedValue<number>;
  headerHeightSv: SharedValue<number>;
}) => (
  <View onLayout={onLayout}>
    <NewShopHeader headerHeightSv={headerHeightSv} scrollY={scrollY} />
    <View className="bg-[#FAFAF7]">
      <ShopTopSections currentShop={currentShop} changeShop={changeShop} />
    </View>
  </View>
);

interface RestaurantShopProp {
  sections: MenuSection[];
  onScroll: ReturnType<typeof useAnimatedScrollHandler>;
  headerHeightSv: SharedValue<number>;
  currentShop: ShopType;
  changeShop: React.Dispatch<React.SetStateAction<ShopType>>;
  scrollY: SharedValue<number>;
}

const RestaurantShop = ({
  sections,
  onScroll,
  headerHeightSv,
  currentShop,
  changeShop,
  scrollY,
}: RestaurantShopProp) => {
  const insets = useSafeAreaInsets();
  const scrollThresholdSv = useSharedValue(200);

  const [activeIndex, setActiveIndex] = useState(0);
  const flatlistRef = useRef<any>(null);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const couponBottomSheetRef = useRef<BottomSheetModal>(null);
  const [sheetCoupons, setSheetCoupons] = useState<Coupon[]>([]);
  const [expandedCouponId, setExpandedCouponId] = useState<
    string | number | null
  >(null);

  const comboBottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedCombo, setSelectedCombo] = useState<Combo | null>(null);

  const foodItemBottomSheetRef = useRef<BottomSheetModal>(null);
  const [selectedFoodItem, setSelectedFoodItem] = useState<Item | null>(null);

  const [dietaryFilter, setDietaryFilter] = useState<FilterType>("ALL");

  const snapPoints = useMemo(() => ["68%", "75%"], []);

  const handleOpenMenu = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleOpenCombo = useCallback((combo: Combo) => {
    setSelectedCombo(combo);
    comboBottomSheetRef.current?.present();
  }, []);

  const handleOpenFoodItem = useCallback((item: Item) => {
    setSelectedFoodItem(item);
    foodItemBottomSheetRef.current?.present();
  }, []);

  const handleOpenCouponSheet = useCallback(
    (coupons: Coupon[], preExpandId?: string | number) => {
      setSheetCoupons(coupons);
      if (preExpandId) {
        setExpandedCouponId(preExpandId);
      }
      couponBottomSheetRef.current?.present();
    },
    [],
  );

  const toggleCouponExpand = useCallback((id: string | number) => {
    setExpandedCouponId((prev) => (prev === id ? null : id));
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.9} // Lower opacity looks better when paired with blur!
      >
        <BlurView
          intensity={30} // Adjust blur strength (0 - 100)
          tint="dark" // Options: 'light', 'dark', 'default'
          style={{ flex: 1 }}
        />
      </BottomSheetBackdrop>
    ),
    [],
  );

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 10,
  }).current;

  const isUserScrolling = useRef(false);

  const filteredSections = useMemo(() => {
    if (dietaryFilter === "ALL") return sections;

    return sections
      .map((section) => {
        if (section.type === "flat-section") {
          return {
            ...section,
            data: section.data.filter((item) =>
              dietaryFilter === "VEG"
                ? item.dietaryType === "VEG" || item.dietaryType === "VEGAN"
                : item.dietaryType === "NON_VEG",
            ),
          };
        } else if (section.type === "nested-section") {
          return {
            ...section,
            data: section.data
              .map((sub) => ({
                ...sub,
                data: sub.data.filter((item) =>
                  dietaryFilter === "VEG"
                    ? item.dietaryType === "VEG" || item.dietaryType === "VEGAN"
                    : item.dietaryType === "NON_VEG",
                ),
              }))
              .filter((sub) => sub.data.length > 0),
          };
        }
        return section;
      })
      .filter((section) => section.data.length > 0) as MenuSection[];
  }, [sections, dietaryFilter]);

  const priceThreshold = 200;
  const itemsUnderPrice = useMemo(() => {
    const items: Item[] = [];
    filteredSections.forEach((sec) => {
      if (sec.type === "flat-section") {
        sec.data.forEach((item) => {
          if (item.price <= priceThreshold) items.push(item);
        });
      } else if (sec.type === "nested-section") {
        sec.data.forEach((sub) => {
          sub.data.forEach((item) => {
            if (item.price <= priceThreshold) items.push(item);
          });
        });
      }
    });
    return items;
  }, [filteredSections]);

  const recommendedItems = useMemo(() => {
    const items: Item[] = [];
    let count = 0;

    // We break early when we have 4 items
    for (const sec of filteredSections) {
      if (sec.type === "flat-section") {
        for (const item of sec.data) {
          if (count >= 4) break;
          items.push(item);
          count++;
        }
      } else if (sec.type === "nested-section") {
        for (const sub of sec.data) {
          if (count >= 4) break;
          for (const item of sub.data) {
            if (count >= 4) break;
            items.push(item);
            count++;
          }
        }
      }
      if (count >= 4) break;
    }
    return items;
  }, [filteredSections]);

  const comboOffersData = useMemo(() => {
    // Gather all available items
    const allItems: Item[] = [];
    for (const sec of filteredSections) {
      if (sec.type === "flat-section") {
        allItems.push(...sec.data.filter((i) => i.isAvailable));
      } else if (sec.type === "nested-section") {
        for (const sub of sec.data) {
          allItems.push(...sub.data.filter((i) => i.isAvailable));
        }
      }
    }

    const comboNames = [
      "The Ultimate Feast",
      "Family Party Bundle",
      "Midnight Snack Pack",
      "Chef's Special Combo",
      "Weekend Saver Deal",
      "The Classic Duo",
      "Mega Bites Bundle",
      "Premium Taste Pack",
    ];

    // Chunk them into groups of 3
    const combos: Combo[] = [];
    let comboCounter = 1;
    for (let i = 0; i < allItems.length; i += 3) {
      const chunk = allItems.slice(i, i + 3);
      if (chunk.length > 1) {
        // Only make a combo if there's at least 2 items
        const originalPrice = chunk.reduce((sum, item) => sum + item.price, 0);
        const discountedPrice = originalPrice * 0.85; // 15% discount
        combos.push({
          id: `combo-${comboCounter}`,
          name: comboNames[(comboCounter - 1) % comboNames.length],
          items: chunk,
          originalPrice,
          discountedPrice,
        });
        comboCounter++;
      }
    }
    return combos;
  }, [filteredSections]);

  const { flatData, sectionIndices, subSectionIndices } = useMemo(() => {
    const flat: any[] = [];
    const sIndices: Record<number, number> = {};
    const subIndices: Record<string, number> = {};

    flat.push({ id: "header-spacer", type: "headerSpacer" });
    flat.push({ id: "sticky-header", type: "stickyHeader" });
    flat.push({ id: "restaurant-coupon", type: "restaurantCoupon" });
    flat.push({ id: "restaurant-filter", type: "restaurantFilter" });

    if (itemsUnderPrice.length > 0) {
      flat.push({
        id: "item-under",
        type: "itemUnder",
        items: itemsUnderPrice,
        priceThreshold: priceThreshold,
      });
    }

    if (recommendedItems.length > 0) {
      flat.push({
        id: "recommended-for-you",
        type: "recommendedForYou",
        items: recommendedItems,
      });
    }

    if (comboOffersData.length > 0) {
      flat.push({
        id: "combo-offers",
        type: "comboOffers",
        combos: comboOffersData,
      });
    }

    filteredSections.forEach((sec, sIdx) => {
      sIndices[sIdx] = flat.length;
      if (sec.type === "flat-section") {
        flat.push({
          type: "flat-section-header",
          name: sec.name,
          sectionIndex: sIdx,
        });
        sec.data.forEach((item, index) => {
          flat.push({
            ...item,
            type: "food-item",
            sectionIndex: sIdx,
            isLastInSection: index === sec.data.length - 1,
          });
        });
      } else if (sec.type === "nested-section") {
        flat.push({
          type: "nested-header",
          name: sec.name,
          sectionIndex: sIdx,
        });
        sec.data.forEach((sub) => {
          subIndices[sub.id] = flat.length;
          flat.push({
            type: "nested-sub-header",
            name: sub.name,
            sectionIndex: sIdx,
            id: sub.id,
          });
          sub.data.forEach((item, index) => {
            flat.push({
              ...item,
              type: "food-item",
              sectionIndex: sIdx,
              subSectionId: sub.id,
              isLastInSection: index === sub.data.length - 1,
            });
          });
        });
      }
    });

    return {
      flatData: flat,
      sectionIndices: sIndices,
      subSectionIndices: subIndices,
    };
  }, [filteredSections, itemsUnderPrice, recommendedItems, comboOffersData]);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (!isUserScrolling.current) return;

      if (viewableItems.length > 0) {
        const sectionItems = viewableItems.filter(
          (v) =>
            v.item.type === "flat-section-header" ||
            v.item.type === "nested-header" ||
            v.item.type === "nested-sub-header" ||
            v.item.type === "food-item",
        );

        if (sectionItems.length > 0) {
          // If multiple sections are visible, the first one is likely the tail of the
          // previous section occupying the top offset area. We pick the second one.
          const sectionItem = sectionItems[sectionItems.length > 1 ? 1 : 0];

          if (sectionItem.item.sectionIndex != null) {
            setActiveIndex(sectionItem.item.sectionIndex);
          }
        }
      }
    },
  ).current;

  const onCategoryPress = useCallback(
    (index: number) => {
      isUserScrolling.current = false;
      setActiveIndex(index);
      const targetIndex = sectionIndices[index];

      // Defer the heavy animated scroll computation to let the UI update (chip highlight) instantly
      setTimeout(() => {
        if (targetIndex != null) {
          flatlistRef.current?.scrollToIndex({
            index: targetIndex,
            animated: true,
            viewPosition: 0,
            viewOffset: -100, // Increased to keep item below sticky header + padding
          });
        }
      }, 50);
    },
    [sectionIndices],
  );

  const handleMenuCategoryPress = useCallback(
    (index: number) => {
      onCategoryPress(index);
      bottomSheetModalRef.current?.dismiss();
    },
    [onCategoryPress],
  );

  const handleMenuSubCategoryPress = useCallback(
    (subId: string, parentIndex: number) => {
      isUserScrolling.current = false;
      setActiveIndex(parentIndex);
      const targetIndex = subSectionIndices[subId];

      setTimeout(() => {
        if (targetIndex != null) {
          flatlistRef.current?.scrollToIndex({
            index: targetIndex,
            animated: true,
            viewPosition: 0,
            viewOffset: -140, // Increased offset so subsection titles clear the sticky header curve
          });
        }
      }, 50);

      bottomSheetModalRef.current?.dismiss();
    },
    [subSectionIndices],
  );

  // Outside header (Header B) - Only visible when sticky
  const outsideHeaderStyle = useAnimatedStyle(() => {
    const startY = scrollThresholdSv.value > 0 ? scrollThresholdSv.value : 200;
    const isSticky = scrollY.value >= startY;
    return {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      opacity: isSticky ? 1 : 0,
      transform: [{ translateY: isSticky ? 0 : -9999 }],
      zIndex: 50,
      elevation: 50,
    };
  });

  // Inside header (Header A) - Only visible when NOT sticky
  const insideHeaderStyle = useAnimatedStyle(() => {
    const startY = scrollThresholdSv.value > 0 ? scrollThresholdSv.value : 200;
    const isSticky = scrollY.value >= startY;
    return {
      opacity: isSticky ? 0 : 1,
    };
  });

  const headerSpacerStyle = useAnimatedStyle(() => ({
    height: headerHeightSv.value,
  }));

  const renderItem = useCallback(
    ({ item }: { item: any }) => {
      if (item.type === "headerSpacer") {
        return (
          <View>
            <HeaderSpacerItem
              currentShop={currentShop}
              changeShop={changeShop}
              scrollY={scrollY}
              headerHeightSv={headerHeightSv}
              onLayout={(e) => {
                scrollThresholdSv.value = e.nativeEvent.layout.height;
              }}
            />
          </View>
        );
      }

      let content = null;
      if (item.type === "stickyHeader") {
        return (
          <Animated.View style={insideHeaderStyle} className="mb-6">
            <StickyHeader
              scrollY={scrollY}
              scrollThresholdSv={scrollThresholdSv}
              activeIndex={activeIndex}
              menuSections={filteredSections}
              onCategoryPress={onCategoryPress}
            />
          </Animated.View>
        );
      } else if (item.type === "restaurantFilter") {
        content = (
          <View className="mb-2">
            <RestaurantFilter
              currentFilter={dietaryFilter}
              onFilterChange={setDietaryFilter}
            />
          </View>
        );
      } else if (item.type === "itemUnder") {
        content = (
          <View className="mb-4 bg-[#fefce8]">
            <ItemUnder
              items={item.items}
              priceThreshold={item.priceThreshold}
              onItemPress={handleOpenFoodItem}
            />
          </View>
        );
      } else if (item.type === "recommendedForYou") {
        content = (
          // <View className="mb-2">
          <RecommendedForYou
            items={item.items}
            onItemPress={handleOpenFoodItem}
          />
          // </View>
        );
      } else if (item.type === "comboOffers") {
        content = (
          <View className="mb-2">
            <ComboOffers combos={item.combos} onOpenCombo={handleOpenCombo} />
          </View>
        );
      } else if (item.type === "flat-section-header") {
        content = (
          <View className="px-4 py-4 border-b border-gray-100 bg-white flex-row items-center justify-between mt-3">
            <Text className="text-xl font-black text-gray-900 tracking-tight">
              {item.name}
            </Text>
          </View>
        );
      } else if (item.type === "nested-header") {
        content = (
          <View className="px-4 pt-4 pb-2 bg-white flex-row justify-between items-center border-b border-gray-100 mt-3">
            <Text className="text-xl font-black text-gray-900 tracking-tight">
              {item.name}
            </Text>
          </View>
        );
      } else if (item.type === "nested-sub-header") {
        content = (
          <View className="mt-2 px-4 py-2 bg-white flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-800 tracking-tight">
              {item.name}
            </Text>
          </View>
        );
      } else if (item.type === "restaurantCoupon") {
        content = (
          <View>
            <RestaurantCouponCode
              coupons={MOCK_RESTAURANT_COUPONS}
              onOpenSheet={handleOpenCouponSheet}
            />
          </View>
        );
      } else if (item.type === "food-item") {
        content = (
          <FoodItemCard
            item={item}
            onPress={handleOpenFoodItem}
            hideBorder={item.isLastInSection}
          />
        );
      }

      if (!content) return null;

      return <View className="bg-white">{content}</View>;
    },
    [
      headerSpacerStyle,
      currentShop,
      changeShop,
      headerHeightSv,
      scrollY,
      scrollThresholdSv,
      dietaryFilter,
      handleOpenFoodItem,
      handleOpenFoodItem,
      activeIndex,
      filteredSections,
      onCategoryPress,
      insideHeaderStyle,
    ],
  );
  // ← render arrow direction from this subId: sub.id // ← needed for toggle handler
  return (
    <View className="flex-1 z-10">
      <Animated.View style={outsideHeaderStyle} pointerEvents="box-none">
        <StickyHeader
          scrollY={scrollY}
          scrollThresholdSv={scrollThresholdSv}
          activeIndex={activeIndex}
          menuSections={filteredSections}
          onCategoryPress={onCategoryPress}
        />
      </Animated.View>

      <AnimatedFlashList
        ref={flatlistRef}
        data={flatData}
        keyExtractor={(item) => (item as SectionItem).id}
        renderItem={renderItem as any}
        getItemType={(item) => (item as SectionItem).type}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onScroll={onScroll}
        onScrollBeginDrag={() => {
          isUserScrolling.current = true;
        }}
        scrollEventThrottle={16}
        estimatedItemSize={400}
        extraData={activeIndex}
      />

      {/* Floating Menu Button */}
      <View
        className="absolute bottom-6 left-0 right-0 items-center justify-center"
        pointerEvents="box-none"
      >
        <Pressable
          onPress={handleOpenMenu}
          className="flex-row items-center justify-center bg-black px-4 py-2.5 rounded-full shadow-lg active:opacity-80"
        >
          <Ionicons name="restaurant" size={15} color="white" />
          <Text className="text-white font-bold text-[13px] ml-1.5 tracking-wide uppercase">
            Menu
          </Text>
        </Pressable>
      </View>

      {/* Bottom Sheet Menu */}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 48 }}
        topInset={insets.top}
        bottomInset={insets.bottom}
      >
        <View className="flex-1 px-4 pt-2">
          <View className="flex-row items-center justify-between mb-5 pb-3 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Menu</Text>
            <Pressable onPress={() => bottomSheetModalRef.current?.dismiss()}>
              <Ionicons name="close" size={24} color="#374151" />
            </Pressable>
          </View>
          <BottomSheetScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {filteredSections.map((section, index) => {
              if (section.type === "flat-section") {
                return (
                  <Pressable
                    key={section.id}
                    onPress={() => handleMenuCategoryPress(index)}
                    className={`flex-row justify-between items-center py-4 border-b border-gray-100 ${
                      index === activeIndex ? "bg-gray-50" : ""
                    }`}
                  >
                    <Text
                      className={`text-base ${
                        index === activeIndex
                          ? "font-bold text-black"
                          : "font-medium text-gray-700"
                      }`}
                    >
                      {section.name}
                    </Text>
                    <Text className="text-sm font-semibold text-gray-500">
                      {section.data?.length || 0}
                    </Text>
                  </Pressable>
                );
              } else if (section.type === "nested-section") {
                const totalItems = section.data.reduce(
                  (sum, sub) => sum + (sub.data?.length || 0),
                  0,
                );
                return (
                  <View
                    key={section.id}
                    className={`border-b border-gray-100 py-4 ${
                      index === activeIndex ? "bg-gray-50" : ""
                    }`}
                  >
                    <Pressable
                      onPress={() => handleMenuCategoryPress(index)}
                      className="flex-row justify-between items-center mb-1"
                    >
                      <Text
                        className={`text-base ${
                          index === activeIndex
                            ? "font-bold text-black"
                            : "font-medium text-gray-700"
                        }`}
                      >
                        {section.name}
                      </Text>
                      <Text className="text-sm font-semibold text-gray-500">
                        {totalItems}
                      </Text>
                    </Pressable>
                    <View className="ml-4 space-y-1.5 mt-2">
                      {section.data.map((subItem) => (
                        <Pressable
                          key={subItem.id}
                          onPress={() =>
                            handleMenuSubCategoryPress(subItem.id, index)
                          }
                          className="flex-row justify-between items-center py-1"
                        >
                          <Text className="text-[15px] font-medium text-gray-500">
                            {subItem.name}
                          </Text>
                          <Text className="text-xs font-medium text-gray-400">
                            {subItem.data?.length || 0}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                );
              }
              return null;
            })}
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>
      {/* Coupon Bottom Sheet */}
      <BottomSheetModal
        ref={couponBottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 48 }}
        topInset={insets.top}
        bottomInset={insets.bottom}
      >
        <View className="flex-1 px-4 pt-2">
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
            contentContainerStyle={{ paddingBottom: 80 }}
          >
            {sheetCoupons.map((coupon) => {
              const couponId = coupon.id || coupon.code;
              return (
                <CouponExpandableRow
                  key={couponId}
                  coupon={coupon}
                  isExpanded={expandedCouponId === couponId}
                  onToggle={() => toggleCouponExpand(couponId)}
                />
              );
            })}
          </BottomSheetScrollView>
        </View>
      </BottomSheetModal>

      {/* Combo Details Bottom Sheet */}
      <BottomSheetModal
        ref={comboBottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 48 }}
        topInset={insets.top}
        bottomInset={insets.bottom}
      >
        {selectedCombo && (
          <ComboOfferDetails
            combo={selectedCombo}
            onClose={() => comboBottomSheetRef.current?.dismiss()}
          />
        )}
      </BottomSheetModal>

      {/* Food Item Bottom Sheet */}
      <BottomSheetModal
        ref={foodItemBottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        handleComponent={null}
        topInset={insets.top}
        bottomInset={insets.bottom}
        backgroundStyle={{ backgroundColor: "transparent" }}
      >
        {selectedFoodItem && (
          <BigFoodItem
            onClose={() => foodItemBottomSheetRef.current?.dismiss()}
          />
        )}
      </BottomSheetModal>
    </View>
  );
};

export default RestaurantShop;
