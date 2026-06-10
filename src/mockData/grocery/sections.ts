import { GrocerySectionItem } from "@/src/types/grocery";
import { MOCK_COUPONS } from "./coupon";
import { GROCERY_CATEGORIES } from "./groceryCategories";
import { SUPERMARKET_PRODUCTS } from "./supermarketProducts";

export const GROCERY_SECTIONS: GrocerySectionItem[] = [
  {
    id: "0",
    type: "internalCategory",
    title: "",
    data: GROCERY_CATEGORIES,
  },
  {
    id: "1",
    type: "couponSection",
    title: "",
    data: MOCK_COUPONS,
  },

  {
    id: "top-deals",
    type: "topDeal",
    title: "Top Deals 🔥",
    data: SUPERMARKET_PRODUCTS.slice(0, 10),
  },

  {
    id: "flash-sale-1",
    type: "flashSale",
    title: "Midnight Craving Sale",
    data: SUPERMARKET_PRODUCTS.slice(3, 9),
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
  },

  {
    id: "2",
    type: "quickGo",
    title: "Quick Go",
    data: [
      { id: "1", name: "Fresh Fruits" },
      { id: "2", name: "Eggs & Dairy" },
      { id: "3", name: "Ice Creams" },
      { id: "4", name: "Snacks" },
      { id: "5", name: "Cold Drinks" },
      { id: "6", name: "Meat & Fish" },
      { id: "7", name: "Bakery" },
      { id: "8", name: "Vegetables" },
      { id: "9", name: "Chocolates" },
      { id: "10", name: "Cleaning" },
      { id: "11", name: "Personal Care" },
      { id: "12", name: "Pet Food" },
    ],
  },
  {
    id: "3",
    type: "goToSection",
    title: "Go To Snacks",
    data: SUPERMARKET_PRODUCTS.slice(10, 16),
  },
  {
    id: "4",
    type: "customRow",
    title: "Buy Again",
    data: SUPERMARKET_PRODUCTS.slice(0, 10),
  },
  {
    id: "top-deals2",
    type: "customRow",
    title: "Fresh Vegitables 🔥",
    data: SUPERMARKET_PRODUCTS.slice(0, 10),
  },
  {
    id: "bundle-1",
    type: "bundles",
    title: "Curated Bundles",
    data: SUPERMARKET_PRODUCTS.slice(0, 5),
  },
  {
    id: "top-deals3",
    type: "customRow",
    title: "Breads",
    data: SUPERMARKET_PRODUCTS.slice(0, 10),
  },
  {
    id: "top-deals4",
    type: "customRow",
    title: "Breakfast Essentials",
    data: SUPERMARKET_PRODUCTS.slice(0, 10),
  },
];
