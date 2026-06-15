import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface LocationInfoCardProps {
  line1?: string | null;
  formattedAddress?: string | null;
  onChangeAddress?: () => void;
}

const LocationInfoCard: React.FC<LocationInfoCardProps> = ({
  line1,
  formattedAddress,
  onChangeAddress,
}) => {
  return (
    <>
      <View className="items-center">
        <View
          className="flex-row items-center w-full p-2 bg-white gap-1.5 rounded-2xl border-[0.5] border-gray-200 shadow-sm"
          style={{
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
          }}
        >
          <View className="justify-center">
            <Ionicons name="location" size={24} />
          </View>
          <Text className="text-[12px] text-gray-600 flex-1">
            {line1 ? (
              <>
                <Text className="font-semibold text-gray-900">{line1}</Text>
                {", "}
              </>
            ) : null}
            {formattedAddress || "Unknown location"}
          </Text>
        </View>
      </View>
      <View className="items-center">
        <Pressable onPress={onChangeAddress}>
          <Text className="text-red-700 text-sm underline">Change address</Text>
        </Pressable>
      </View>
    </>
  );
};

export default LocationInfoCard;
