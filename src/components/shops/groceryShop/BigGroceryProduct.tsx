import CustomRow from "@/src/components/shops/groceryShop/CustomRow";
import SearchBar from "@/src/components/ui/SearchBar";
import { SUPERMARKET_PRODUCTS } from "@/src/mockData";
import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import clsx from "clsx";
import { router } from "expo-router";
import { Bookmark, FileText, Info, Share, Store } from "lucide-react-native";
import { styled } from "nativewind";
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  Share as RNShare,
  Text,
  View,
} from "react-native";
import { ScrollView as GHScrollView } from "react-native-gesture-handler";
import Animated, {
  SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const { width: FullWidth } = Dimensions.get("screen");
const SMALL_WIDTH = FullWidth - 85; // FullWidth - 68 (card inner width) - 24 (mx-3 padding)
const LARGE_WIDTH = FullWidth - 24; // FullWidth (expanded card width) - 24 (mx-3 padding)

export type TableData = {
  type: "table";
  headers: string[];
  rows: string[][];
};

export type TextData = {
  type: "text";
  content: string;
};

export type InfoData = TableData | TextData;

export interface BigGroceryProductProps {
  images: string[];
  title: string;
  shortTitle?: string;
  weight: string;
  pricePerUnit: string;
  discountPercentage: string;
  currentPrice: string;
  originalPrice: string;
  productInfo: Record<string, InfoData>;
  progress?: SharedValue<number>;
  isExpanded?: SharedValue<boolean>;
}

const BigGroceryProduct: React.FC<BigGroceryProductProps> = ({
  images,
  title,
  shortTitle,
  weight,
  pricePerUnit,
  discountPercentage,
  currentPrice,
  originalPrice,
  brandName,
  sellerName,
  productInfo,
  progress,
  isExpanded,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [quantity, setQuantity] = useState(0);

  const carouselWrapperStyle = useAnimatedStyle(() => {
    if (!progress) return { width: SMALL_WIDTH, height: SMALL_WIDTH };
    const size = interpolate(
      progress.value,
      [0, 1],
      [SMALL_WIDTH, LARGE_WIDTH],
    );
    return {
      width: size,
      height: size,
      alignItems: "center",
      justifyContent: "center",
    };
  });

  const carouselScaleStyle = useAnimatedStyle(() => {
    if (!progress) return { transform: [{ scale: SMALL_WIDTH / LARGE_WIDTH }] };
    const scale = interpolate(
      progress.value,
      [0, 1],
      [SMALL_WIDTH / LARGE_WIDTH, 1],
    );
    return {
      transform: [{ scale }],
    };
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      if (progress && isExpanded) {
        if (event.contentOffset.y > 50 && !isExpanded.value) {
          isExpanded.value = true;
          progress.value = withTiming(1, { duration: 300 });
        } else if (event.contentOffset.y <= 0 && isExpanded.value) {
          isExpanded.value = false;
          progress.value = withTiming(0, { duration: 300 });
        }
      }
    },
  });

  const searchBarStyle = useAnimatedStyle(() => {
    if (!progress) return { height: 0, opacity: 0 };
    return {
      height: interpolate(progress.value, [0, 1], [0, 56]),
      opacity: progress.value,
    };
  });

  const infoTabs = Object.keys(productInfo);
  const [activeTab, setActiveTab] = useState<string | null>(
    infoTabs[0] || null,
  );

  const [isSellerExpanded, setIsSellerExpanded] = useState(false);
  const [isTermsExpanded, setIsTermsExpanded] = useState(false);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["45%", "80%"], []);

  const handlePresentModalPress = useCallback(() => {
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

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <Animated.View
        className="flex-row items-center justify-between px-5 border-b border-gray-100 overflow-hidden py-1"
        // style={searchBarStyle}
      >
        <Pressable
          onPress={() => router.back()}
          className={clsx(
            "w-9 h-9 rounded-full bg-[#f5f5f5] items-center justify-center active:opacity-60 p-1",
          )}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </Pressable>
        <Pressable
          className="flex-1 ml-2"
          onPress={() => {
            router.push("/(app)/main-search");
          }}
        >
          <SearchBar
            className="w-full"
            placeholderText="Search Product"
            editable={false}
          />
        </Pressable>
      </Animated.View>
      <Animated.ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
      >
        <View className="mx-3 mt-2 border border-b p-3 rounded-t-xl border-gray-300 bg-gray-50/50">
          <Text className="text-[15px] font-semibold text-gray-800 mb-2">
            {title}
          </Text>
          <View className="flex-row gap-2 items-center">
            <View className="rounded-md px-2 py-1 bg-stone-100 border-[0.5px] border-stone-300">
              <Text className="text-xs font-medium text-stone-700">
                {weight}
              </Text>
            </View>
            <View className="rounded-md px-2 py-1 bg-stone-100 border-[0.5px] border-stone-300">
              <Text className="text-xs font-medium text-stone-700">
                {pricePerUnit}
              </Text>
            </View>
          </View>
        </View>

        {/* Image Carousel */}
        <View className="relative pb-3 pt-2 items-center mx-3">
          {/* Offer Tag */}
          {discountPercentage && (
            <View className="absolute top-4 left-4 h-10 w-10 items-center justify-center rounded-full z-10 bg-orange-600 shadow-sm">
              <Text className="text-white text-[10px] font-extrabold leading-3 mt-0.5 text-center">
                {discountPercentage}
              </Text>
              <Text className="text-[9px] text-white font-extrabold">Off</Text>
            </View>
          )}

          {/* Action Buttons */}
          <View className="absolute top-4 right-2 flex-col gap-3 z-10">
            <Pressable
              className="w-8 h-8 rounded-full bg-white items-center justify-center border border-gray-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
              onPress={async () => {
                try {
                  await RNShare.share({
                    message: `Check out ${title} on Gavero!\n\nPrice: ${currentPrice}\n\nOrder now on Gavero app!`,
                    title: "Share Product",
                  });
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              <Share size={18} color="#374151" />
            </Pressable>
            <Pressable
              className="w-8 h-8 rounded-full bg-white items-center justify-center border border-gray-100"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Bookmark size={18} color="#374151" />
            </Pressable>
          </View>

          <Animated.View style={carouselWrapperStyle}>
            <Animated.View style={carouselScaleStyle}>
              <Carousel
                loop={false}
                width={LARGE_WIDTH}
                height={LARGE_WIDTH}
                autoPlay={false}
                data={images}
                scrollAnimationDuration={500}
                onConfigurePanGesture={(gesture) => {
                  gesture.activeOffsetX([-10, 10]);
                }}
                onSnapToItem={(index) => setActiveIndex(index)}
                renderItem={({ item, index }) => (
                  <Pressable
                    style={{
                      width: LARGE_WIDTH,
                      height: LARGE_WIDTH,
                    }}
                    className="items-center justify-center bg-white overflow-hidden"
                    onPress={() => {
                      router.push({
                        pathname: "/grocery-bigImages",
                        params: {
                          images: JSON.stringify(images),
                          initialIndex: index.toString(),
                        },
                      });
                    }}
                  >
                    <Image
                      source={{ uri: item }}
                      className="w-full h-full"
                      resizeMode="contain"
                    />
                  </Pressable>
                )}
              />
            </Animated.View>
          </Animated.View>

          {/* Pagination Dots */}
          <View className="flex-row items-center justify-center mt-3">
            {images.map((_, index) => (
              <View
                key={index}
                className={clsx(
                  "rounded-full mx-1",
                  index === activeIndex
                    ? "size-1.25 bg-gray-500"
                    : "size-1 bg-gray-300",
                )}
              />
            ))}
          </View>
        </View>

        <View className="mx-3 border border-t p-2 rounded-b-xl border-gray-300 bg-gray-50/50 flex-row justify-between items-center gap-2">
          <View className="flex-row items-center gap-2">
            <View className="h-10 w-10 bg-gray-200 rounded-xl">
              {/* <Image source={{uri: ""}} className="h-full w-full"/> */}
            </View>
            <View>
              <Text className="text-[14px] font-medium text-gray-800">
                {brandName}
              </Text>
              <Text className="text-[10px] font-normal text-gray-500">
                More from this brand
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={15} color="#6b7280" />
        </View>

        {/* View Details Button */}
        <View className="px-3 mt-2 mb-2">
          <Pressable
            onPress={handlePresentModalPress}
            className="p-2 bg-white rounded-xl border"
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
            }}
          >
            <View className="flex-row justify-between items-center gap-2">
              <View className="flex-row items-center gap-2">
                <View className="h-10 w-10 bg-gray-200 rounded-xl items-center justify-center">
                  <Info size={20} color="#1f2937" strokeWidth={2} />
                </View>
                <View>
                  <Text className="text-[14px] font-medium text-gray-800">
                    Product Details
                  </Text>
                  <Text className="text-[10px] font-normal text-gray-500">
                    Ingredients, Nutritional Info
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={15} color="#6b7280" />
            </View>
          </Pressable>
        </View>
        <CustomRow
          title="More in a row"
          products={SUPERMARKET_PRODUCTS.slice(0, 10)}
          cartQuantities={{}}
          onAddProduct={() => {}}
          onIncrementProduct={() => {}}
          onDecrementProduct={() => {}}
        />

        {/* Seller Information Accordion */}
        <View className="px-3 mt-2 mb-2">
          <Pressable
            onPress={() => setIsSellerExpanded(!isSellerExpanded)}
            className={clsx(
              "p-2 bg-white border-b",
              isSellerExpanded ? "rounded-t-xl" : "rounded-xl border",
            )}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
            }}
          >
            <View className="flex-row justify-between items-center gap-2">
              <View className="flex-row items-center gap-2">
                <View className="h-10 w-10 bg-gray-200 rounded-xl items-center justify-center">
                  <Store size={20} color="#1f2937" strokeWidth={2} />
                </View>

                <View>
                  <Text className="text-[14px] font-medium text-gray-800">
                    Seller Information
                  </Text>
                  <Text className="text-[10px] font-normal text-gray-500">
                    {sellerName}
                  </Text>
                </View>
              </View>

              <Ionicons
                name={isSellerExpanded ? "chevron-up" : "chevron-down"}
                size={15}
                color="#6b7280"
              />
            </View>
          </Pressable>

          {isSellerExpanded && (
            <View
              className="mt-1 bg-gray-50/50 p-4 rounded-b-xl"
              style={{
                borderWidth: 1,
                borderColor: "#d1d5db",
              }}
            >
              <Text className="text-sm text-gray-600 leading-relaxed">
                This{" "}
                <Text className="font-semibold text-gray-800">
                  {shortTitle || title}
                </Text>{" "}
                is fulfilled by{" "}
                <Text className="font-semibold text-green-800">
                  {sellerName}
                </Text>
                , a trusted local grocery shop on our platform. They source and
                provide a wide variety of fresh daily essentials directly to
                your neighborhood.
              </Text>
            </View>
          )}
        </View>

        {/* Terms and Conditions Accordion */}
        <View className="px-3">
          <Pressable
            onPress={() => setIsTermsExpanded(!isTermsExpanded)}
            className={clsx(
              "p-2 bg-white border-b",
              isTermsExpanded ? "rounded-t-xl" : "rounded-xl border",
            )}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
            }}
          >
            <View className="flex-row justify-between items-center gap-2">
              <View className="flex-row items-center gap-2">
                <View className="h-10 w-10 bg-gray-200 rounded-xl items-center justify-center">
                  <FileText size={20} color="#1f2937" strokeWidth={2} />
                </View>
                <View>
                  <Text className="text-[14px] font-medium text-gray-800">
                    Terms & Conditions
                  </Text>
                  <Text className="text-[10px] font-normal text-gray-500">
                    Return Policy
                  </Text>
                </View>
              </View>
              <Ionicons
                name={isTermsExpanded ? "chevron-up" : "chevron-down"}
                size={15}
                color="#6b7280"
              />
            </View>
          </Pressable>

          {isTermsExpanded && (
            <View className="bg-gray-50/50 p-4 rounded-b-xl border border-gray-300 mt-1">
              <Text className="text-sm text-gray-600 leading-relaxed">
                Items can only be returned if they are{" "}
                <Text className="font-semibold text-red-600">expired</Text>. The
                platform acts solely as an intermediary between you and the
                shopkeeper. We have no responsibility or authority to bind the
                shopkeeper to accept returns for reasons other than product
                expiry.
              </Text>
            </View>
          )}
        </View>
      </Animated.ScrollView>

      {/* Sticky Bottom Bar */}
      <View className="px-4 py-3 bg-white border-t border-gray-100 shadow-sm flex-row gap-2">
        <View className="">
          {/* <Text className="text-sm text-gray-400">Add To Cart</Text> */}
          <Text className="text-lg text-gray-800 font-bold">
            {currentPrice}
          </Text>
          {originalPrice && (
            <Text className="text-xs text-gray-400 line-through">
              {originalPrice}
            </Text>
          )}
        </View>
        <View className="h-12 flex-1">
          {quantity === 0 ? (
            <Pressable
              onPress={() => setQuantity(1)}
              className={clsx(
                "rounded-full h-full w-full flex-row items-center justify-center gap-2",
                "bg-green-800",
              )}
            >
              <Text className="text-lg text-white font-medium">
                Add to cart
              </Text>
            </Pressable>
          ) : (
            <View className="rounded-full h-full flex-row items-center justify-between px-6 bg-green-800 w-full">
              <Pressable
                onPress={() => setQuantity((q) => Math.max(0, q - 1))}
                hitSlop={10}
              >
                <Ionicons
                  name={quantity === 1 ? "trash-outline" : "remove"}
                  size={22}
                  color="white"
                />
              </Pressable>

              <Text className="text-lg text-white font-bold">{quantity}</Text>

              <Pressable onPress={() => setQuantity((q) => q + 1)} hitSlop={10}>
                <Ionicons name="add" size={22} color="white" />
              </Pressable>
            </View>
          )}
        </View>
      </View>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View className="px-5 py-4 border-b border-gray-100 flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-900">
              Product Details
            </Text>
            <Pressable
              onPress={() => bottomSheetModalRef.current?.dismiss()}
              className="p-1 rounded-full bg-gray-100 active:opacity-60"
            >
              <Ionicons name="close" size={20} color="#374151" />
            </Pressable>
          </View>

          <BottomSheetScrollView
            className="flex-1"
            contentContainerStyle={{ paddingBottom: 24 }}
          >
            {/* Info Chips */}
            <View className="mt-4 px-3 mb-2">
              <GHScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingRight: 24 }}
              >
                {infoTabs.map((tab) => (
                  <Pressable
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    className={clsx(
                      "px-3 py-1.5 rounded-md border",
                      activeTab === tab
                        ? "bg-stone-800 border-stone-800"
                        : "bg-white border-gray-300",
                    )}
                  >
                    <Text
                      className={clsx(
                        "text-xs font-medium tracking-wide",
                        activeTab === tab ? "text-white" : "text-gray-700",
                      )}
                    >
                      {tab}
                    </Text>
                  </Pressable>
                ))}
              </GHScrollView>

              {/* Expanded Content */}
              {activeTab && productInfo[activeTab] && (
                <View className="mt-4 p-4 bg-gray-50/50 rounded-xl border border-gray-200">
                  {productInfo[activeTab].type === "text" ? (
                    <Text className="text-sm text-gray-700 leading-relaxed">
                      {(productInfo[activeTab] as TextData).content}
                    </Text>
                  ) : (
                    <View className="rounded-lg overflow-hidden border border-gray-200 bg-white">
                      <View className="flex-row bg-gray-100 p-2 border-b border-gray-200">
                        <Text className="flex-1 text-xs font-bold text-gray-800">
                          {(productInfo[activeTab] as TableData).headers[0]}
                        </Text>
                        <Text className="flex-1 text-xs font-bold text-gray-800 text-right">
                          {(productInfo[activeTab] as TableData).headers[1]}
                        </Text>
                      </View>
                      {(productInfo[activeTab] as TableData).rows.map(
                        (row, index) => (
                          <View
                            key={index}
                            className={clsx(
                              "flex-row p-2",
                              index !==
                                (productInfo[activeTab] as TableData).rows
                                  .length -
                                  1
                                ? "border-b border-gray-100"
                                : "",
                            )}
                          >
                            <Text className="flex-1 text-xs text-gray-600">
                              {row[0]}
                            </Text>
                            <Text className="flex-1 text-xs text-gray-800 font-medium text-right">
                              {row[1]}
                            </Text>
                          </View>
                        ),
                      )}
                    </View>
                  )}
                </View>
              )}
            </View>
          </BottomSheetScrollView>
        </BottomSheetView>
      </BottomSheetModal>
    </View>
  );
};

export default BigGroceryProduct;
