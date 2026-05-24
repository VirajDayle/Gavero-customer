/**
 * AnimatedRevealCard
 *
 * Starts fully transparent. After `delay` ms:
 *   1. Background gradient + floating orbs bloom in
 *   2. Badge, headline, subtitle slide up and fade in
 *   3. Accent dots pop in with spring
 *
 * Non-interactive — pure static display / skeleton reveal.
 *
 * Dependencies:
 *   react-native-linear-gradient   (expo: expo-linear-gradient)
 *   react-native (Animated, View, Text, StyleSheet)
 */

import React, { useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, View, ViewStyle } from "react-native";
import LinearGradient from "react-native-linear-gradient";
// If using Expo: import { LinearGradient } from "expo-linear-gradient";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AnimatedRevealCardProps {
  /** ms to wait before starting the reveal (default 800) */
  delay?: number;
  /** Card width  (default 280) */
  width?: number;
  /** Card height (default 160) */
  height?: number;
  badge?: string;
  headline?: string;
  subtext?: string;
  style?: ViewStyle;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const AnimatedRevealCard: React.FC<AnimatedRevealCardProps> = ({
  delay = 800,
  width = 280,
  height = 160,
  badge = "Quick Commerce",
  headline = "Delivered in\n10 minutes",
  subtext = "Raipur · Indore · Coming soon",
  style,
}) => {
  // Shared enter progress (0 → 1 after delay)
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current; // opacity
  const badgeY = useRef(new Animated.Value(10)).current;
  const headAnim = useRef(new Animated.Value(0)).current;
  const headY = useRef(new Animated.Value(12)).current;
  const subAnim = useRef(new Animated.Value(0)).current;
  const subY = useRef(new Animated.Value(8)).current;
  const dot1Scale = useRef(new Animated.Value(0)).current;
  const dot2Scale = useRef(new Animated.Value(0)).current;
  const dot3Scale = useRef(new Animated.Value(0)).current;

  // Orb float loops (independent so they never stutter at boundary)
  const orb1X = useRef(new Animated.Value(0)).current;
  const orb1Y = useRef(new Animated.Value(0)).current;
  const orb2X = useRef(new Animated.Value(0)).current;
  const orb2Y = useRef(new Animated.Value(0)).current;
  const orb3X = useRef(new Animated.Value(0)).current;
  const orb3Y = useRef(new Animated.Value(0)).current;

  // Helper: recursive ping-pong so there's no withRepeat boundary stutter
  const floatLoop = (
    value: Animated.Value,
    toA: number,
    toB: number,
    durA: number,
    durB: number,
  ) => {
    Animated.timing(value, {
      toValue: toA,
      duration: durA,
      easing: Easing.inOut(Easing.sin),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (!finished) return;
      Animated.timing(value, {
        toValue: toB,
        duration: durB,
        easing: Easing.inOut(Easing.sin),
        useNativeDriver: true,
      }).start(({ finished: f }) => {
        if (f) floatLoop(value, toA, toB, durA, durB);
      });
    });
  };

  useEffect(() => {
    // Start orb floats immediately (they're invisible until bg fades in)
    floatLoop(orb1X, 14, -8, 2200, 1900);
    floatLoop(orb1Y, 10, -6, 1800, 2100);
    floatLoop(orb2X, -12, 8, 2400, 2000);
    floatLoop(orb2Y, -8, 10, 1900, 2300);
    floatLoop(orb3X, 8, -10, 2100, 1700);
    floatLoop(orb3Y, 12, -6, 2000, 2400);

    const sequence = Animated.sequence([
      // ① wait for delay
      Animated.delay(delay),

      // ② background fades in
      Animated.parallel([
        Animated.timing(bgOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]),

      // ③ badge
      Animated.delay(50),
      Animated.parallel([
        Animated.timing(badgeAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(badgeY, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // ④ headline
      Animated.delay(40),
      Animated.parallel([
        Animated.timing(headAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(headY, {
          toValue: 0,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // ⑤ subtext
      Animated.delay(30),
      Animated.parallel([
        Animated.timing(subAnim, {
          toValue: 1,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(subY, {
          toValue: 0,
          duration: 350,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // ⑥ dots with stagger
      Animated.delay(120),
      Animated.stagger(80, [
        Animated.spring(dot1Scale, {
          toValue: 1,
          friction: 5,
          tension: 220,
          useNativeDriver: true,
        }),
        Animated.spring(dot2Scale, {
          toValue: 1,
          friction: 5,
          tension: 220,
          useNativeDriver: true,
        }),
        Animated.spring(dot3Scale, {
          toValue: 1,
          friction: 5,
          tension: 220,
          useNativeDriver: true,
        }),
      ]),
    ]);

    sequence.start();
  }, [delay]);

  return (
    <View
      style={[styles.container, { width, height, borderRadius: 18 }, style]}
    >
      {/* ── Background gradient ──────────────────────────────────────── */}
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: bgOpacity }]}>
        <LinearGradient
          colors={["#1a0a2e", "#2d1060", "#0f2040", "#1a2a10", "#2a0a1e"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* ── Orb 1 – purple ───────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.orb,
          styles.orb1,
          {
            opacity: bgOpacity,
            transform: [{ translateX: orb1X }, { translateY: orb1Y }],
          },
        ]}
      />

      {/* ── Orb 2 – teal ─────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.orb,
          styles.orb2,
          {
            opacity: bgOpacity,
            transform: [{ translateX: orb2X }, { translateY: orb2Y }],
          },
        ]}
      />

      {/* ── Orb 3 – amber ────────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.orb,
          styles.orb3,
          {
            opacity: bgOpacity,
            transform: [{ translateX: orb3X }, { translateY: orb3Y }],
          },
        ]}
      />

      {/* ── Text layer ───────────────────────────────────────────────── */}
      <View style={styles.textLayer}>
        <Animated.Text
          style={[
            styles.badge,
            { opacity: badgeAnim, transform: [{ translateY: badgeY }] },
          ]}
        >
          {badge.toUpperCase()}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.headline,
            { opacity: headAnim, transform: [{ translateY: headY }] },
          ]}
        >
          {headline}
        </Animated.Text>

        <Animated.Text
          style={[
            styles.subtext,
            { opacity: subAnim, transform: [{ translateY: subY }] },
          ]}
        >
          {subtext}
        </Animated.Text>

        {/* Accent dots */}
        <View style={styles.dotsRow}>
          {[
            { scale: dot1Scale, color: "#7c3aed" },
            { scale: dot2Scale, color: "#06b6d4" },
            { scale: dot3Scale, color: "#f59e0b" },
          ].map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: dot.color,
                  transform: [{ scale: dot.scale }],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
    backgroundColor: "transparent",
  },

  orb: {
    position: "absolute",
    borderRadius: 999,
  },
  orb1: {
    width: 150,
    height: 150,
    top: -40,
    left: -30,
    backgroundColor: "#7c3aed",
    opacity: 0.35,
    // RN doesn't have CSS blur — use a semi-transparent color + large radius
    // For blur effect add: BlurView from @react-native-community/blur
  },
  orb2: {
    width: 130,
    height: 130,
    bottom: -30,
    right: -20,
    backgroundColor: "#06b6d4",
    opacity: 0.25,
  },
  orb3: {
    width: 100,
    height: 100,
    top: 10,
    right: 20,
    backgroundColor: "#f59e0b",
    opacity: 0.2,
  },

  textLayer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },

  badge: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    color: "#a78bfa",
    marginBottom: 6,
  },

  headline: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f0f0ff",
    lineHeight: 22,
    marginBottom: 4,
  },

  subtext: {
    fontSize: 11,
    color: "rgba(200,190,255,0.65)",
    marginBottom: 8,
  },

  dotsRow: {
    flexDirection: "row",
    gap: 5,
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
