import type { CategoryProp } from "@/src/types/grocery";
import type { Product } from "@/src/types/product";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import clsx from "clsx";
import { router } from "expo-router";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ProductCard from "./ProductCard";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface VerticalExpandedShopsProps {
  /** Any array of categories — top chips, left rail & right products all derived from this */
  data: any[];
  initialTopId?: string;
}

// ─── CategoryItem (left rail) ─────────────────────────────────────────────────

const CategoryItem = memo(
  ({
    item,
    active,
    onPressIn,
  }: {
    item: any;
    active: boolean;
    onPressIn: () => void;
  }) => {
    const progress = useSharedValue(0);

    useEffect(() => {
      progress.value = withTiming(active ? 1 : 0, { duration: 200 });
    }, [active]);

    const imageStyle = useAnimatedStyle(() => ({
      transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.1]) }],
    }));

    const containerStyle = useAnimatedStyle(() => ({
      shadowOpacity: interpolate(progress.value, [0, 1], [0, 0.2]),
      elevation: interpolate(progress.value, [0, 1], [0, 6]),
    }));

    return (
      <Pressable
        className="relative items-center py-2 bg-white"
        onPressIn={onPressIn}
      >
        {active && (
          <View className="absolute right-0 top-2 bottom-2 w-0.75 bg-green-700 rounded-l-full" />
        )}
        {/* Outer shadow carrier */}
        <Animated.View
          style={[
            containerStyle,
            {
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              borderRadius: 12,
            },
          ]}
        >
          {/* Inner clip */}
          <View
            className={clsx(
              "h-15 w-15 rounded-xl overflow-hidden",
              active ? "bg-green-50" : "bg-gray-100",
            )}
          >
            {item.source || item.icon ? (
              <Animated.Image
                source={item.source ?? item.icon}
                style={[{ width: "100%", height: "100%" }, imageStyle]}
                resizeMode="cover"
              />
            ) : null}
          </View>
        </Animated.View>

        <View className="mt-1 items-center px-1.5">
          <Text
            className={clsx(
              "text-[9px] text-center",
              active ? "font-bold text-black" : "font-semibold text-gray-600",
            )}
          >
            {item.title}
          </Text>
        </View>
      </Pressable>
    );
  },
);

// ─── ProductGrid ──────────────────────────────────────────────────────────────

const ProductGrid = memo(
  ({
    products,
    cart,
    onAdd,
    onIncrement,
    onDecrement,
  }: {
    products: any[];
    cart: Record<string | number, number>;
    onAdd: (id: string | number) => void;
    onIncrement: (id: string | number) => void;
    onDecrement: (id: string | number) => void;
  }) => {
    const { width } = Dimensions.get("window");
    const rightPanelWidth = width * 0.78; // left rail takes ~22%
    const CARD_WIDTH = Math.floor((rightPanelWidth - 32) / 2);

    if (!products || !products.length) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-gray-400">No items available</Text>
        </View>
      );
    }

    // Coerce any[] to Product[] shape for ProductCard
    const typed = products as Product[];

    return (
      <FlashList
        data={typed}
        numColumns={2}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <View
            style={{
              paddingBottom: 4,
              paddingLeft: index % 2 === 0 ? 12 : 4,
              paddingRight: index % 2 === 0 ? 4 : 12,
            }}
          >
            <ProductCard
              item={item}
              quantity={cart[item.id] ?? 0}
              onAdd={() => onAdd(item.id)}
              onIncrement={() => onIncrement(item.id)}
              onDecrement={() => onDecrement(item.id)}
              width={CARD_WIDTH}
            />
          </View>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 12, paddingBottom: 24 }}
      />
    );
  },
);

// ─── Root ─────────────────────────────────────────────────────────────────────

