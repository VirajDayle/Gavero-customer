import type { Product } from "@/src/types/product";
import { FlashList } from "@shopify/flash-list";
import { Clock } from "lucide-react-native";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Text, View } from "react-native";
import ProductCard from "./ProductCard";

type FlashSaleProps = {
  title: string;
  products: Product[];
  endTime: string;
  cartQuantities: Record<string | number, number>;
  onAddProduct: (product: Product) => void;
  onIncrementProduct: (product: Product) => void;
  onDecrementProduct: (product: Product) => void;
  onSeeAllPress?: () => void;
  emptyMessage?: string;
};

// Layout constants for strict FlashList performance metrics
const CARD_WIDTH = 100;
const SPACING = 12; // Gap between cards
const ESTIMATED_SIZE = CARD_WIDTH + SPACING;

const ListSpacingSeparator = () => <View style={{ width: SPACING }} />;

// Helper to format time
const formatTime = (ms: number) => {
  if (ms <= 0) return { h: "00", m: "00", s: "00" };
  const totalSeconds = Math.floor(ms / 1000);
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
  const s = String(totalSeconds % 60).padStart(2, "0");
  return { h, m, s };
};

export const FlashSale = React.memo(
  ({
    title,
    products,
    endTime,
    cartQuantities,
    onAddProduct,
    onIncrementProduct,
    onDecrementProduct,
    emptyMessage = "No flash deals left!",
  }: FlashSaleProps) => {
    
    // Timer state
    const [timeLeft, setTimeLeft] = useState(() => formatTime(new Date(endTime).getTime() - Date.now()));

    useEffect(() => {
      const targetTime = new Date(endTime).getTime();
      
      const interval = setInterval(() => {
        const remaining = targetTime - Date.now();
        if (remaining <= 0) {
          clearInterval(interval);
          setTimeLeft({ h: "00", m: "00", s: "00" });
        } else {
          setTimeLeft(formatTime(remaining));
        }
      }, 1000);

      return () => clearInterval(interval);
    }, [endTime]);

    const renderItem = useCallback(
      ({ item }: { item: Product }) => {
        const currentQuantity = cartQuantities[item.id] ?? 0;

        return (
          <View style={{ width: CARD_WIDTH }} className="my-1">
            <ProductCard
              item={item}
              quantity={currentQuantity}
              onAdd={() => onAddProduct(item)}
              onIncrement={() => onIncrementProduct(item)}
              onDecrement={() => onDecrementProduct(item)}
            />
          </View>
        );
      },
      [cartQuantities, onAddProduct, onIncrementProduct, onDecrementProduct],
    );

    const renderEmptyState = useCallback(
      () => (
        <View className="py-4 px-4 items-center justify-center">
          <Text className="text-sm text-gray-400 font-medium">
            {emptyMessage}
          </Text>
        </View>
      ),
      [emptyMessage],
    );

    const listContainerStyle = useMemo(
      () => ({
        paddingLeft: 16,
        paddingRight: 16,
      }),
      [],
    );

    return (
      <View className="py-3 bg-red-50/80 mb-2">
        {/* Header Title Section */}
        <View className="px-4 mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-1.5">
            <Text className="text-lg font-bold text-red-950 tracking-tight">
              {title}
            </Text>
            <Clock size={16} color="#b91c1c" />
          </View>

          {/* Timer UI */}
          <View className="flex-row items-center gap-1">
            <View className="bg-red-600 px-1.5 py-1 rounded-md min-w-[24px] items-center">
              <Text className="text-[11px] font-bold text-white leading-none">{timeLeft.h}</Text>
            </View>
            <Text className="text-red-800 font-bold leading-none">:</Text>
            <View className="bg-red-600 px-1.5 py-1 rounded-md min-w-[24px] items-center">
              <Text className="text-[11px] font-bold text-white leading-none">{timeLeft.m}</Text>
            </View>
            <Text className="text-red-800 font-bold leading-none">:</Text>
            <View className="bg-red-600 px-1.5 py-1 rounded-md min-w-[24px] items-center">
              <Text className="text-[11px] font-bold text-white leading-none">{timeLeft.s}</Text>
            </View>
          </View>
        </View>

        {/* Optimized Horizontal List */}
        <FlashList
          horizontal
          data={products}
          renderItem={renderItem}
          keyExtractor={(item) => String(item.id)}
          estimatedItemSize={ESTIMATED_SIZE}
          ItemSeparatorComponent={ListSpacingSeparator}
          ListEmptyComponent={renderEmptyState}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={listContainerStyle}
        />
      </View>
    );
  },
);

FlashSale.displayName = "FlashSale";

export default FlashSale;
