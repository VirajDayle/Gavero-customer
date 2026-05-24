import { AddressFormValues } from "@/app/(app)/(public)/address-details";
import { LABEL_ICONS, LABELS_NAME } from "@/src/constants/location";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { Control, useController } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

const SQUARE_SIZE = 72;
const GAP = 14;
// Coupled to LABELS_NAME.length — update if labels change
const LEFT_TRANSLATE = -1 * (SQUARE_SIZE + GAP) * (LABELS_NAME.length - 1);

const getIcon = (label: string): keyof typeof Ionicons.glyphMap =>
  LABEL_ICONS[label.toLowerCase()] ?? "compass-outline";

interface LabelSelectorsProps {
  control: Control<AddressFormValues>;
  shakeToken?: number;
}

const LabelSelectors = ({ control, shakeToken = 0 }: LabelSelectorsProps) => {
  // Each field registered directly — no prop drilling, no local value copies
  const { field: labelField } = useController({
    control,
    name: "selectedLabel",
  });

  const {
    field: customField,
    fieldState: { error },
  } = useController({
    control,
    name: "customLabel",
    rules: {
      validate: (value) =>
        labelField.value !== "other" || !!value.trim() || "Required",
    },
  });

  // Pure UI state — form doesn't care about these
  const [isOpen, setIsOpen] = useState(labelField.value === "other");
  const [isFocused, setIsFocused] = useState(false);

  const customLabelRef = useRef<TextInput>(null);
  const translateX = useSharedValue(isOpen ? LEFT_TRANSLATE : 0);
  const widthRight = useSharedValue(isOpen ? 200 : 0);
  const shakeX = useSharedValue(0);

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));
  const textBoxStyle = useAnimatedStyle(() => ({ width: widthRight.value }));
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  // Numeric token — re-fires even if validation fails twice in a row
  React.useEffect(() => {
    if (shakeToken > 0) {
      shake();
      customLabelRef.current?.focus();
    }
  }, [shakeToken]);

  function shake() {
    shakeX.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }

  function openInput() {
    translateX.value = withTiming(LEFT_TRANSLATE, { duration: 350 });
    widthRight.value = withDelay(150, withTiming(200, { duration: 300 }));
    requestAnimationFrame(() => customLabelRef.current?.focus());
    setIsOpen(true);
  }

  function closeInput() {
    widthRight.value = withTiming(0, { duration: 250 });
    translateX.value = withDelay(150, withTiming(0, { duration: 350 }));
    requestAnimationFrame(() => customLabelRef.current?.blur());
    setIsOpen(false);
  }

  function handleLabelPress(label: string) {
    labelField.onChange(label); // RHF owns the value directly
    if (label === "other") {
      if (!isOpen) openInput();
    } else {
      if (isOpen) closeInput();
    }
  }

  return (
    <View className="overflow-hidden">
      <Animated.View
        style={[{ gap: GAP, flexDirection: "row" }, animatedRowStyle]}
      >
        {LABELS_NAME.map((label) => (
          <Pressable
            key={label}
            onPress={() => handleLabelPress(label)}
            style={{
              width: SQUARE_SIZE,
              height: SQUARE_SIZE,
              borderRadius: 12,
              borderWidth: 0.5,
              borderColor: "#9CA3AF",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
            }}
            className={clsx(
              labelField.value === label ? "bg-gray-200" : "bg-white",
            )}
          >
            <Ionicons name={getIcon(label)} size={24} color="#374151" />
            <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </Text>
          </Pressable>
        ))}

        <View className="justify-center">
          <Animated.View style={shakeStyle}>
            <Animated.View
              style={[
                textBoxStyle,
                {
                  height: 30,
                  borderBottomWidth: 1,
                  borderColor: error
                    ? "#FCA5A5"
                    : isFocused
                      ? "#111827"
                      : "#D1D5DB",
                  overflow: "hidden",
                },
              ]}
            >
              <TextInput
                ref={customLabelRef}
                value={customField.value}
                style={{
                  paddingBottom: 0,
                  textAlignVertical: "center",
                  height: "100%",
                  fontSize: 15,
                  fontWeight: "400",
                  color: "#111827",
                  letterSpacing: 0.5,
                }}
                onChangeText={customField.onChange} // direct — no wrapper needed
                onBlur={() => {
                  customField.onBlur(); // notify RHF of blur for touched state
                  setIsFocused(false);
                }}
                onFocus={() => setIsFocused(true)}
              />
            </Animated.View>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default LabelSelectors;
