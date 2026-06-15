import type { Product } from "@/src/types/product";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useMemo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ProductCard from "./ProductCard";

type HorizontalProductListProps = {
  title: string;
  products: Product[];
  cartQuantities: Record<string | number, number>;
  onAddProduct: (product: Product) => void;
  onIncrementProduct: (product: Product) => void;
  onDecrementProduct: (product: Product) => void;
  onSeeAllPress?: () => void;
  emptyMessage?: string;
};

// Layout constants for strict FlashList performance metrics
const CARD_WIDTH = 100;
const SPACING = 12; // Gap between cards (equivalent to mr-3)
const ESTIMATED_SIZE = CARD_WIDTH + SPACING;

// Extracted static components to prevent garbage collection cycles
const ListSpacingSeparator = () => <View style={{ width: SPACING }} />;

export const CustomRow = React.memo(
  ({
    title,
    products,
    cartQuantities,
    onAddProduct,
    onIncrementProduct,
    onDecrementProduct,
    onSeeAllPress,
    emptyMessage = "No products available",
  }: HorizontalProductListProps) => {
    // Memoized Render Item Callback
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

    // Fallback UI when the array is empty
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

    // Memoized Content Container Style to prevent object reference updates
    const listContainerStyle = useMemo(
      () => ({
        paddingLeft: 16,
        paddingRight: 16,
      }),
      [],
    );

    return (
      <View className="py-3">
        {/* Header Title Section */}
        <View className="px-4 mb-3 flex-row items-center justify-between">
          <Text className="text-xl font-black text-gray-900 tracking-tight">
            {title}
          </Text>
          {onSeeAllPress && products.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onSeeAllPress}
              className="bg-gray-100 px-3 py-1 rounded-full border border-gray-200"
            >
              <Text className="text-xs font-semibold text-gray-700">
                See All
              </Text>
            </TouchableOpacity>
          )}
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

        {/* Bottom space padding if needed */}
      </View>
    );
  },
);

CustomRow.displayName = "CustomRow";

export default CustomRow;
