import { Ionicons } from "@expo/vector-icons";

export const LOCATION = {
  formattedAddress:
    "DB City Mall, Zone-I, Maharana Pratap Nagar, Bhopal, Madhya Pradesh 462011, India",
};

export const LABEL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home-outline",
  work: "briefcase-outline",
  office: "business-outline",
};

export const LABELS_NAME = ["home", "work", "office", "other"] as const;

export type LabelType = (typeof LABELS_NAME)[number];
