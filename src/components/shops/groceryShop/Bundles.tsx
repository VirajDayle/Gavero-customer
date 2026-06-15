import type { Product } from "@/src/types/product";
import { FlashList } from "@shopify/flash-list";
import { Plus } from "lucide-react-native";
import React, { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import AddCart from "./AddCart";
import BundleProductCard from "./BundleProductCard";

type BundlesProps = {
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
const CARD_WIDTH = 90;
const SPACING = 24; // Gap between cards
const ESTIMATED_SIZE = CARD_WIDTH + SPACING;

// Extracted static components to prevent garbage collection cycles
const ListSpacingSeparator = () => (
  <View style={{ width: SPACING, height: "100%", alignItems: "center" }}>
    <View style={{ height: 96, justifyContent: "center" }}>
      <Plus size={14} color="#64748b" strokeWidth={4} />
    </View>
  </View>
);

const Bundles = React.memo(
  ({
    title,
    products,
    cartQuantities,
    onAddProduct,
    onIncrementProduct,
    onDecrementProduct,
    onSeeAllPress,
    emptyMessage = "No bundles available",
  }: BundlesProps) => {
    // Memoized Render Item Callback
    const renderItem = useCallback(
      ({ item }: { item: Product }) => {
        const currentQuantity = cartQuantities[item.id] ?? 0;

        return (
          <View style={{ width: CARD_WIDTH }}>
            <BundleProductCard item={item} />
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
        paddingBottom: 0,
      }),
      [],
    );

    const originalPrice = useMemo(
      () => products.reduce((sum, p) => sum + p.price, 0),
      [products],
    );
    const bundlePrice = Math.round(originalPrice * 0.85); // 15% combo discount

    return (
      <View className="px-4 py-2">
        <View className="bg-blue-50 rounded-2xl pt-4 pb-2 border border-blue-100 shadow-sm shadow-blue-200/50 relative">
          {/* Header Title Section */}
          <View className="px-4 mb-3">
            <Text className="text-xl font-black text-blue-900 tracking-tight">
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

          {/* Bottom Combo Action Row */}
          {products.length > 0 && (
            <View className="mx-4 mt-2  border-t border-blue-200/60 flex-row items-center justify-between">
              <View className="mt-1.5">
                <Text className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-0.5">
                  You save ₹{originalPrice - bundlePrice} on all
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-xl font-black text-blue-950">
                    ₹{bundlePrice}
                  </Text>
                  <Text className="text-xs font-semibold text-blue-400 line-through mb-0.5">
                    ₹{originalPrice}
                  </Text>
                </View>
              </View>

              <View className="absolute bottom-1 -right-6  ">
                <AddCart horizontal />
              </View>
            </View>
          )}
        </View>
      </View>
    );
  },
);

Bundles.displayName = "Bundles";

export default Bundles;
