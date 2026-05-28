import { ImageSourcePropType } from "react-native";
import type { Coupon } from "./coupon";
import type { Product } from "./product";

export interface SubSectionProp {
  id: string;
  title: string;
  products?: any[];
}

export interface CategoryProp {
  id: string;
  title: string;
  source: any;
  subSections: SubSectionProp[];
}

/** A single grocery sub-category with its associated products */
export interface CategoryData {
  id: string;
  title: string;
  icon: ImageSourcePropType;
  products: Product[];
}

/** A top-level shop type with its sub-categories (used in VerticalExpandedShops) */
export interface ShopTypeData {
  title: string;
  categories: CategoryData[];
}

// ─── GroceryShop Sections ────────────────────────────────────────────────────

export type CouponSection = {
  id: string;
  type: "couponSection";
  title: string;
  data: Coupon[];
};

export type TopDeal = {
  id: string;
  type: "topDeal";
  title: string;
  data: Product[];
};

export type CategorySection = {
  id: string;
  type: "internalCategory";
  title: string;
  data: CategoryProp[];
};

export type QuickGoSection = {
  id: string;
  type: "quickGo";
  title: string;
  data: { id: string; name: string }[];
};

export type GoToSection = {
  id: string;
  type: "goToSection";
  title: string;
  data: Product[];
};

export type BundleSection = {
  id: string;
  type: "bundles";
  title: string;
  data: Product[];
};

export type CustomRowSection = {
  id: string;
  type: "customRow";
  title: string;
  data: Product[];
};

export type FlashSaleSection = {
  id: string;
  type: "flashSale";
  title: string;
  data: Product[];
  endTime: string; // ISO string or timestamp
};

export type SectionItem =
  | CouponSection
  | CategorySection
  | TopDeal
  | QuickGoSection
  | GoToSection
  | BundleSection
  | CustomRowSection
  | FlashSaleSection;

export type Sections = SectionItem[];
