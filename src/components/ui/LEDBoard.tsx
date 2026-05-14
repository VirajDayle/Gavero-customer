import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";

type LEDBoardProps = {
  lines: string[];
  className?: string;
};

function useAirportTypewriter(enabled: boolean, lines: string[]) {
  const fullText = lines.join("\n");
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    if (!enabled) return;
    if (charIdx >= fullText.length) return;
    const timeout = setTimeout(
      () => setCharIdx((c) => c + 1),
      55 + Math.random() * 30,
    );
    return () => clearTimeout(timeout);
  }, [charIdx, enabled]);

  const typed = fullText.slice(0, charIdx);
  const parts = typed.split("\n");
  return {
    line1: parts[0] ?? "",
    line2: parts[1] ?? "",
    done: charIdx >= fullText.length,
  };
}

function LEDBoard({ lines, className }: LEDBoardProps) {
  const scaleAnim = useRef(new Animated.Value(0.82)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const [visible, setVisible] = useState(false);
  const cursorOpacity = useRef(new Animated.Value(1)).current;
  const { line1, line2, done } = useAirportTypewriter(visible, lines);

  useEffect(() => {
    const t = setTimeout(() => {
      setVisible(true);
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 140,
          friction: 10,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 100,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.88,
          duration: 100,
          easing: Easing.in(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();
    }, 5000);
    return () => clearTimeout(t);
  }, [done]);

  useEffect(() => {
    const blink = Animated.loop(
      Animated.sequence([
        Animated.timing(cursorOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(cursorOpacity, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]),
    );
    blink.start();
    return () => blink.stop();
  }, []);

  return (
    <Animated.View
      className={clsx("absolute left-6 right-6 z-20", className)}
      style={{
        transform: [{ translateY: -74 }, { scale: scaleAnim }],
        opacity: opacityAnim,
      }}
    >
      <View
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 18,
          paddingHorizontal: 22,
          paddingVertical: 22,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        <View style={{ gap: 4 }}>
          <Text
            style={{
              fontSize: 22,
              fontWeight: "700",
              color: "#F97316",
              letterSpacing: 0.3,
              lineHeight: 30,
            }}
          >
            {line1}
          </Text>

          <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "700",
                color: "#1F2937",
                letterSpacing: 0.3,
                lineHeight: 30,
              }}
            >
              {line2}
            </Text>
            {!done && (
              <Animated.View
                style={{
                  width: 12,
                  height: 22,
                  backgroundColor: "#F97316",
                  marginLeft: 3,
                  marginBottom: 1,
                  borderRadius: 2,
                  opacity: cursorOpacity,
                }}
              />
            )}
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

export default LEDBoard;
