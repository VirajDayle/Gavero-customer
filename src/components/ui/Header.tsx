import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

interface HeaderProps {
  title: string;
  back?: boolean;
  border?: boolean;
  onBack?: () => void;
}

const Header = ({
  title,
  back = false,
  border = false,
  onBack,
}: HeaderProps) => {
  return (
    <View
      className={clsx(
        "flex-row items-center justify-between px-5 py-2",
        border && "border-b border-gray-100",
      )}
    >
      {back ? (
        <Pressable
          onPress={() => (onBack ? onBack() : router.back())}
          className={clsx(
            "w-9 h-9 rounded-full bg-[#f5f5f5] items-center justify-center active:opacity-60 p-1",
          )}
          hitSlop={8}
        >
          <Ionicons name="arrow-back" size={22} color="#1a1a1a" />
        </Pressable>
      ) : (
        <View className="w-9 h-9" />
      )}
      <Text className="text-lg font-bold text-gray-900">{title}</Text>
      <View className="w-9" />
    </View>
  );
};

export default Header;
