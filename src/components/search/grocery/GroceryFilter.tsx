import { Ionicons } from "@expo/vector-icons";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FILTERS = ["Sort by", "Brand", "Type", "Properties"];

const MOCK_OPTIONS: Record<
  string,
  { id: number; name: string; image?: string }[]
> = {
  "Sort by": [
    { id: 1, name: "Relevance" },
    { id: 2, name: "Price: Low to High" },
    { id: 3, name: "Price: High to Low" },
    { id: 4, name: "Discount" },
  ],
  Brand: [
    {
      id: 11,
      name: "Amul",
      image: "https://m.media-amazon.com/images/I/61iVfK+Y7ZL._SL1500_.jpg",
    },
    {
      id: 12,
      name: "Mother Dairy",
      image: "https://m.media-amazon.com/images/I/61D19O7WnOL._SL1500_.jpg",
    },
    {
      id: 13,
      name: "Nestle",
      image: "https://m.media-amazon.com/images/I/81kD9TwLGaS._SL1500_.jpg",
    },
    {
      id: 14,
      name: "Britannia",
      image: "https://m.media-amazon.com/images/I/61Nl0I52HCL._SL1000_.jpg",
    },
  ],
  Type: [
    {
      id: 21,
      name: "Dairy",
      image: "https://m.media-amazon.com/images/I/61a35O5B2HL._SL1500_.jpg",
    },
    {
      id: 22,
      name: "Snacks",
      image: "https://m.media-amazon.com/images/I/719nAO+UEwL._SL1500_.jpg",
    },
    {
      id: 23,
      name: "Beverages",
      image: "https://m.media-amazon.com/images/I/41wospnFmoL.AC_SX250.jpg",
    },
  ],
  Properties: [
    { id: 31, name: "Organic" },
    { id: 32, name: "Vegan" },
    { id: 33, name: "Gluten-Free" },
  ],
};

