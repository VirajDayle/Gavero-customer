export type DietaryPreference = "VEG" | "NON_VEG" | "VEGAN";

export type Item = {
  id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  dietaryType: DietaryPreference;
  image?: any; // Replaced ImageSourcePropType for generic compatibility
  isAvailable: boolean;
};

export type Combo = {
  id: string;
  name: string;
  items: Item[];
  originalPrice: number;
  discountedPrice: number;
};

export type SubSection = {
  id: string;
  name: string;
  type: "sub-section";
  data: Item[];
};

export type FlatSection = {
  id: string;
  name: string;
  type: "flat-section";
  data: Item[];
};

export type NestedSection = {
  id: string;
  name: string;
  type: "nested-section";
  data: SubSection[];
};

export type MenuSection = FlatSection | NestedSection;

export type Sections = SectionItem[];

type headerSpacer = {
  id: string;
  type: "headerSpacer";
};

type stickyHeader = {
  id: string;
  type: "stickyHeader";
};

type restaurantFilter = {
  id: string;
  type: "restaurantFilter";
};

type itemUnderType = {
  id: string;
  type: "itemUnder";
  items: Item[];
  priceThreshold: number;
};

type recommendedForYouType = {
  id: string;
  type: "recommendedForYou";
  items: Item[];
};

type comboOffersType = {
  id: string;
  type: "comboOffers";
  combos: Combo[];
};

export type SectionItem =
  | headerSpacer
  | stickyHeader
  | restaurantFilter
  | itemUnderType
  | recommendedForYouType
  | comboOffersType
  | MenuSection;

export type Section = SectionItem[];
