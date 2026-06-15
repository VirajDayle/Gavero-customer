import React, { useCallback, useRef } from "react";
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  Easing,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  Path,
  Pattern,
  Rect,
} from "react-native-svg";

// ─── Palette ─────────────────────────────────────────────────────────────────

const C = {
  ivory: "#F5F0DC",
  maroon: "#8B1A1A",
  maroonD: "#6B1414",
  gold: "#C9A84C",
  blue: "#1a3a6e",
  chassis: "#2C2C2A",
  dark: "#1a1a1a",
  rail: "#888780",
  tie: "#5F5E5A",
  smoke: "#B4B2A9",
  amber: "#F5A623",
  platform: "#c0392b",
  bg: "#1a1a2e",
  red: "#e74c3c",
};

// ─── Types ────────────────────────────────────────────────────────────────────

import { MOCK_DATA_LIST } from "@/src/components/shops/restaurantShop/BigFoodItem";

export interface CoachItem {
  id: string;
  image: string;
  label: string;
  windowColor: string; // warm tint visible inside the window
}

const windowColors = [
  "#F4A460",
  "#FF8C69",
  "#90EE90",
  "#DEB887",
  "#FFD700",
  "#FFB6C1",
  "#87CEEB",
  "#FFDAB9",
];

export const FOOD_TRAIN_ITEMS: CoachItem[] = MOCK_DATA_LIST.map(
  (item, index) => ({
    id: index.toString(),
    image: item.image,
    label: item.name,
    windowColor: windowColors[index % windowColors.length],
  }),
);

// ─── Sizes ────────────────────────────────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get("window").width;
const BASE_COACH_W = 108;
const SCALE = SCREEN_WIDTH / 1.6 / BASE_COACH_W;

const BASE_ENGINE_W = 148;
const BASE_CABOOSE_W = 80;
const BASE_TRAIN_H = 120;

const ENGINE_W = BASE_ENGINE_W * SCALE;
const COACH_W = BASE_COACH_W * SCALE;
const CABOOSE_W = BASE_CABOOSE_W * SCALE;
const TRAIN_H = BASE_TRAIN_H * SCALE;

const BODY_Y = 14;
const BODY_H = 72;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function PalaceWheel({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <G>
      <Circle
        cx={cx}
        cy={cy}
        r={r}
        fill={C.dark}
        stroke={C.gold}
        strokeWidth={2}
      />
      <Line
        x1={cx - r}
        y1={cy}
        x2={cx + r}
        y2={cy}
        stroke={C.gold}
        strokeWidth={1.5}
      />
      <Line
        x1={cx}
        y1={cy - r}
        x2={cx}
        y2={cy + r}
        stroke={C.gold}
        strokeWidth={1.5}
      />
      <Line
        x1={cx - r * 0.7}
        y1={cy - r * 0.7}
        x2={cx + r * 0.7}
        y2={cy + r * 0.7}
        stroke={C.gold}
        strokeWidth={1}
      />
      <Line
        x1={cx + r * 0.7}
        y1={cy - r * 0.7}
        x2={cx - r * 0.7}
        y2={cy + r * 0.7}
        stroke={C.gold}
        strokeWidth={1}
      />
      <Circle cx={cx} cy={cy} r={r * 0.28} fill={C.gold} />
      <Circle cx={cx} cy={cy} r={r * 0.14} fill={C.chassis} />
    </G>
  );
}

