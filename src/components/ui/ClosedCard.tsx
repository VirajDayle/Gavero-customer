import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ICON_DURATION = 300;
const LETTER_DELAY = 150;
const HOLD_DURATION = 600;

interface ClosedCardProps {
  label: string;
  finalText: string;
  className?: string;
  textClassName?: string;
  finalTextClassName?: string;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  iconSize?: number;
}

type Phase = "typing" | "holding" | "done";

const ClosedCard = ({
  label,
  finalText,
  className,
  textClassName = "text-xl font-bold text-blue-900",
  finalTextClassName = "text-xl font-bold text-gray-900",
  iconName = "flash",
  iconColor = "#1e3a8a",
  iconSize = 20,
}: ClosedCardProps) => {
  const iconOpacity = useSharedValue(0);
  const iconScale = useSharedValue(0.6);
  const [visibleCount, setVisibleCount] = useState(0);
  const [phase, setPhase] = useState<Phase>("typing");

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];

    // Icon entrance
    iconOpacity.value = withTiming(1, { duration: ICON_DURATION });
    iconScale.value = withTiming(1, { duration: ICON_DURATION });

    // Letters type out
    (label || "").split("").forEach((_, i) => {
      timers.push(
        setTimeout(
          () => setVisibleCount(i + 1),
          ICON_DURATION + i * LETTER_DELAY,
        ),
      );
    });

    // Hold, then fade whole thing out and show final text
    const totalTypingTime = ICON_DURATION + (label || "").length * LETTER_DELAY;

    timers.push(setTimeout(() => setPhase("holding"), totalTypingTime));
    timers.push(
      setTimeout(() => setPhase("done"), totalTypingTime + HOLD_DURATION),
    );

    return () => timers.forEach(clearTimeout);
  }, [label]);

  const iconStyle = useAnimatedStyle(() => ({
    opacity: iconOpacity.value,
    transform: [{ scale: iconScale.value }],
  }));

  if (phase === "done") {
    return <FinalText finalText={finalText} className={finalTextClassName} />;
  }

  return (
    <Animated.View className={clsx("flex-row items-center gap-2", className)}>
      <Animated.View style={iconStyle}>
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </Animated.View>

      <View className="flex-row">
        {(label || "").split("").map((letter, i) => (
          <LetterItem
            key={i}
            letter={letter}
            visible={i < visibleCount}
            textClassName={textClassName}
          />
        ))}
      </View>
    </Animated.View>
  );
};

// Each animated letter
const LetterItem = ({
  letter,
  visible,
  textClassName,
}: {
  letter: string;
  visible: boolean;
  textClassName: string;
}) => {
  const opacity = useSharedValue(0);
  const translateX = useSharedValue(-6);
  const blur = useSharedValue(8);

  useEffect(() => {
    if (visible) {
      opacity.value = withTiming(1, { duration: 120 });
      translateX.value = withTiming(0, { duration: 120 });
      blur.value = withTiming(0, { duration: 180 });
    }
  }, [visible]);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
    filter: [{ blur: blur.value }],
  }));

  return (
    <Animated.Text style={style} className={textClassName}>
      {letter}
    </Animated.Text>
  );
};

// Final resting state — fades in once animation is done
const FinalText = ({
  finalText,
  className,
}: {
  finalText: string;
  className?: string;
}) => {
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 300 });
  }, []);

  const style = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.Text style={style} className={className}>
      {finalText}
    </Animated.Text>
  );
};

export default ClosedCard;
