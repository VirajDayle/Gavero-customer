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

export const TopDeal = React.memo(
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
      <View className="py-3 bg-orange-50 mb-2">
        {/* Header Title Section */}
        <View className="px-4 mb-3">
          <Text className="text-lg font-bold text-gray-900 tracking-tight">
            {title}
          </Text>
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

        {/* Production-grade 'See All' Bottom Trigger */}
        {onSeeAllPress && products.length > 0 && (
          <View className="px-4 mt-4">
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onSeeAllPress}
              className="w-full py-2.5 bg-gray-50 rounded-xl border border-gray-100 flex-row items-center justify-center"
            >
              <Text className="text-xs font-semibold text-orange-600 tracking-wide">
                See All Items
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  },
);

TopDeal.displayName = "TopDeal";

export default TopDeal;
