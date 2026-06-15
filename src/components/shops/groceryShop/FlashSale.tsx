import type { Product } from "@/src/types/product";
import { FlashList } from "@shopify/flash-list";
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
    const [timeLeft, setTimeLeft] = useState(() =>
      formatTime(new Date(endTime).getTime() - Date.now()),
    );

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
      <View className="pt-2.5 bg-rose-50 border-y border-rose-100 mb-2">
        {/* Header Title Section */}
        <View className="px-4 mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            {/* <View className="bg-rose-200/60 p-1.5 rounded-full">
              <Clock size={16} color="#e11d48" strokeWidth={2.5} />
            </View> */}
            <Text className="text-xl font-black text-rose-950 tracking-tight">
              {title}
            </Text>
          </View>

          {/* Timer UI */}
          <View className="flex-row items-center gap-1 bg-white px-2 py-1.5 rounded-xl border border-rose-100 shadow-sm">
            <View className="bg-rose-600 w-6 h-6 rounded-md items-center justify-center shadow-sm">
              <Text className="text-[11px] font-black text-white leading-none">
                {timeLeft.h}
              </Text>
            </View>
            <Text className="text-rose-400 font-bold leading-none mb-0.5">
              :
            </Text>
            <View className="bg-rose-600 w-6 h-6 rounded-md items-center justify-center shadow-sm">
              <Text className="text-[11px] font-black text-white leading-none">
                {timeLeft.m}
              </Text>
            </View>
            <Text className="text-rose-400 font-bold leading-none mb-0.5">
              :
            </Text>
            <View className="bg-rose-600 w-6 h-6 rounded-md items-center justify-center shadow-sm">
              <Text className="text-[11px] font-black text-white leading-none">
                {timeLeft.s}
              </Text>
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
