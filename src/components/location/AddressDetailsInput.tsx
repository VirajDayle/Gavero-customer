import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface AddressDetailsInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
  errorMessage?: string;
  submitCount?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AddressDetailsInput: React.FC<AddressDetailsInputProps> = ({
  value,
  onChangeText,
  onBlur,
  hasError = false,
  errorMessage,
  submitCount = 0,
}) => {
  const lineRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const shakeX = useSharedValue(0);

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeX.value }],
  }));

  function shake() {
    shakeX.value = withSequence(
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(-6, { duration: 50 }),
      withTiming(6, { duration: 50 }),
      withTiming(0, { duration: 50 }),
    );
  }

  useEffect(() => {
    if (hasError && submitCount > 0) {
      shake();
    }
  }, [submitCount]);

  return (
    <View>
      <View className="gap-1.5">
        <Text className="form-input-label">Address Details</Text>
        <AnimatedPressable
          onPress={() => lineRef.current?.focus()}
          style={[
            {
              borderColor: hasError ? "red" : isFocused ? "#111827" : "#E5E7EB",
            },
            shakeStyle,
          ]}
          className="form-input-box"
        >
          <TextInput
            ref={lineRef}
            className="form-input-text"
            placeholder="89 Tilak Marg"
            placeholderTextColor="#D1D5DB"
            autoCapitalize="words"
            autoCorrect={false}
            maxLength={100}
            value={value}
            onChangeText={onChangeText}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
          />
        </AnimatedPressable>
        {hasError && errorMessage && (
          <Text className="text-[10px] text-red-500 px-1 -mt-1">
            <Ionicons name="alert-outline" size={12} color="#FCA5A5" />
            {errorMessage}
          </Text>
        )}
        {!hasError && (
          <Text className="text-[10px] text-gray-500 px-1 -mt-1">
            e.g. Flat / House / Building no
          </Text>
        )}
      </View>
    </View>
  );
};

export default AddressDetailsInput;
