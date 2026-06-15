import Ionicons from "@expo/vector-icons/Ionicons";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export interface HomeHeaderProps {
  placeholders: string[];
  className?: string;
}

const PLACEHOLDERS = ["Rice and Wheat", "Imart", "Panchvati Restaurant"];
const ITEM_HEIGHT = 24;

const Search = ({ placeholders = PLACEHOLDERS, className }: HomeHeaderProps) => {
  const [searchInput, setSearchInput] = useState("");
  const [index, setIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0); // ✅ ref to avoid stale closure in recursive fn

  useEffect(() => {
    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;

      // Wait
      Animated.delay(3000).start(() => {
        // Slide current word out
        Animated.timing(translateY, {
          toValue: -ITEM_HEIGHT,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (!finished || cancelled) return;

          // CHANGE WORD IMMEDIATELY
          const currentPlaceholders = placeholders?.length > 0 ? placeholders : PLACEHOLDERS;
          indexRef.current = (indexRef.current + 1) % currentPlaceholders.length;

          setIndex(indexRef.current);

          // Move new word below instantly
          translateY.setValue(ITEM_HEIGHT);

          // Bring new word upward
          Animated.timing(translateY, {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }).start(() => {
            runCycle();
          });
        });
      });
    };

    runCycle();

    return () => {
      cancelled = true;
      translateY.stopAnimation();
      translateY.setValue(0);
    };
  }, [placeholders]);

  return (
    <View className={clsx(className)}>
      <View
        className="h-[45] px-2 gap-3"
        style={{
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 16,
        }}
      >
        <Ionicons name="search" size={22} color="#374151" />

        <View style={{ flex: 1 }}>
          {searchInput.length === 0 && (
            <View
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
                justifyContent: "center",
                overflow: "hidden",
                pointerEvents: "none",
              }}
            >
              <Animated.Text
                style={{
                  fontSize: 16,
                  color: "#9CA3AF",
                  transform: [{ translateY }],
                }}
              >
                {(placeholders?.length > 0 ? placeholders : PLACEHOLDERS)[index]}
              </Animated.Text>
            </View>
          )}

          <TextInput
            style={{ fontSize: 16, color: "#111827", letterSpacing: 0.5 }}
            placeholderTextColor="transparent"
            keyboardType="default"
            onChangeText={setSearchInput}
            value={searchInput}
            editable={false}
          />
        </View>

        {searchInput.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => setSearchInput("")}
            className="p-1 rounded-full"
            style={{ backgroundColor: "#F3F4F6" }}
          >
            <Ionicons name="close-outline" size={16} color="#374151" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default Search;
