import { AddressFormValues } from "@/app/(app)/(public)/address-details";
import { LABEL_ICONS, LABELS_NAME } from "@/src/constants/location";
import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import React, { useRef, useState } from "react";
import { Control, useController, useFormState } from "react-hook-form";
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
const LEFT_TRANSLATE = -1 * (SQUARE_SIZE + GAP) * (LABELS_NAME.length - 1);

const getIcon = (label: string): keyof typeof Ionicons.glyphMap =>
  LABEL_ICONS[label.toLowerCase()] ?? "compass-outline";

interface LabelSelectorProps {
  control: Control<AddressFormValues>;
}

const LabelSelectors = ({ control }: LabelSelectorProps) => {
  const { field: selectedLabelField } = useController({
    name: "selectedLabel",
    control,
  });

  const { field: customLabelField, fieldState: customLabelState } =
    useController({
      name: "customLabel",
      control,
    });

  const { submitCount } = useFormState({ control });

  const selectedLabel = selectedLabelField.value || "home";
  const customLabel = customLabelField.value || "";
  const hasError = !!customLabelState.error;

  const [isOpen, setIsOpen] = useState(selectedLabel === "other" || false);
  const [isFocused, setIsFocused] = useState(false);

  const customLabelRef = useRef<TextInput>(null);

  const translateX = useSharedValue(isOpen ? LEFT_TRANSLATE : 0);
  const widthRight = useSharedValue(isOpen ? 200 : 0);
  const shakeX = useSharedValue(0); // ← for shake animation

  const animatedRowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const textBoxStyle = useAnimatedStyle(() => ({
    width: widthRight.value,
  }));

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  React.useEffect(() => {
    if (hasError && submitCount > 0) {
      if (!isOpen) handleOther();
      shake();
      customLabelRef.current?.focus();
    }
  }, [submitCount]);

  function shake() {
    shakeX.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }

  function handleOther() {
    const toggle = !isOpen;

    if (toggle) {
      translateX.value = withTiming(LEFT_TRANSLATE, { duration: 350 });
      widthRight.value = withDelay(150, withTiming(150, { duration: 300 }));
    } else {
      widthRight.value = withTiming(0, { duration: 250 });
      translateX.value = withDelay(150, withTiming(0, { duration: 350 }));
    }

    requestAnimationFrame(() => {
      if (toggle) customLabelRef.current?.focus();
      else customLabelRef.current?.blur();
    });

    setIsOpen(toggle);
  }

  function handleLabelPress(label: string) {
    selectedLabelField.onChange(label);
    if (label === "other") handleOther();
    else if (isOpen) handleOther();
  }

  return (
    <View className="overflow-hidden">
      <Animated.View
        style={[{ gap: GAP, flexDirection: "row" }, animatedRowStyle]}
      >
        {LABELS_NAME.map((label) => {
          const isActive = selectedLabel === label;
          return (
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
              className={clsx(isActive ? "bg-gray-200" : "bg-white")}
            >
              <Ionicons name={getIcon(label)} size={24} color="#374151" />
              <Text
                style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </Text>
            </Pressable>
          );
        })}

        <View className="justify-center">
          <Animated.View style={shakeStyle}>
            <Animated.View
              style={[
                textBoxStyle,
                {
                  height: 30,
                  borderBottomWidth: 1,
                  borderColor: hasError
                    ? "red"
                    : isFocused
                      ? "#111827" // ← dark when focused
                      : "#D1D5DB", // ← default gray
                  overflow: "hidden",
                },
              ]}
            >
              <TextInput
                ref={customLabelRef}
                value={customLabel}
                style={{
                  paddingBottom: 0,
                  textAlignVertical: "center",
                  height: "100%",
                  fontSize: 15,
                  fontWeight: "400",
                  color: "#111827",
                  letterSpacing: 0.5,
                }}
                onChangeText={(text) => {
                  customLabelField.onChange(text);
                }}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            </Animated.View>
            {hasError && (
              <Text className="text-[10px] text-red-500 px-1 mt-0.5">
                <Ionicons name="alert-outline" size={12} color="#FCA5A5" />
                {customLabelState.error?.message}
              </Text>
            )}
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
};

export default LabelSelectors;
