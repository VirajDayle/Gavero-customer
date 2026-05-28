import type { Product } from "@/src/types/product";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import ProductCard from "./ProductCard";

type GoToSectionProps = {
  title: string;
  products: Product[];
  cartQuantities: Record<string | number, number>;
  onAddProduct: (product: Product) => void;
  onIncrementProduct: (product: Product) => void;
  onDecrementProduct: (product: Product) => void;
  onSeeAllPress?: () => void;
};

const GoToSection = ({
  title,
  products,
  cartQuantities,
  onAddProduct,
  onIncrementProduct,
  onDecrementProduct,
  onSeeAllPress,
}: GoToSectionProps) => {
  return (
    <View className="py-4">
      {/* Header Container Row */}
      <View className="px-4 mb-3">
        <Text className="text-lg font-bold text-gray-900 tracking-tight">
          {title}
        </Text>
      </View>

      {/* Grid of 6 products */}
      <View className="flex-row flex-wrap px-2">
        {products.map((item) => {
          const currentQuantity = cartQuantities[item.id] ?? 0;
          return (
            <View key={item.id} className="w-1/3 px-1.5 mb-4">
              <ProductCard
                item={item}
                quantity={currentQuantity}
                onAdd={() => onAddProduct(item)}
                onIncrement={() => onIncrementProduct(item)}
                onDecrement={() => onDecrementProduct(item)}
                width="100%"
              />
            </View>
          );
        })}
      </View>

      {/* Production-grade 'See All' Bottom Trigger */}
      {onSeeAllPress && products.length > 0 && (
        <View className="px-4 mt-2">
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
};

export default GoToSection;
