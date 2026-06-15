import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

export type FilterType = "ALL" | "VEG" | "NON_VEG";

interface RestaurantFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const RestaurantFilter = ({
  currentFilter,
  onFilterChange,
}: RestaurantFilterProps) => {
  const isVegSelected = currentFilter === "VEG";
  const isNonVegSelected = currentFilter === "NON_VEG";

  const handlePress = (type: "VEG" | "NON_VEG") => {
    if (currentFilter === type) {
      onFilterChange("ALL");
    } else {
      onFilterChange(type);
    }
  };

  const vegStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(isVegSelected ? "#dcfce7" : "#ffffff", {
      damping: 20,
      stiffness: 200,
    }),
    borderColor: withSpring(isVegSelected ? "#16a34a" : "#e5e7eb", {
      damping: 20,
      stiffness: 200,
    }),
  }));

  const nonVegStyle = useAnimatedStyle(() => ({
    backgroundColor: withSpring(isNonVegSelected ? "#fee2e2" : "#ffffff", {
      damping: 20,
      stiffness: 200,
    }),
    borderColor: withSpring(isNonVegSelected ? "#dc2626" : "#e5e7eb", {
      damping: 20,
      stiffness: 200,
    }),
  }));

  return (
    <View className="flex-row items-center space-x-3 px-4 py-3 bg-white gap-2">
      {/* Veg Button */}
      <Pressable onPress={() => handlePress("VEG")}>
        <Animated.View
          style={[
            vegStyle,
            {
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            },
          ]}
          className="flex-row items-center shadow-sm"
        >
          <View
            className="w-4 h-4 border flex items-center justify-center mr-1.5 bg-white"
            style={{ borderColor: "#16a34a", borderRadius: 4 }}
          >
            <View
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: "#16a34a" }}
            />
          </View>
          <Text
            className="text-sm font-semibold tracking-wide"
            style={{ color: isVegSelected ? "#16a34a" : "#4b5563" }}
          >
            Veg
          </Text>
          {isVegSelected && (
            <View className="ml-1">
              <Ionicons name="close" size={14} color="#16a34a" />
            </View>
          )}
        </Animated.View>
      </Pressable>

      {/* Non-Veg Button */}
      <Pressable onPress={() => handlePress("NON_VEG")}>
        <Animated.View
          style={[
            nonVegStyle,
            {
              borderWidth: 1,
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 6,
            },
          ]}
          className="flex-row items-center shadow-sm"
        >
          <View
            className="w-4 h-4 border flex items-center justify-center mr-1.5 bg-white"
            style={{ borderColor: "#dc2626", borderRadius: 4 }}
          >
            <View
              className="w-0 h-0 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent"
              style={{ borderBottomColor: "#dc2626" }}
            />
          </View>
          <Text
            className="text-sm font-semibold tracking-wide"
            style={{ color: isNonVegSelected ? "#dc2626" : "#4b5563" }}
          >
            Non-Veg
          </Text>
          {isNonVegSelected && (
            <View className="ml-1">
              <Ionicons name="close" size={14} color="#dc2626" />
            </View>
          )}
        </Animated.View>
      </Pressable>
    </View>
  );
};

export default RestaurantFilter;
