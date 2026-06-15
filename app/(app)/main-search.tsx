import FoodSearch from "@/src/components/search/FoodSearch";
import GrocerySearch from "@/src/components/search/GrocerySearch";
import StoreSearch from "@/src/components/search/StoreSearch";
import ScreenView from "@/src/components/ui/ScreenView";
import SearchBar from "@/src/components/ui/SearchBar";
import { router, useLocalSearchParams } from "expo-router";
import { ShoppingBasket, Store, UtensilsCrossed } from "lucide-react-native";
import { styled } from "nativewind";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

const MainSearch = () => {
  const { context } = useLocalSearchParams<{ context: string }>();
  const [searchQuery, setSearchQuery] = useState("");
  const [isStoreMode, setIsStoreMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    (context as "Grocery" | "Food") ?? "Grocery",
  );

  const placeholderText = isStoreMode
    ? "Search store"
    : `Search ${activeCategory.toLowerCase()}`;

  return (
    <ScreenView>
      <View className="px-4 pt-2 pb-2 border-b-[0.5px] border-gray-200">
        <View className="flex-row items-center gap-2">
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderText={placeholderText}
            autoFocus={true}
            showBackArrow={true}
            onBackPress={() => router.back()}
            className="flex-1"
          />
          <Pressable
            onPress={() => setIsStoreMode(!isStoreMode)}
            className={`h-10 w-10 items-center justify-center rounded-xl border ${
              isStoreMode
                ? "bg-orange-200 border-orange-500"
                : " border-gray-200"
            }`}
          >
            <Store size={22} color={isStoreMode ? "#000000" : "#9ca3af"} />
          </Pressable>
        </View>

        {/* Category Chips */}
        {!isStoreMode && (
          <View className="flex-row gap-2 mt-3">
            <Pressable
              onPress={() => setActiveCategory("Grocery")}
              className={`h-15 w-15 pt-2 pb-1.5 rounded-2xl items-center justify-center ${
                activeCategory === "Grocery"
                  ? "border border-[#C0C0C0]"
                  : "border border-gray-300 bg-white"
              }`}
              style={{
                backgroundColor:
                  activeCategory === "Grocery" ? "#016630" : "white",
              }}
            >
              <ShoppingBasket
                size={22}
                color={activeCategory === "Grocery" ? "#FFFFFF" : "#000000"}
                strokeWidth={2}
              />
              <Text
                className={`text-[10px] font-medium ${activeCategory === "Grocery" ? "text-white" : "text-black"}`}
              >
                Grocery
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setActiveCategory("Food")}
              className={`h-15 w-15 pt-2 pb-1.5 rounded-2xl items-center justify-center ${
                activeCategory === "Food"
                  ? "border border-[#C0C0C0]"
                  : "border border-gray-300 bg-white"
              }`}
              style={{
                backgroundColor:
                  activeCategory === "Food" ? "#000000" : "white",
              }}
            >
              <UtensilsCrossed
                size={22}
                color={activeCategory === "Food" ? "#FFFFFF" : "#000000"}
                strokeWidth={2}
              />
              <Text
                className={`text-[10px] font-medium ${activeCategory === "Food" ? "text-white" : "text-black"}`}
              >
                Food
              </Text>
            </Pressable>
          </View>
        )}
      </View>

      {/* Conditionally Render the appropriate Search Component */}
      {isStoreMode && <StoreSearch searchQuery={searchQuery} />}
      {!isStoreMode && activeCategory === "Grocery" && (
        <GrocerySearch searchQuery={searchQuery} onSearchQueryChange={setSearchQuery} />
      )}
      {!isStoreMode && activeCategory === "Food" && (
        <FoodSearch searchQuery={searchQuery} />
      )}
    </ScreenView>
  );
};

export default MainSearch;