const GroceryFilter = () => {
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>(
    {},
  );
  const [currentFilterSheet, setCurrentFilterSheet] = useState<string | null>(
    null,
  );
  const insets = useSafeAreaInsets();

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["50%", "75%"], []);

  const [masterFilterCategory, setMasterFilterCategory] = useState(FILTERS[0]);

  const handlePresentModalPress = useCallback((filter: string) => {
    setCurrentFilterSheet(filter);
    if (filter === "AllFilters") {
      setMasterFilterCategory(FILTERS[0]);
    }
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setCurrentFilterSheet(null);
    }
  }, []);

  const handleClearFilter = (filter: string) => {
    setActiveFilters((prev) => {
      const next = { ...prev };
      delete next[filter];
      return next;
    });
  };

  const handleSelectOption = (filter: string, optionName: string) => {
    setActiveFilters((prev) => ({ ...prev, [filter]: optionName }));
    if (currentFilterSheet !== "AllFilters") {
      bottomSheetModalRef.current?.dismiss();
    }
  };

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const currentOptions = currentFilterSheet
    ? MOCK_OPTIONS[currentFilterSheet] || MOCK_OPTIONS["Brand"]
    : [];

  return (
    <View className="py-2  border-b border-gray-100 blur-">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        <Pressable
          onPress={() => handlePresentModalPress("AllFilters")}
          className="h-9 px-4 rounded-full border border-gray-200 flex-row items-center justify-center bg-white"
          style={{
            elevation: 1,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 2,
            shadowOffset: { width: 0, height: 1 },
          }}
        >
          <Ionicons name="options" size={16} color="#1f2937" />
          <Text className="text-gray-800 text-[13px] font-bold ml-1.5">
            Filters
          </Text>
        </Pressable>

        {FILTERS.map((filter, index) => {
          const isActive = !!activeFilters[filter];
          return (
            <Pressable
              key={index}
              onPress={() => {
                if (isActive) {
                  handleClearFilter(filter);
                } else {
                  handlePresentModalPress(filter);
                }
              }}
              className={`h-9 px-4 rounded-full border flex-row items-center justify-center ${
                isActive
                  ? "bg-green-50 border-green-500"
                  : "bg-white border-gray-200"
              }`}
              style={{
                elevation: 1,
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 2,
                shadowOffset: { width: 0, height: 1 },
              }}
            >
              <Text
                className={`text-[13px] font-bold ${
                  isActive ? "text-green-700" : "text-gray-700"
                }`}
              >
                {isActive ? activeFilters[filter] : filter}
              </Text>
              <Ionicons
                name={isActive ? "close" : "chevron-down"}
                size={14}
                color={isActive ? "#16a34a" : "#6b7280"}
                style={{ marginLeft: 6 }}
              />
            </Pressable>
          );
        })}
      </ScrollView>

      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backdropComponent={renderBackdrop}
        handleIndicatorStyle={{ backgroundColor: "#d1d5db", width: 40 }}
        backgroundStyle={{ backgroundColor: "#ffffff" }}
      >
        <View className="flex-1">
          {/* Fixed Header */}
          <View className="flex-row items-center justify-between px-5 pb-4 pt-2 border-b border-gray-100">
            <Text className="text-[18px] font-bold text-gray-900">
              {currentFilterSheet === "AllFilters"
                ? "Filters"
                : currentFilterSheet}
            </Text>
            {Object.keys(activeFilters).length > 0 && (
              <Pressable
                onPress={() => setActiveFilters({})}
                className="py-1.5 px-3 bg-gray-100 rounded-full"
              >
                <Text className="text-gray-700 font-bold text-[13px]">
                  Clear All
                </Text>
              </Pressable>
            )}
          </View>

          {/* Body */}
          {currentFilterSheet === "AllFilters" ? (
            <View className="flex-1 flex-row bg-white">
              {/* Left Side: Categories */}
              <View className="w-[35%] bg-gray-50 border-r border-gray-100 h-full">
                {FILTERS.map((category) => {
                  const isActiveCategory = masterFilterCategory === category;
                  const hasSelection = !!activeFilters[category];
                  return (
                    <Pressable
                      key={category}
                      onPress={() => setMasterFilterCategory(category)}
                      className={`py-4 px-4 flex-row items-center justify-between ${
                        isActiveCategory ? "bg-white" : ""
                      }`}
                    >
                      <Text
                        className={`text-[13px] ${
                          isActiveCategory
                            ? "font-bold text-black"
                            : "font-semibold text-gray-500"
                        }`}
                      >
                        {category}
                      </Text>
                      {hasSelection && (
                        <View className="h-1.5 w-1.5 rounded-full bg-green-500" />
                      )}
                    </Pressable>
                  );
                })}
              </View>

              {/* Right Side: Options */}
              <BottomSheetScrollView className="flex-1 bg-white">
                {MOCK_OPTIONS[masterFilterCategory]?.map((option) => {
                  const isSelected =
                    activeFilters[masterFilterCategory] === option.name;
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() =>
                        handleSelectOption(masterFilterCategory, option.name)
                      }
                      className="flex-row items-center px-4 py-3.5 border-b border-gray-50"
                    >
                      {option.image && (
                        <View className="h-8 w-8 bg-white rounded p-0.5 mr-3 border border-gray-100">
                          <Image
                            source={{ uri: option.image }}
                            className="h-full w-full"
                            resizeMode="contain"
                          />
                        </View>
                      )}
                      <Text
                        className={`text-[14px] flex-1 ${
                          isSelected
                            ? "font-bold text-green-700"
                            : "font-medium text-gray-700"
                        }`}
                        numberOfLines={2}
                      >
                        {option.name}
                      </Text>
                      {isSelected && (
                        <Ionicons name="checkmark" size={20} color="#16a34a" />
                      )}
                    </Pressable>
                  );
                })}
              </BottomSheetScrollView>
            </View>
          ) : (
            <BottomSheetScrollView className="flex-1 px-4 pt-2 bg-white">
              {currentOptions.map((option) => {
                const isSelected =
                  activeFilters[currentFilterSheet!] === option.name;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() =>
                      handleSelectOption(currentFilterSheet!, option.name)
                    }
                    className={`flex-row items-center p-3.5 mb-2 rounded-xl border ${
                      isSelected
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-gray-100 "
                    }`}
                  >
                    {option.image && (
                      <View className="h-8 w-8 bg-white rounded p-0.5 mr-3 border border-gray-200">
                        <Image
                          source={{ uri: option.image }}
                          className="h-full w-full"
                          resizeMode="contain"
                        />
                      </View>
                    )}
                    <Text
                      className={`text-[15px] flex-1 ${
                        isSelected
                          ? "font-bold text-green-700"
                          : "font-medium text-gray-800"
                      }`}
                    >
                      {option.name}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark" size={20} color="#16a34a" />
                    )}
                  </Pressable>
                );
              })}
            </BottomSheetScrollView>
          )}

          {/* Fixed Footer */}
          <View
            className="px-4 pt-4 border-t border-gray-100 bg-white"
            style={{ paddingBottom: Math.max(insets.bottom, 16) }}
          >
            <Pressable
              onPress={() => bottomSheetModalRef.current?.dismiss()}
              className="bg-green-700 py-3.5 rounded-xl items-center justify-center shadow-sm"
            >
              <Text className="text-white font-bold text-[16px]">
                Apply Filters
              </Text>
            </Pressable>
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
};

export default GroceryFilter;