function MughalPillar({
  x,
  bodyY,
  bodyH,
}: {
  x: number;
  bodyY: number;
  bodyH: number;
}) {
  const pH = bodyH - 10;
  const pY = bodyY + 8;
  return (
    <G>
      <Rect x={x} y={pY} width={8} height={pH} rx={2} fill={C.blue} />
      {/* top arch */}
      <Path
        d={`M${x + 4} ${pY} Q${x - 1} ${pY - 6} ${x + 4} ${pY - 6} Q${x + 9} ${pY - 6} ${x + 4} ${pY}`}
        fill={C.blue}
      />
      {/* bottom arch */}
      <Path
        d={`M${x + 4} ${pY + pH} Q${x - 1} ${pY + pH + 6} ${x + 4} ${pY + pH + 6} Q${x + 9} ${pY + pH + 6} ${x + 4} ${pY + pH}`}
        fill={C.blue}
      />
      {/* inner gold knots */}
      <Rect
        x={x + 1}
        y={pY + Math.round(pH * 0.2)}
        width={6}
        height={4}
        rx={1}
        fill="none"
        stroke={C.gold}
        strokeWidth={0.8}
      />
      <Rect
        x={x + 1}
        y={pY + Math.round(pH * 0.45)}
        width={6}
        height={4}
        rx={1}
        fill="none"
        stroke={C.gold}
        strokeWidth={0.8}
      />
      <Rect
        x={x + 1}
        y={pY + Math.round(pH * 0.7)}
        width={6}
        height={4}
        rx={1}
        fill="none"
        stroke={C.gold}
        strokeWidth={0.8}
      />
    </G>
  );
}

function TrackSegment({ width }: { width: number }) {
  const ties = Math.floor(width / 18);
  return (
    <Svg width={width} height={12} viewBox={`0 0 ${width} 12`}>
      <Line x1={0} y1={2} x2={width} y2={2} stroke={C.rail} strokeWidth={2.5} />
      <Line x1={0} y1={8} x2={width} y2={8} stroke={C.rail} strokeWidth={2.5} />
      {Array.from({ length: ties }).map((_, i) => (
        <Line
          key={i}
          x1={i * 18 + 6}
          y1={0}
          x2={i * 18 + 6}
          y2={12}
          stroke={C.tie}
          strokeWidth={3}
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
}

// ─── Animated smoke puff ──────────────────────────────────────────────────────

function SmokePuff({
  cx,
  cy,
  r,
  delay,
  scale = 1,
}: {
  cx: number;
  cy: number;
  r: number;
  delay: number;
  scale?: number;
}) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    const start = () => {
      opacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: delay }),
          withTiming(0.9, { duration: 100 }),
          withTiming(0, { duration: 900, easing: Easing.out(Easing.ease) }),
        ),
        -1,
      );
      translateY.value = withRepeat(
        withSequence(
          withTiming(0, { duration: delay }),
          withTiming(-28 * scale, {
            duration: 1000,
            easing: Easing.out(Easing.ease),
          }),
          withTiming(0, { duration: 0 }),
        ),
        -1,
      );
    };
    start();
  }, []);

  const style = useAnimatedStyle(() => ({
    position: "absolute",
    left: cx - r,
    top: cy - r + translateY.value,
    width: r * 2,
    height: r * 2,
    borderRadius: r,
    backgroundColor: C.smoke,
    opacity: opacity.value,
  }));

  return <Animated.View style={style} />;
}

// ─── Engine ───────────────────────────────────────────────────────────────────

