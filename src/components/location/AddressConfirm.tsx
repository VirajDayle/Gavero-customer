import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface AddressConfirmProp {
  isDragging: boolean;
  isGeocoding: boolean;
  formattedAddress?: string;
  onConfirm: () => void;
}

const AddressConfirm = ({
  isDragging,
  isGeocoding,
  formattedAddress,
  onConfirm,
}: AddressConfirmProp) => {
  if (isDragging) return null;
  return (
    <View className="flex-1 w-[90%] p-2 bg-white gap-3 rounded-2xl border-[0.5] border-gray-200">
      {isGeocoding ? (
        <View key="loading" className="flex-1 gap-1.5 justify-center">
          <View className="h-3.5 w-3/4 bg-gray-200 rounded-full animate-pulse" />
          <View className="h-3 w-full bg-gray-100 rounded-full animate-pulse" />
          <View className="h-3 w-2/3 bg-gray-100 rounded-full animate-pulse" />
        </View>
      ) : formattedAddress ? (
        <View key="loaded" className="flex-row items-center gap-2">
          <View className="justify-center">
            <Ionicons name="location" size={24} />
          </View>
          <Text className="text-[12px] text-gray-600 flex-1">
            <Text className="font-semibold text-gray-900">
              {formattedAddress.split(",")[0]}
            </Text>
            {", "}
            {formattedAddress.split(",").slice(1).join(",")}
          </Text>
        </View>
      ) : (
        <Text key="empty" className="text-[12px] text-gray-900">
          Move the map to select a location
        </Text>
      )}

      <Pressable
        className={clsx(
          "rounded-full py-2 flex-row items-center justify-center gap-2",
          formattedAddress ? "bg-orange-500" : "bg-gray-300",
          "active:opacity-70",
        )}
        onPress={onConfirm}
      >
        <Text className="text-lg text-white font-bold">Confirm Address</Text>
      </Pressable>
    </View>
  );
};

export default AddressConfirm;
