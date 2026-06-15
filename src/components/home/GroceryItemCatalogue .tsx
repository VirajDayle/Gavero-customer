import { GROCERY_CATEGORIES } from "@/src/mockData/grocery/groceryCategories";
import { CategoryProp } from "@/src/types/grocery";
import { Ionicons } from "@expo/vector-icons";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useRef } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";
import CatalogueBottomSheet from "../ui/CatalogueBottomSheet";

const CoreGroceryItem = ({ item }: { item: CategoryProp }) => {
  const imageSource = item.source ?? item.image;
  return (
    <Pressable
      onPress={() =>
        router.push({
          pathname: "/(app)/(public)/shop-expand",
          params: { categoryId: item.id },
        })
      }
    >
      {typeof imageSource === "string" ? (
        <Image
          source={{ uri: imageSource }}
          resizeMode="contain"
          className="w-20 h-22 rounded-xl border border-green-800 bg-gray-100"
        />
      ) : (
        <Image
          source={imageSource}
          className="w-20 h-22 rounded-xl border border-green-800"
        />
      )}
      <Text
        className="text-center text-[11px] mt-2 font-semibold text-gray-800 w-20"
        numberOfLines={2}
      >
        {item.title}
      </Text>
    </Pressable>
  );
};

export const GroceryItemCatalogue = () => {
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  return (
    <View>
      <FlatList
        data={GROCERY_CATEGORIES}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CoreGroceryItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
        ListFooterComponent={() => (
          <Pressable
            onPress={() => bottomSheetRef.current?.present()}
            className="mr-4"
          >
            <View className="w-20 h-22 rounded-xl border border-green-800 bg-green-50 items-center justify-center">
              <Ionicons name="arrow-forward" size={28} color="#166534" />
            </View>
            <Text
              className="text-center text-[11px] mt-2 font-semibold text-gray-800 w-20"
              numberOfLines={2}
            >
              See All
            </Text>
          </Pressable>
        )}
      />
      <CatalogueBottomSheet
        ref={bottomSheetRef}
        categories={GROCERY_CATEGORIES}
        title="All Categories"
        themeColor="#166534"
      />
    </View>
  );
};

export default GroceryItemCatalogue;