const VerticalExpandedShops = ({
  data,
  initialTopId,
}: VerticalExpandedShopsProps) => {
  // ── Top chip state (active category) ────────────────────────────────────────
  const [activeTopId, setActiveTopId] = useState<string>(
    () => initialTopId || (data.length ? String(data[0].id ?? data[0].title) : ""),
  );

  // Active category object
  const activeCategory: any = useMemo(
    () =>
      data.find(
        (d) => String(d.id ?? d.title) === activeTopId,
      ) ?? data[0] ?? null,
    [data, activeTopId],
  );

  // subSections of the active category (left rail)
  const subSections: any[] = useMemo(
    () => activeCategory?.subSections ?? [],
    [activeCategory],
  );

  // ── Left chip state (active sub-section) ────────────────────────────────────
  const [activeLeftId, setActiveLeftId] = useState<string>(() =>
    subSections.length ? String(subSections[0].id) : "",
  );

  // Reset left rail when top chip changes
  useEffect(() => {
    if (subSections.length) {
      setActiveLeftId(String(subSections[0].id));
    }
  }, [activeTopId]);

  // Active sub-section object
  const activeSubSection: any = useMemo(
    () => subSections.find((s) => String(s.id) === activeLeftId) ?? subSections[0] ?? null,
    [subSections, activeLeftId],
  );

  // Products to show on the right
  const products: any[] = useMemo(
    () => activeSubSection?.products ?? [],
    [activeSubSection],
  );

  // ── Cart state ───────────────────────────────────────────────────────────────
  const [cart, setCart] = useState<Record<string | number, number>>({});

  const handleAdd = useCallback((id: string | number) => {
    setCart((prev) => ({ ...prev, [id]: 1 }));
  }, []);

  const handleIncrement = useCallback((id: string | number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }, []);

  const handleDecrement = useCallback((id: string | number) => {
    setCart((prev) => {
      const next = (prev[id] ?? 0) - 1;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View className="flex-1 w-full">
      {/* ── Top: back button + category chips ────────────────────────────── */}
      <View className="h-12 justify-center bg-white z-10 border-b border-gray-200">
        <View className="flex-row items-center px-3">
          <Pressable
            className="bg-gray-100 rounded-full p-2 mr-3"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} />
          </Pressable>
          <View className="flex-1">
            <FlatList
              data={data}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => String(item.id ?? item.title)}
              ItemSeparatorComponent={() => <View className="w-3" />}
              contentContainerStyle={{ alignItems: "center" }}
              renderItem={({ item }) => {
                const key = String(item.id ?? item.title);
                const isActive = key === activeTopId;
                return (
                  <Pressable
                    onPress={() => setActiveTopId(key)}
                    className={clsx(
                      "px-3 py-1.5 flex-row items-center justify-center rounded-xl",
                      isActive
                        ? "bg-gray-100 border-gray-300 border"
                        : "bg-white",
                    )}
                  >
                    <Text className="text-[12px] text-gray-900 font-medium">
                      {item.title}
                    </Text>
                  </Pressable>
                );
              }}
            />
          </View>
        </View>
      </View>

      {/* ── Body: left rail + right grid ─────────────────────────────────── */}
      <View className="flex-row flex-1 w-full">
        {/* Left: Sub-category Rail */}
        <View
          className="w-[22%] bg-white"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 0 },
            shadowOpacity: 0.06,
            shadowRadius: 4,
            elevation: 4,
            zIndex: 1,
          }}
        >
          <FlatList
            data={subSections}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => {
              const key = String(item.id);
              return (
                <CategoryItem
                  item={item}
                  active={key === activeLeftId}
                  onPressIn={() => setActiveLeftId(key)}
                />
              );
            }}
            showsVerticalScrollIndicator={false}
            initialNumToRender={10}
            windowSize={5}
            removeClippedSubviews
          />
        </View>

        {/* Right: Product Grid */}
        <View className="flex-1 bg-white">
          <ProductGrid
            key={activeLeftId}
            products={products}
            cart={cart}
            onAdd={handleAdd}
            onIncrement={handleIncrement}
            onDecrement={handleDecrement}
          />
        </View>
      </View>
    </View>
  );
};

export default VerticalExpandedShops;
