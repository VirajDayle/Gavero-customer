import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import * as Haptics from "expo-haptics";
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

import { Plus } from "lucide-react-native";
// ─── Types ────────────────────────────────────────────────────────────────────

export interface AddCartHandle {
  reset: () => void;
  setQuantity: (qty: number) => void;
}

export interface AddCartProps {
  /** Initial quantity when the component mounts. Defaults to 0. */
  initialQuantity?: number;
  /** Minimum allowed quantity (inclusive). When reached, item is removed. Defaults to 0. */
  min?: number;
  /** Maximum allowed quantity (inclusive). Add button is disabled at this value. */
  max?: number;
  /** Milliseconds before the stepper auto-collapses back to the pill. Defaults to 2000. */
  autoCloseDelay?: number;
  /** Called whenever quantity changes. */
  onQuantityChange?: (quantity: number) => void;
  /** Called when item is removed (quantity reaches min). */
  onRemove?: () => void;
  /** Disable all interactions. */
  disabled?: boolean;
  /** Custom tailwind background color class. Defaults to "bg-green-900" */
  color?: string;
  /** Whether to open the stepper horizontally. Defaults to false (vertical). */
  horizontal?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

const AddCart = React.forwardRef<AddCartHandle, AddCartProps>(
  (
    {
      initialQuantity = 0,
      min = 0,
      max,
      autoCloseDelay = 1000,
      onQuantityChange,
      onRemove,
      disabled = false,
      color,
      horizontal = false,
    },
    ref,
  ) => {
    const [quantity, setQuantityState] = useState<number>(
      Math.max(initialQuantity, min),
    );
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestQuantity = useRef(quantity);
    latestQuantity.current = quantity;

    // ── Imperative handle ──────────────────────────────────────────────────
    useImperativeHandle(ref, () => ({
      reset: () => {
        clearTimer();
        setQuantityState(min);
        setIsOpen(false);
      },
      setQuantity: (qty: number) => {
        const clamped = clampQuantity(qty);
        setQuantityState(clamped);
        if (clamped <= min) setIsOpen(false);
      },
    }));

    // ── Helpers ───────────────────────────────────────────────────────────
    const clampQuantity = useCallback(
      (val: number) => {
        const lower = Math.max(val, min);
        return max !== undefined ? Math.min(lower, max) : lower;
      },
      [min, max],
    );

    const clearTimer = useCallback(() => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }, []);

    const scheduleAutoClose = useCallback(() => {
      clearTimer();
      timerRef.current = setTimeout(() => {
        setIsOpen(false);
      }, autoCloseDelay);
    }, [autoCloseDelay, clearTimer]);

    // Clear timer on unmount
    useEffect(() => () => clearTimer(), [clearTimer]);

    // Notify parent of quantity changes
    useEffect(() => {
      onQuantityChange?.(quantity);
    }, [quantity]); // intentionally exclude onQuantityChange to avoid infinite loops if caller passes inline fn

    // ── Handlers ──────────────────────────────────────────────────────────
    const handleAdd = useCallback(() => {
      if (disabled) return;
      if (max !== undefined && latestQuantity.current >= max) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      setQuantityState((prev) => {
        const next = prev + 1;
        return clampQuantity(next);
      });
      setIsOpen(true);
      scheduleAutoClose();
    }, [disabled, max, clampQuantity, scheduleAutoClose]);

    const handleRemove = useCallback(() => {
      if (disabled) return;

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const next = latestQuantity.current - 1;

      if (next <= min) {
        setQuantityState(min);
        setIsOpen(false);
        clearTimer();
        onRemove?.();
        return;
      }

      setQuantityState(clampQuantity(next));
      setIsOpen(true);
      scheduleAutoClose();
    }, [disabled, min, clampQuantity, clearTimer, scheduleAutoClose, onRemove]);

    const handlePillPress = useCallback(() => {
      if (disabled) return;

      if (quantity <= min) {
        handleAdd();
      } else {
        // Re-expand the stepper if user taps the collapsed pill
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsOpen(true);
        scheduleAutoClose();
      }
    }, [disabled, quantity, min, handleAdd, scheduleAutoClose]);

    // ── Derived state ─────────────────────────────────────────────────────
    const isAtMax = max !== undefined && quantity >= max;
    const isAtMin = quantity <= min;
    const hasItems = quantity > min;

    // ── Render ────────────────────────────────────────────────────────────
    return (
      <View
        className={clsx(
          "justify-center items-center",
          horizontal ? "w-[75px]" : "h-[72px]"
        )}
        accessibilityRole="adjustable"
        pointerEvents="box-none"
      >
        {!isOpen ? (
          // ── Collapsed pill ───────────────────────────────────────────
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(100)}
            layout={LinearTransition.duration(150)}
          >
            <Pressable
              onPress={handlePillPress}
              disabled={disabled}
              accessibilityLabel={
                hasItems ? `${quantity} in cart, tap to edit` : "Add to cart"
              }
              accessibilityHint={
                hasItems
                  ? "Double tap to expand quantity stepper"
                  : "Double tap to add item"
              }
              className={clsx(
                "rounded-full justify-center items-center border-[0.5] border-gray-300",
                hasItems ? "px-1 py-1" : "bg-white p-1.5",
                hasItems && (color || "bg-green-900"),
                disabled && "opacity-40",
              )}
              style={({ pressed }) => ({
                elevation: pressed ? 1 : 3,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: pressed ? 1 : 2 },
                shadowOpacity: pressed ? 0.08 : 0.15,
                shadowRadius: pressed ? 2 : 4,
                transform: [{ scale: pressed ? 0.95 : 1 }],
              })}
            >
              {!hasItems ? (
                <Plus strokeWidth={2.2} size={16} />
              ) : (
                <View className="flex-row items-center gap-[0.5]">
                  <Text className="text-white text-[12px] font-bold leading-none">
                    {quantity}
                  </Text>
                  <Ionicons name="close" size={12} color="#ffffff" />
                </View>
              )}
            </Pressable>
          </Animated.View>
        ) : (
          // ── Expanded stepper ─────────────────────────────────────────
          <Animated.View
            entering={FadeIn.duration(150)}
            exiting={FadeOut.duration(100)}
            layout={LinearTransition.duration(150)}
            className={clsx(
              "items-center justify-between rounded-full px-1 py-1",
              horizontal ? "flex-row min-w-[75px]" : "flex-col min-h-[75px]",
              color || "bg-green-900"
            )}
            style={{
              elevation: 4,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
            }}
          >
            {/* Add */}
            <Pressable
              onPress={handleAdd}
              disabled={disabled || isAtMax}
              accessibilityLabel="Increase quantity"
              hitSlop={{ top: 8, bottom: 4, left: 8, right: 8 }}
              style={({ pressed }) => ({
                opacity: isAtMax ? 0.35 : pressed ? 0.6 : 1,
                transform: [{ scale: pressed && !isAtMax ? 0.9 : 1 }],
              })}
            >
              <Ionicons name="add" color="#ffffff" size={18} />
            </Pressable>

            {/* Quantity label */}
            <Animated.Text
              key={quantity} // re-trigger animation on change
              entering={FadeIn.duration(100)}
              className="text-white text-[12px] font-bold text-center"
            >
              {quantity}
            </Animated.Text>

            {/* Remove / Trash */}
            <Pressable
              onPress={handleRemove}
              disabled={disabled}
              accessibilityLabel={isAtMin ? "Remove item" : "Decrease quantity"}
              hitSlop={{ top: 4, bottom: 8, left: 8, right: 8 }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.6 : 1,
                transform: [{ scale: pressed ? 0.9 : 1 }],
              })}
            >
              <Ionicons
                name={quantity <= min + 1 ? "trash-outline" : "remove-outline"}
                color="#ffffff"
                size={18}
              />
            </Pressable>
          </Animated.View>
        )}
      </View>
    );
  },
);

AddCart.displayName = "AddCart";

export default AddCart;
