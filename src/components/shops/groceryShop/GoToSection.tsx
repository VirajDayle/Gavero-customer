import type { Product } from "@/src/types/product";
import { ChevronRight } from "lucide-react-native";
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
    <View className="py-2.5 ">
      {/* Header Container Row */}
      <View className="px-4 mb-3 flex-row items-center justify-between">
        <Text className="text-xl font-black text-gray-900 tracking-tight">
          {title}
        </Text>
        {onSeeAllPress && products.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onSeeAllPress}
            className="flex-row items-center gap-0.5 bg-green-50 px-3 py-1 rounded-full border border-green-200"
          >
            <Text className="text-xs font-bold text-green-700 tracking-wide pr-0.5">
              Explore
            </Text>
            <ChevronRight size={14} color="#15803d" strokeWidth={3} />
          </TouchableOpacity>
        )}
      </View>

      {/* Grid of 6 products */}
      <View className="flex-row flex-wrap px-2">
        {products.map((item) => {
          const currentQuantity = cartQuantities[item.id] ?? 0;
          return (
            <View key={item.id} className="w-1/3 px-1.5 mb-2">
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

      {/* Bottom padding if needed */}
    </View>
  );
};

export default GoToSection;
