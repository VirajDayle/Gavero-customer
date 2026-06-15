import type { Product } from "@/src/types/product";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useState } from "react";
import { Text, View } from "react-native";
import ProductCard from "./ProductCard";

interface ExpandRowsProps {
  title: string;
  products: Product[];
}

const ExpandRows = ({ title, products }: ExpandRowsProps) => {
  // Local cart state for this page (similar to how TopDeal manages it, or we could use global store if we had one)
  const [cartQuantities, setCartQuantities] = useState<Record<number, number>>(
    {},
  );

  const handleAddProduct = useCallback((product: Product) => {
    setCartQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  }, []);

  const handleIncrementProduct = useCallback((product: Product) => {
    setCartQuantities((prev) => ({
      ...prev,
      [product.id]: (prev[product.id] ?? 0) + 1,
    }));
  }, []);

  const handleDecrementProduct = useCallback((product: Product) => {
    setCartQuantities((prev) => {
      const next = { ...prev };
      if ((next[product.id] ?? 0) <= 1) {
        delete next[product.id];
      } else {
        next[product.id] -= 1;
      }
      return next;
    });
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => {
      const currentQuantity = cartQuantities[item.id] || 0;

      return (
        <View className="flex-1 px-1.5 py-2">
          <ProductCard
            item={item}
            quantity={currentQuantity}
            onAdd={() => handleAddProduct(item)}
            onIncrement={() => handleIncrementProduct(item)}
            onDecrement={() => handleDecrementProduct(item)}
            width="100%"
          />
        </View>
      );
    },
    [
      cartQuantities,
      handleAddProduct,
      handleIncrementProduct,
      handleDecrementProduct,
    ],
  );

  return (
    <View className="flex-1 bg-white">
      {!!title && (
        <View className="px-4 py-4 border-b border-gray-100">
          <Text className="text-xl font-black text-gray-900 tracking-tight">
            {title}
          </Text>
        </View>
      )}
      <FlashList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        numColumns={3}
        contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ExpandRows;
