import Ionicons from "@expo/vector-icons/Ionicons";
import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SearchBarProps {
  /** Cycles through these strings as animated placeholder */
  placeholderAnimation?: {
    textList: string[];
    /** Milliseconds each string is shown before cycling. Default: 3000 */
    delay?: number;
  };
  style?: ViewStyle;
  /** Static placeholder — overrides animation if provided */
  placeholderText?: string;
  className?: string;
  /** Controlled value */
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void; // 👈 add this
  /** Whether the input accepts user input. Default: true */
  editable?: boolean;
  /** Forwarded ref for programmatic focus/blur from parent */
  inputRef?: React.RefObject<TextInput | null>;
  /** Auto-focus the input on mount */
  autoFocus?: boolean;
  /** Whether to show a back arrow instead of search icon */
  showBackArrow?: boolean;
  /** Callback for when the back arrow is pressed */
  onBackPress?: () => void;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEM_HEIGHT = 24;

// ─── Component ────────────────────────────────────────────────────────────────

const SearchBar = ({
  style,
  placeholderAnimation,
  placeholderText,
  className,
  editable = true,
  value,
  onChangeText,
  onFocus,
  onBlur,
  onClear,
  inputRef: externalInputRef,
  autoFocus,
  showBackArrow,
  onBackPress,
}: SearchBarProps) => {
  // Support both controlled and uncontrolled usage
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState("");
  const displayValue = isControlled ? value : internalValue;

  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const translateY = useRef(new Animated.Value(0)).current;
  const indexRef = useRef(0);
  const animationActive = useRef(false);

  // Internal ref used as fallback when no external ref is provided
  const internalInputRef = useRef<TextInput>(null);
  const activeRef = externalInputRef ?? internalInputRef;

  const delay = placeholderAnimation?.delay ?? 3000;
  const showAnimatedPlaceholder =
    displayValue.length === 0 &&
    !!placeholderAnimation?.textList?.length &&
    !placeholderText;

  // ── Placeholder animation ──────────────────────────────────────────────────

  useEffect(() => {
    const textList = placeholderAnimation?.textList;
    if (!textList?.length || !showAnimatedPlaceholder) {
      translateY.stopAnimation();
      translateY.setValue(0);
      animationActive.current = false;
      return;
    }

    if (animationActive.current) return;
    animationActive.current = true;

    let cancelled = false;

    const runCycle = () => {
      if (cancelled) return;

      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(translateY, {
          toValue: -ITEM_HEIGHT,
          duration: 300,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished || cancelled) return;

        indexRef.current = (indexRef.current + 1) % textList.length;
        setPlaceholderIndex(indexRef.current);
        translateY.setValue(ITEM_HEIGHT);

        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }).start(() => runCycle());
      });
    };

    runCycle();

    return () => {
      cancelled = true;
      animationActive.current = false;
      translateY.stopAnimation();
      translateY.setValue(0);
    };
  }, [showAnimatedPlaceholder, delay]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleChangeText = (text: string) => {
    if (!isControlled) setInternalValue(text);
    onChangeText?.(text);
  };

  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onChangeText?.("");
    if (onClear) {
      onClear(); // parent handles focus/blur
    } else {
      activeRef.current?.focus(); // standalone usage keeps keyboard up
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <View
      className={clsx(className, "h-[45] px-2 gap-3")}
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#F9FAFB",
          borderWidth: 1,
          borderColor: "#E5E7EB",
          borderRadius: 16,
        },
        style,
      ]}
    >
      {showBackArrow ? (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={onBackPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="arrow-back" size={22} color="#374151" />
        </TouchableOpacity>
      ) : (
        <Ionicons name="search" size={22} color="#374151" />
      )}

      <View style={{ flex: 1 }}>
        {showAnimatedPlaceholder && (
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
              {placeholderAnimation!.textList[placeholderIndex]}
            </Animated.Text>
          </View>
        )}

        <TextInput
          ref={activeRef}
          style={{ fontSize: 16, color: "#111827", letterSpacing: 0.5 }}
          keyboardType="default"
          value={displayValue}
          onChangeText={handleChangeText}
          onFocus={onFocus}
          onBlur={onBlur} // ← was missing the passthrough
          editable={editable}
          autoFocus={autoFocus}
          placeholder={placeholderText ?? ""}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          clearButtonMode="never" // we handle clearing ourselves
        />
      </View>

      {displayValue.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleClear}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="p-1 rounded-full"
          style={{ backgroundColor: "#F3F4F6" }}
        >
          <Ionicons name="close-outline" size={16} color="#374151" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
