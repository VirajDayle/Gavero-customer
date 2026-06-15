import { Ionicons } from "@expo/vector-icons";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import clsx from "clsx";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FoodItemCard } from "./FoodItem";
import type { Combo } from "./type";

interface ComboOfferDetailsProps {
  combo: Combo;
  onClose: () => void;
}

const ComboOfferDetails = ({ combo, onClose }: ComboOfferDetailsProps) => {
  const insets = useSafeAreaInsets();
  const [quantity, setQuantity] = useState(0);

  return (
    <View className="flex-1">
      <View className="px-4 pt-2 pb-3 border-b border-gray-100 flex-row items-center justify-between">
        <View>
          <Text className="text-xl font-bold text-gray-900">{combo.name}</Text>
          <Text className="text-sm text-gray-500">
            {combo.items.length} items included
          </Text>
        </View>
        <Pressable onPress={onClose}>
          <Ionicons name="close" size={24} color="#374151" />
        </Pressable>
      </View>

      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120, paddingTop: 8 }}
      >
        {combo.items.map((foodItem) => (
          <FoodItemCard
            key={foodItem.id}
            item={foodItem}
            hideAddButton={true}
          />
        ))}
      </BottomSheetScrollView>
      {/* Sticky Bottom Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 px-4 py-3  border-t border-gray-100 shadow-sm flex-row gap-2 "
        // style={{ paddingBottom: Math.max(insets.bottom, 12) }}
      >
        <View className="justify-center">
          <Text className="text-lg text-gray-800 font-bold">
            ₹{combo.discountedPrice.toFixed(0)}
          </Text>
          <Text className="text-xs text-gray-400 line-through">
            ₹{combo.originalPrice.toFixed(0)}
          </Text>
        </View>
        <View className="h-12 flex-1">
          {quantity === 0 ? (
            <Pressable
              onPress={() => setQuantity(1)}
              className={clsx(
                "rounded-full h-full w-full flex-row items-center justify-center gap-2",
                "bg-zinc-800",
              )}
            >
              <Text className="text-lg text-white font-medium">
                Add Combo
              </Text>
            </Pressable>
          ) : (
            <View className="rounded-full h-full flex-row items-center justify-between px-6 bg-zinc-800 w-full">
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
    </View>
  );
};

export default ComboOfferDetails;
