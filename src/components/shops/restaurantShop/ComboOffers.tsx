import React from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import AddCart from "../groceryShop/AddCart";
import { Combo } from "./type";

interface ComboOffersProps {
  combos: Combo[];
  onOpenCombo: (combo: Combo) => void;
}

const ComboOffers: React.FC<ComboOffersProps> = ({ combos, onOpenCombo }) => {
  if (!combos || combos.length === 0) return null;

  return (
    <View className="py-4 bg-white mt-2 border-y border-gray-100">
      <View className="px-4 mb-3 flex-row items-center justify-between">
        <Text className="text-xl font-black text-gray-900 tracking-tight">
          Combo Offers
        </Text>
        {/* <Text className="text-sm font-medium text-gray-500">
          Best pairings curated just for you
        </Text> */}
      </View>

      <FlatList
        data={combos}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        snapToInterval={280 + 16} // Width of card (280) + marginLeft (16 approx)
        decelerationRate="fast"
        renderItem={({ item, index }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => onOpenCombo(item)}
            className={`w-75 bg-[#FFF8E7] rounded-2xl p-4 pt-5 mt-4 shadow-md border border-gray-100 relative ${index !== combos.length - 1 ? "mr-4" : ""}`}
          >
            {/* Floating Combo Name Badge */}
            <View className="absolute -top-3.5 left-0 right-0 items-center z-10">
              <View className="bg-zinc-800 px-4 py-1 rounded-full border-2 border-[#FFF8E7] shadow-sm">
                <Text className="text-xs font-black text-white tracking-wider uppercase">
                  {item.name}
                </Text>
              </View>
            </View>

            {/* Header: Large Overlapping Images */}
            <View className="flex-row items-center justify-center mb-4">
              {item.items.slice(0, 4).map((i, idx) => (
                <View
                  key={`${i.id}-${idx}`}
                  className="w-18 h-18 rounded-full border-2 border-white overflow-hidden bg-gray-100 shadow-sm"
                  style={{ marginLeft: idx === 0 ? 0 : -20, zIndex: 10 - idx }}
                >
                  {i.image ? (
                    <Image
                      source={
                        typeof i.image === "string" ? { uri: i.image } : i.image
                      }
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="w-full h-full items-center justify-center bg-gray-200">
                      <Text className="text-[10px] text-gray-500 font-bold">
                        Img
                      </Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Combined Item Names */}
            <Text
              className="text-[13px] font-bold text-gray-800 text-center leading-snug mb-3"
              numberOfLines={2}
            >
              {item.items.map((i) => i.name).join(" + ")}
            </Text>

            {/* Divider */}
            <View className="w-full h-px bg-gray-300 mb-1" />

            {/* Footer: Price & AddCart */}
            <View className="flex-row items-center justify-between relative">
              <View className="mt-1.5">
                <Text className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-0.5">
                  You save ₹
                  {(item.originalPrice - item.discountedPrice).toFixed(0)} on
                  all
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-xl font-black text-gray-900">
                    ₹{item.discountedPrice.toFixed(0)}
                  </Text>
                  <Text className="text-xs font-semibold text-gray-400 line-through mb-0.5">
                    ₹{item.originalPrice.toFixed(0)}
                  </Text>
                </View>
              </View>

              <View className="absolute -right-5 bottom-0">
                <AddCart horizontal color="bg-zinc-800" />
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default ComboOffers;
