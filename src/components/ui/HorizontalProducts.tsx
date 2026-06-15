import ProductCard from "@/src/components/shops/groceryShop/ProductCard";
import type { Product } from "@/src/types/product";
import React from "react";
import { Dimensions, View } from "react-native";

const { width } = Dimensions.get("window");
// 16px horizontal padding on both sides (32) + 8px gap between items * 2 (16) = 48 total space to subtract
const CARD_WIDTH = Math.floor((width - 48) / 3);

const noop = () => {};

interface HorizontalProductsProps {
  products: Product[];
}

export default React.memo(function HorizontalProducts({
  products,
}: HorizontalProductsProps) {
  return (
    <View className="py-2 px-4 flex-row flex-wrap" style={{ gap: 8 }}>
      {products.map((p) => (
        <ProductCard
          key={p.id.toString()}
          item={p}
          quantity={0}
          onAdd={noop}
          onIncrement={noop}
          onDecrement={noop}
          width={CARD_WIDTH}
        />
      ))}
    </View>
  );
});
