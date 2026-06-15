import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View, Text } from "react-native";

interface FoodSearchProps {
  searchQuery: string;
}

const FoodSearch = ({ searchQuery }: FoodSearchProps) => {
  const isSearching = searchQuery.trim().length > 0;

  if (isSearching) {
    // Render Search Results
    return (
      <View className="flex-1 mt-2">
        <FlashList
          data={[1, 2, 3, 4, 5]} // Placeholder for food search results
          renderItem={({ item }) => (
            <View className="p-4 mx-4 mb-3 border border-gray-200 rounded-xl bg-white">
              <Text className="font-medium text-gray-900">Food Search Result {item}</Text>
            </View>
          )}
          keyExtractor={(item) => String(item)}
          estimatedItemSize={80}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  // Render "Exclusive only for you" (Idle State)
  return (
    <View className="flex-1 mt-2">
      <FlashList
        data={[1, 2, 3]} // Placeholder for food idle state
        renderItem={({ item }) => (
          <View className="p-4 mx-4 mb-3 border border-gray-200 rounded-xl bg-orange-50">
            <Text className="font-bold text-orange-800">Exclusive Food Offer {item}</Text>
          </View>
        )}
        keyExtractor={(item) => String(item)}
        estimatedItemSize={80}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default FoodSearch;
