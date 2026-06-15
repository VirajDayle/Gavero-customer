import StoreHorizontalCard from "@/src/components/shops/Comman/StoreHorizontalCard";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { View, Text } from "react-native";

interface StoreSearchProps {
  searchQuery: string;
}

const StoreSearch = ({ searchQuery }: StoreSearchProps) => {
  const isSearching = searchQuery.trim().length > 0;

  if (isSearching) {
    // Render Search Results
    return (
      <View className="flex-1 mt-2">
        <FlashList
          data={[1, 2, 3]} // Placeholder for search results
          renderItem={({ item }) => (
            <View className="mb-4">
              <StoreHorizontalCard
                storeName={`Searched Store ${item}`}
                rating={4.8}
                deliveryTime="30-45 mins"
                distance="2.5 km"
                image={require("@/src/assets/images/balajimart.png")}
                subFaces={[
                  { id: "1", name: "Grocery", type: "grocery" },
                  { id: "2", name: "Food", type: "food" },
                ]}
                onPress={() => {}}
              />
            </View>
          )}
          keyExtractor={(item) => String(item)}
          estimatedItemSize={150}
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
        data={[1]} // Placeholder for idle state
        renderItem={({ item }) => (
          <View className="mb-4">
            <StoreHorizontalCard
              storeName="Balaji Mart and Restaurant"
              rating={4.8}
              deliveryTime="30-45 mins"
              distance="2.5 km"
              image={require("@/src/assets/images/balajimart.png")}
              subFaces={[
                { id: "1", name: "Grocery", type: "grocery" },
                { id: "2", name: "Food", type: "food" },
              ]}
              onPress={() => {}}
            />
          </View>
        )}
        keyExtractor={(item) => String(item)}
        estimatedItemSize={150}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default StoreSearch;
