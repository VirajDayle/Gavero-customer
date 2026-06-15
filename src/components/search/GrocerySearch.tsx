import ProductCard from "@/src/components/shops/groceryShop/ProductCard";
import TopDeal from "@/src/components/shops/groceryShop/TopDeal";
import type { Product } from "@/src/types/product";
import { FlashList } from "@shopify/flash-list";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import GroceryItemCatalogue from "../home/GroceryItemCatalogue ";
import GroceryFilter from "./grocery/GroceryFilter";
import History from "./grocery/History";
import SearchLabel from "./grocery/SearchLabel";
import SearchSuggestion from "./grocery/SearchSuggestion";

// ─── Constants ───────────────────────────────────────────────────────────────

const PRODUCT_CARD_HEIGHT = 225;
const PRODUCT_CARD_COLUMNS = 3;
const PRODUCT_GRID_H_PADDING = 24;
const PRODUCT_GRID_BOTTOM_PADDING = 24;
const SUGGESTION_HEIGHT = 280;
const FILTER_HEIGHT = 52;
const SECTION_TITLE_HEIGHT = 44;
const TOP_DEALS_HEIGHT = 320;
const GROCERY_CATALOGUE_HEIGHT = 200;
const HISTORY_HEIGHT = 80;
const SEARCH_LABEL_HEIGHT = 52;

// ─── Types ────────────────────────────────────────────────────────────────────

type SectionTitleItem = { type: "title"; title: string };
type TopOffersItem = { type: "topOffers"; data: Product[] };
type ProductsVerticalItem = { type: "productsVertical"; data: Product[] };
type GroceryCatalogueItem = { type: "GroceryCatalogue" };
type SuggestionItem = { type: "Suggestion" };
type FilterItem = { type: "Filter" };
type HistoryItem = { type: "history" };
type SearchLabelItem = {
  type: "SearchLabel";
  query: string;
  responseTime?: number;
};

type ListItem =
  | SectionTitleItem
  | TopOffersItem
  | ProductsVerticalItem
  | GroceryCatalogueItem
  | SuggestionItem
  | FilterItem
  | HistoryItem
  | SearchLabelItem;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function productGridHeight(count: number): number {
  const rows = Math.ceil(count / PRODUCT_CARD_COLUMNS);
  return rows * PRODUCT_CARD_HEIGHT + PRODUCT_GRID_BOTTOM_PADDING;
}

function itemSize(item: ListItem): number {
  switch (item.type) {
    case "title":
      return SECTION_TITLE_HEIGHT;
    case "topOffers":
      return TOP_DEALS_HEIGHT;
    case "productsVertical":
      return productGridHeight(item.data.length);
    case "GroceryCatalogue":
      return GROCERY_CATALOGUE_HEIGHT;
    case "Suggestion":
      return SUGGESTION_HEIGHT;
    case "Filter":
      return FILTER_HEIGHT;
    case "history":
      return HISTORY_HEIGHT;
    case "SearchLabel":
      return SEARCH_LABEL_HEIGHT;
  }
}

// ─── Mock data (move to src/mocks/grocery.ts) ────────────────────────────────

const MOCK_PRODUCTS: Product[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: `Tata Tea Premium | Desh Ki Chai ${i + 1}`,
  price: 500 + i * 10,
  mrp: 600 + i * 10,
  image: {
    uri: "https://m.media-amazon.com/images/I/41wospnFmoL.AC_SX250.jpg",
  },
  inStock: true,
  unit: "1.5kg",
  shopName: i % 2 === 0 ? "D-Mart" : "Reliance Smart",
}));

// ─── Stable list data (module-level, never recreated) ────────────────────────

const IDLE_LIST_DATA: ListItem[] = [
  { type: "title", title: "Recent Search" },
  { type: "history" },
  { type: "title", title: "Popular In Grocery" },
  { type: "GroceryCatalogue" },
  { type: "title", title: "Suggestion For You" },
  { type: "productsVertical", data: MOCK_PRODUCTS.slice(0, 9) },
  { type: "topOffers", data: MOCK_PRODUCTS },
];

const SEARCH_LIST_DATA: ListItem[] = [
  { type: "Suggestion" },
  { type: "Filter" },
  { type: "productsVertical", data: MOCK_PRODUCTS },
];

// ─── Sub-renderers (module-level stable references) ───────────────────────────

const renderProductCard = ({ item }: { item: Product }) => (
  <View style={styles.productCardWrapper}>
    <ProductCard
      item={item}
      quantity={0}
      shopName={item.shopName}
      onAdd={() => {}}
      onIncrement={() => {}}
      onDecrement={() => {}}
      hideActions={true}
    />
  </View>
);

const productKeyExtractor = (item: Product) => String(item.id);

