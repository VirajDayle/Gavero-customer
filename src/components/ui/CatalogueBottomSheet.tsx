import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetFlatList,
  BottomSheetModal,
} from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { forwardRef, useCallback, useMemo, useRef, useState } from "react";
import { Dimensions, Image, Pressable, Text, View } from "react-native";
import { FlatList as GHFlatList } from "react-native-gesture-handler";

export interface CatalogueCategory {
  id: string | number;
  title: string;
  source?: any;
  image?: any;
  subSections?: {
    id: string | number;
    title: string;
    image?: any;
    source?: any;
  }[];
}

interface CatalogueBottomSheetProps {
  onClose?: () => void;
  categories: CatalogueCategory[];
  title?: string;
  themeColor?: string;
}

const CatalogueBottomSheet = forwardRef<
  BottomSheetModal,
  CatalogueBottomSheetProps
>(({ onClose, categories, title = "All Categories", themeColor = "#166534" }, ref) => {
  const { height } = Dimensions.get("window");
  const snapPoints = useMemo(() => [height * 0.9], [height]);

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

  const verticalListRef = useRef<any>(null);
  const horizontalListRef = useRef<GHFlatList>(null);
  const [activeCategoryIndices, setActiveCategoryIndices] = useState<number[]>([0]);

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 40,
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      const indices = viewableItems
        .map((v: any) => v.index)
        .filter((i: any) => i !== null && i !== undefined);
      
      if (indices.length > 0) {
        setActiveCategoryIndices(indices);
        // We scroll the horizontal chips to the first visible category
        horizontalListRef.current?.scrollToIndex({
          index: indices[0],
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }).current;

  return (
    <BottomSheetModal
      ref={ref}
      index={0}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
      enableDynamicSizing={false}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
      }}
      handleComponent={() => (
        <View className="items-center py-3 bg-white rounded-t-[24px]">
          <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
        </View>
      )}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 pb-3 bg-white">
        <View>
          <Text className="text-lg font-bold text-gray-900 tracking-tight">
            {title}
          </Text>
        </View>
        <Pressable
          onPress={() => {
            if (ref && typeof ref !== "function" && ref.current) {
              ref.current.dismiss();
            }
            onClose?.();
          }}
          className="h-8 w-8 bg-gray-100 items-center justify-center rounded-full active:opacity-70"
        >
          <Ionicons name="close" size={18} color="#4B5563" />
        </Pressable>
      </View>

      {/* Horizontal Chips */}
      <View className="border-b border-gray-100 bg-white pb-3 pt-1">
        <GHFlatList
          ref={horizontalListRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          data={categories}
          keyExtractor={(item) => String(item.id)}
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              horizontalListRef.current?.scrollToIndex({
                index: info.index,
                animated: true,
                viewPosition: 0.5,
              });
            });
          }}
          renderItem={({ item, index }) => {
            const isActive = activeCategoryIndices.includes(index);
            return (
              <Pressable
                onPress={() => {
                  // Eagerly set just this one to active for immediate feedback
                  setActiveCategoryIndices([index]);
                  verticalListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0,
                  });
                  horizontalListRef.current?.scrollToIndex({
                    index,
                    animated: true,
                    viewPosition: 0.5,
                  });
                }}
                className={`px-4 py-1.5 rounded-full border ${
                  isActive ? "" : "border-gray-200 bg-white"
                }`}
                style={
                  isActive
                    ? { backgroundColor: themeColor, borderColor: themeColor }
                    : undefined
                }
              >
                <Text
                  className={`text-sm font-semibold ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                >
                  {item.title}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* Vertical List of Categories */}
      <BottomSheetFlatList
        ref={verticalListRef}
        data={categories}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40, paddingTop: 16 }}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        onScrollToIndexFailed={(info) => {
          const wait = new Promise((resolve) => setTimeout(resolve, 500));
          wait.then(() => {
            verticalListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
            });
          });
        }}
        renderItem={({ item: category }) => {
          return (
            <View className="mb-4">
              {/* Category Header */}
              <View className="px-4 mb-4">
                <Text className="text-[18px] font-bold text-gray-900">
                  {category.title}
                </Text>
              </View>

              <GHFlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
                data={category.subSections || []}
                keyExtractor={(sub) => String(sub.id)}
                renderItem={({ item: sub }) => {
                  const subImage = sub.image ?? sub.source;
                  return (
                    <Pressable
                      onPress={() => {
                        if (ref && typeof ref !== "function" && ref.current) {
                          ref.current.dismiss();
                        }
                        router.push({
                          pathname: "/(app)/(public)/shop-expand",
                          params: { categoryId: category.id },
                        });
                      }}
                    >
                      {typeof subImage === "string" ? (
                        <Image
                          source={{ uri: subImage }}
                          className="w-20 h-22 rounded-xl border"
                          style={{ borderColor: themeColor }}
                          resizeMode="contain"
                        />
                      ) : (
                        <Image
                          source={subImage}
                          className="w-20 h-22 rounded-xl border"
                          style={{ borderColor: themeColor }}
                          resizeMode="contain"
                        />
                      )}
                      <Text
                        className="text-center text-[11px] mt-2 font-semibold text-gray-800 w-20"
                        numberOfLines={2}
                      >
                        {sub.title}
                      </Text>
                    </Pressable>
                  );
                }}
                ListEmptyComponent={() => (
                  <View className="px-4 py-2">
                    <Text className="text-gray-400 text-xs italic">
                      No sub-categories available
                    </Text>
                  </View>
                )}
              />
            </View>
          );
        }}
      />
    </BottomSheetModal>
  );
});

export default CatalogueBottomSheet;