function PalaceEngine({ wheelAngle }: { wheelAngle: SharedValue<number> }) {
  const bodyY = BODY_Y;
  const bodyH = BODY_H;

  return (
    <View style={{ width: ENGINE_W, height: TRAIN_H, position: "relative" }}>
      {/* smoke puffs */}
      <SmokePuff
        cx={38 * SCALE}
        cy={20 * SCALE}
        r={7 * SCALE}
        delay={0}
        scale={SCALE}
      />
      <SmokePuff
        cx={44 * SCALE}
        cy={14 * SCALE}
        r={5 * SCALE}
        delay={450}
        scale={SCALE}
      />
      <SmokePuff
        cx={32 * SCALE}
        cy={10 * SCALE}
        r={4 * SCALE}
        delay={900}
        scale={SCALE}
      />

      <Svg
        width={ENGINE_W}
        height={TRAIN_H}
        viewBox={`0 0 ${BASE_ENGINE_W} ${BASE_TRAIN_H}`}
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {/* chimney */}
        <Rect x={30} y={24} width={14} height={18} rx={2} fill={C.chassis} />
        <Rect x={26} y={22} width={22} height={5} rx={1} fill={C.chassis} />

        {/* boiler — ivory */}
        <Ellipse cx={70} cy={60} rx={32} ry={20} fill={C.ivory} />
        <Rect x={38} y={40} width={64} height={20} fill={C.ivory} />

        {/* maroon bands */}
        <Rect x={38} y={38} width={64} height={5} rx={1} fill={C.maroon} />
        <Rect x={38} y={73} width={64} height={5} rx={1} fill={C.maroon} />
        {/* gold lines */}
        <Rect x={38} y={43} width={64} height={3} fill={C.gold} opacity={0.5} />
        <Rect x={38} y={70} width={64} height={3} fill={C.gold} opacity={0.5} />

        {/* blue Mughal pillars on boiler */}
        <Rect x={48} y={43} width={8} height={25} rx={2} fill={C.blue} />
        <Ellipse cx={52} cy={42} rx={4} ry={3} fill={C.blue} />
        <Ellipse cx={52} cy={68} rx={4} ry={3} fill={C.blue} />
        <Rect x={72} y={43} width={8} height={25} rx={2} fill={C.blue} />
        <Ellipse cx={76} cy={42} rx={4} ry={3} fill={C.blue} />
        <Ellipse cx={76} cy={68} rx={4} ry={3} fill={C.blue} />

        {/* cab */}
        <Rect x={92} y={36} width={42} height={42} rx={4} fill={C.maroonD} />
        <Rect x={92} y={34} width={42} height={6} rx={2} fill={C.maroon} />
        {/* cab windows with amber glow */}
        <Rect
          x={98}
          y={42}
          width={14}
          height={12}
          rx={2}
          fill={C.amber}
          opacity={0.8}
        />
        <Rect
          x={114}
          y={42}
          width={14}
          height={12}
          rx={2}
          fill={C.amber}
          opacity={0.8}
        />
        <Rect
          x={98}
          y={42}
          width={14}
          height={12}
          rx={2}
          fill="none"
          stroke={C.maroon}
          strokeWidth={1.5}
        />
        <Rect
          x={114}
          y={42}
          width={14}
          height={12}
          rx={2}
          fill="none"
          stroke={C.maroon}
          strokeWidth={1.5}
        />

        {/* headlight */}
        <Circle cx={32} cy={62} r={7} fill="#FAC775" />
        <Circle cx={32} cy={62} r={4} fill="white" opacity={0.8} />

        {/* chassis */}
        <Rect x={18} y={78} width={122} height={14} rx={2} fill={C.chassis} />
        <Rect x={18} y={76} width={122} height={5} rx={1} fill={C.maroon} />
        {/* gold jaali strip */}
        <Line
          x1={18}
          y1={83}
          x2={140}
          y2={83}
          stroke={C.gold}
          strokeWidth={0.8}
          strokeDasharray="3,2"
        />
        <Line
          x1={18}
          y1={87}
          x2={140}
          y2={87}
          stroke={C.gold}
          strokeWidth={0.8}
          strokeDasharray="3,2"
        />

        {/* cowcatcher */}
        <Path d="M18 78 L4 94 L18 90 Z" fill="#444441" />

        {/* connector */}
        <Rect x={140} y={83} width={8} height={7} rx={1} fill={C.rail} />

        {/* Wheels */}
        <PalaceWheel cx={44} cy={BASE_TRAIN_H - 18} r={11} />
        <PalaceWheel cx={78} cy={BASE_TRAIN_H - 18} r={11} />
        <PalaceWheel cx={112} cy={BASE_TRAIN_H - 18} r={11} />

        {/* track */}
        <Line
          x1={0}
          y1={BASE_TRAIN_H - 8}
          x2={BASE_ENGINE_W}
          y2={BASE_TRAIN_H - 8}
          stroke={C.rail}
          strokeWidth={2.5}
        />
        <Line
          x1={0}
          y1={BASE_TRAIN_H - 4}
          x2={BASE_ENGINE_W}
          y2={BASE_TRAIN_H - 4}
          stroke={C.rail}
          strokeWidth={2.5}
        />
        {[8, 28, 52, 78, 104, 130].map((tx) => (
          <Line
            key={tx}
            x1={tx}
            y1={BASE_TRAIN_H - 9}
            x2={tx}
            y2={BASE_TRAIN_H - 3}
            stroke={C.tie}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}
      </Svg>
    </View>
  );
}

// ─── Coach ────────────────────────────────────────────────────────────────────

interface CoachProps {
  item: CoachItem;
  wheelAngle: SharedValue<number>;
  onPress: () => void;
}

function PalaceCoach({ item, onPress }: CoachProps) {
  const W = BASE_COACH_W;
  const H = BASE_TRAIN_H;
  const bY = BODY_Y;
  const bH = BODY_H;
  const winX = 12,
    winY = bY + 12,
    winW = W - 24,
    winH = 51;

  return (
    <Pressable
      onPress={onPress}
      style={{
        width: COACH_W,
        height: TRAIN_H,
        position: "relative",
        marginLeft: -1,
      }}
    >
      <Svg width={COACH_W} height={TRAIN_H} viewBox={`0 0 ${W} ${H}`}>
        {/* body */}
        <Rect x={0} y={bY} width={W} height={bH} fill={C.ivory} />

        {/* maroon bands top & bottom */}
        <Rect x={0} y={bY} width={W} height={6} fill={C.maroon} />
        <Rect x={0} y={bY + bH - 6} width={W} height={6} fill={C.maroon} />

        {/* gold accent lines */}
        <Rect
          x={0}
          y={bY + 6}
          width={W}
          height={3}
          fill={C.gold}
          opacity={0.5}
        />
        <Rect
          x={0}
          y={bY + bH - 9}
          width={W}
          height={3}
          fill={C.gold}
          opacity={0.5}
        />

        {/* ivory dots in lower maroon band */}
        {Array.from({ length: Math.floor(W / 5) }).map((_, i) => (
          <Circle
            key={i}
            cx={i * 5 + 2.5}
            cy={bY + bH - 3}
            r={1}
            fill={C.ivory}
            opacity={0.8}
          />
        ))}

        {/* Mughal pillars */}
        <MughalPillar x={4} bodyY={bY} bodyH={bH} />
        <MughalPillar x={W - 12} bodyY={bY} bodyH={bH} />

        {/* window */}
        <Rect
          x={winX}
          y={winY}
          width={winW}
          height={winH}
          rx={3}
          fill={item.windowColor}
          fillOpacity={0.25}
        />
        <Rect
          x={winX}
          y={winY}
          width={winW}
          height={winH}
          rx={3}
          fill="none"
          stroke={C.maroon}
          strokeWidth={2}
        />
        {/* inner gold frame */}
        <Rect
          x={winX + 3}
          y={winY + 3}
          width={winW - 6}
          height={winH - 6}
          rx={2}
          fill="none"
          stroke={C.gold}
          strokeWidth={0.8}
          opacity={0.7}
        />

        {/* chassis */}
        <Rect x={0} y={bY + bH} width={W} height={12} fill={C.chassis} />
        <Rect x={0} y={bY + bH} width={W} height={4} fill={C.maroon} />

        {/* connectors */}
        <Rect x={0} y={bY + bH - 3} width={7} height={7} rx={1} fill={C.rail} />
        <Rect
          x={W - 7}
          y={bY + bH - 3}
          width={7}
          height={7}
          rx={1}
          fill={C.rail}
        />

        {/* wheels */}
        <PalaceWheel cx={22} cy={H - 18} r={11} />
        <PalaceWheel cx={W - 22} cy={H - 18} r={11} />

        {/* track */}
        <Line
          x1={0}
          y1={H - 8}
          x2={W}
          y2={H - 8}
          stroke={C.rail}
          strokeWidth={2.5}
        />
        <Line
          x1={0}
          y1={H - 4}
          x2={W}
          y2={H - 4}
          stroke={C.rail}
          strokeWidth={2.5}
        />
        {Array.from({ length: 6 }).map((_, i) => (
          <Line
            key={i}
            x1={i * 18 + 4}
            y1={H - 9}
            x2={i * 18 + 4}
            y2={H - 3}
            stroke={C.tie}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}
      </Svg>

      {/* image centered in window */}
      <View
        style={{
          position: "absolute",
          left: winX * SCALE,
          top: winY * SCALE,
          width: winW * SCALE,
          height: winH * SCALE,
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          borderRadius: 3 * SCALE,
        }}
      >
        <Image
          source={{ uri: item.image }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
    </Pressable>
  );
}

// ─── Caboose ──────────────────────────────────────────────────────────────────

function PalaceCaboose() {
  const W = BASE_CABOOSE_W,
    H = BASE_TRAIN_H;
  const bY = BODY_Y,
    bH = BODY_H;
  return (
    <View style={{ width: CABOOSE_W, height: TRAIN_H, marginLeft: -1 }}>
      <Svg width={CABOOSE_W} height={TRAIN_H} viewBox={`0 0 ${W} ${H}`}>
        <Rect x={0} y={bY} width={W} height={bH} fill={C.ivory} />
        <Rect x={0} y={bY} width={W} height={6} fill={C.maroon} />
        <Rect x={0} y={bY + bH - 6} width={W} height={6} fill={C.maroon} />
        <Rect x={8} y={8} width={W - 16} height={12} rx={3} fill={C.maroonD} />
        <Rect x={8} y={6} width={W - 16} height={5} rx={2} fill={C.maroon} />
        {/* windows */}
        <Rect
          x={10}
          y={bY + 14}
          width={28}
          height={34}
          rx={3}
          fill={C.amber}
          fillOpacity={0.5}
        />
        <Rect
          x={10}
          y={bY + 14}
          width={28}
          height={34}
          rx={3}
          fill="none"
          stroke={C.maroon}
          strokeWidth={2}
        />
        <Rect
          x={42}
          y={bY + 14}
          width={28}
          height={34}
          rx={3}
          fill={C.amber}
          fillOpacity={0.5}
        />
        <Rect
          x={42}
          y={bY + 14}
          width={28}
          height={34}
          rx={3}
          fill="none"
          stroke={C.maroon}
          strokeWidth={2}
        />
        {/* connector left */}
        <Rect x={0} y={bY + bH - 3} width={7} height={7} rx={1} fill={C.rail} />
        {/* chassis */}
        <Rect x={0} y={bY + bH} width={W} height={12} fill={C.chassis} />
        <Rect x={0} y={bY + bH} width={W} height={4} fill={C.maroon} />
        {/* wheels */}
        <PalaceWheel cx={18} cy={H - 18} r={11} />
        <PalaceWheel cx={W - 18} cy={H - 18} r={11} />
        {/* track */}
        <Line
          x1={0}
          y1={H - 8}
          x2={W}
          y2={H - 8}
          stroke={C.rail}
          strokeWidth={2.5}
        />
        <Line
          x1={0}
          y1={H - 4}
          x2={W}
          y2={H - 4}
          stroke={C.rail}
          strokeWidth={2.5}
        />
        {[4, 22, 42, 62].map((tx) => (
          <Line
            key={tx}
            x1={tx}
            y1={H - 9}
            x2={tx}
            y2={H - 3}
            stroke={C.tie}
            strokeWidth={3}
            strokeLinecap="round"
          />
        ))}
      </Svg>
      <View
        style={{
          position: "absolute",
          bottom: 38 * SCALE,
          left: 0,
          right: 0,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            fontSize: 6 * SCALE,
            fontWeight: "800",
            color: C.maroon,
            letterSpacing: 1.5 * SCALE,
          }}
        >
          GAVERO
        </Text>
      </View>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface FoodTrainProps {
  items?: CoachItem[];
  onItemPress?: (item: CoachItem) => void;
}

export default function FoodTrain({
  items = FOOD_TRAIN_ITEMS,
  onItemPress,
}: FoodTrainProps) {
  const wheelAngle = useSharedValue(0);
  const lastScrollX = useRef(0);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const delta = x - lastScrollX.current;
      lastScrollX.current = x;
      wheelAngle.value += delta * 0.5;
    },
    [wheelAngle],
  );

  return (
    <View style={styles.scene}>
      {/* night sky strip */}
      <View style={styles.sky} />

      {/* Mughal Heading */}
      <View
        style={{
          width: SCREEN_WIDTH,
          height: 75 * SCALE,
          marginBottom: 8 * SCALE,
          alignItems: "center",
        }}
      >
        <Svg
          width={SCREEN_WIDTH}
          height={75 * SCALE}
          viewBox="0 0 100 40"
          preserveAspectRatio="none"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <Defs>
            <Pattern
              id="lattice"
              width="4"
              height="4"
              patternUnits="userSpaceOnUse"
            >
              <Path
                d="M 0 4 L 4 0 M -1 1 L 1 -1 M 3 5 L 5 3"
                stroke={C.gold}
                strokeWidth="0.4"
                opacity="0.35"
              />
              <Path
                d="M 0 0 L 4 4 M -1 3 L 1 5 M 3 -1 L 5 1"
                stroke={C.gold}
                strokeWidth="0.4"
                opacity="0.35"
              />
            </Pattern>
          </Defs>
          {/* Main Maroon Spandrel */}
          <Path
            d="M 0 0 L 100 0 L 100 40 L 96 40 L 96 28 Q 92 28, 87 20 Q 77 20, 67 12 Q 59.5 12, 50 4 Q 40.5 12, 33 12 Q 23 20, 13 20 Q 8 28, 4 28 L 4 40 L 0 40 Z"
            fill={C.maroon}
          />
          {/* Lattice Pattern Overlay */}
          <Path
            d="M 0 0 L 100 0 L 100 40 L 96 40 L 96 28 Q 92 28, 87 20 Q 77 20, 67 12 Q 59.5 12, 50 4 Q 40.5 12, 33 12 Q 23 20, 13 20 Q 8 28, 4 28 L 4 40 L 0 40 Z"
            fill="url(#lattice)"
          />
          {/* Outer Gold Border */}
          <Path
            d="M 96 40 L 96 28 Q 92 28, 87 20 Q 77 20, 67 12 Q 59.5 12, 50 4 Q 40.5 12, 33 12 Q 23 20, 13 20 Q 8 28, 4 28 L 4 40"
            fill="none"
            stroke={C.gold}
            strokeWidth="0.8"
          />
          {/* Inner Gold Border */}
          <Path
            d="M 94 40 L 94 27 Q 91 27, 86 18 Q 76 18, 67 10 Q 59 10, 50 2 Q 41 10, 33 10 Q 24 18, 14 18 Q 9 27, 6 27 L 6 40"
            fill="none"
            stroke={C.gold}
            strokeWidth="0.5"
            opacity="0.8"
          />
        </Svg>
        <Text
          style={{
            position: "absolute",
            top: 32 * SCALE,
            fontSize: 15 * SCALE,
            fontWeight: "900",
            fontStyle: "italic",
            color: C.gold,
            letterSpacing: 4 * SCALE,
            fontFamily: "serif",
            textTransform: "uppercase",
          }}
        >
          Train of {"\n"} joy
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="normal"
      >
        <PalaceEngine wheelAngle={wheelAngle} />
        {items.map((item) => (
          <PalaceCoach
            key={item.id}
            item={item}
            wheelAngle={wheelAngle}
            onPress={() => onItemPress?.(item)}
          />
        ))}
        <PalaceCaboose />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scene: {
    marginVertical: 12,
    overflow: "hidden",
  },
  sky: {
    height: 28 * SCALE,
  },
  scrollContent: {
    paddingHorizontal: 0,
    alignItems: "flex-end",
  },
  platform: {
    height: 16 * SCALE,
    backgroundColor: C.platform,
    borderTopWidth: 3,
    borderTopColor: C.red,
  },
  carpet: {
    height: 5 * SCALE,
    backgroundColor: C.red,
  },
});