function renderSectionTitle(title: string) {
  return (
    <View style={styles.sectionTitleContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

function renderProductsGrid(data: Product[]) {
  const height = productGridHeight(data.length);
  return (
    <View style={[styles.gridWrapper, { height }]}>
      <FlashList
        data={data}
        renderItem={renderProductCard}
        keyExtractor={productKeyExtractor}
        numColumns={PRODUCT_CARD_COLUMNS}
        estimatedItemSize={PRODUCT_CARD_HEIGHT}
        contentContainerStyle={styles.gridContentContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

interface GrocerySearchProps {
  searchQuery: string;
  onSearchQueryChange?: (query: string) => void;
}

const GrocerySearch = ({
  searchQuery,
  onSearchQueryChange,
}: GrocerySearchProps) => {
  const isSearching = searchQuery.trim().length > 0;
  const [hasSelectedSuggestion, setHasSelectedSuggestion] = useState(false);
  const skipResetRef = useRef(false);

  useEffect(() => {
    if (skipResetRef.current) {
      skipResetRef.current = false;
      return;
    }
    setHasSelectedSuggestion(false);
  }, [searchQuery]);

  const listData = useMemo(() => {
    if (!isSearching) return IDLE_LIST_DATA;
    if (hasSelectedSuggestion) {
      return [
        { type: "SearchLabel", query: searchQuery },
        { type: "productsVertical", data: MOCK_PRODUCTS },
        { type: "title", title: "Related Products" },
        { type: "productsVertical", data: MOCK_PRODUCTS.slice(0, 6) },
      ] as ListItem[];
    }
    return [{ type: "Suggestion" }] as ListItem[];
  }, [isSearching, hasSelectedSuggestion]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    switch (item.type) {
      case "title":
        return renderSectionTitle(item.title);

      case "SearchLabel":
        return <SearchLabel query={item.query} />;

      case "history":
        return (
          <History
            onSelect={(text) => {
              skipResetRef.current = true;
              if (onSearchQueryChange) onSearchQueryChange(text);
              setHasSelectedSuggestion(true);
            }}
          />
        );

      case "topOffers":
        return (
          <TopDeal
            title="Top Offers For You"
            products={item.data}
            cartQuantities={{}}
            onAddProduct={() => {}}
            onIncrementProduct={() => {}}
            onDecrementProduct={() => {}}
            hideItemActions={true}
            showShopName={true}
          />
        );

      case "productsVertical":
        return renderProductsGrid(item.data);

      case "GroceryCatalogue":
        return (
          <View style={styles.catalogueWrapper}>
            <GroceryItemCatalogue />
          </View>
        );

      case "Suggestion":
        return (
          <SearchSuggestion
            onSelect={(text) => {
              skipResetRef.current = true;
              if (onSearchQueryChange) onSearchQueryChange(text);
              setHasSelectedSuggestion(true);
            }}
          />
        );

      case "Filter":
        return <GroceryFilter />;

      default:
        return null;
    }
  }, []);

  const overrideItemLayout = useCallback(
    (layout: { size?: number }, item: ListItem) => {
      layout.size = itemSize(item);
    },
    [],
  );

  const keyExtractor = useCallback(
    (item: ListItem, index: number) => `${item.type}-${index}`,
    [],
  );

  const getItemType = useCallback((item: ListItem, index: number) => {
    if (item.type === "productsVertical") {
      // Return a unique type to prevent the parent FlashList from recycling the nested FlashLists
      return `productsVertical-${index}`;
    }
    return item.type;
  }, []);

  const estimatedItemSize = useMemo(() => {
    const total = listData.reduce((sum, item) => sum + itemSize(item), 0);
    return Math.round(total / (listData.length || 1));
  }, [listData]);

  return (
    <View style={styles.container}>
      {hasSelectedSuggestion && <GroceryFilter />}
      <FlashList<ListItem>
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        overrideItemLayout={overrideItemLayout}
        getItemType={getItemType}
        estimatedItemSize={estimatedItemSize}
        contentContainerStyle={styles.listContentContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContentContainer: {
    paddingBottom: 24,
  },
  sectionTitleContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000",
    letterSpacing: -0.5,
  },
  gridWrapper: {
    width: "100%",
  },
  gridContentContainer: {
    paddingHorizontal: PRODUCT_GRID_H_PADDING / 2,
    paddingBottom: PRODUCT_GRID_BOTTOM_PADDING,
  },
  productCardWrapper: {
    flex: 1,
    paddingHorizontal: 4,
    paddingVertical: 8,
    height: PRODUCT_CARD_HEIGHT,
  },
  catalogueWrapper: {
    marginHorizontal: 16,
  },
});

export default GrocerySearch;
