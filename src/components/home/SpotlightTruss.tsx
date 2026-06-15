import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  SharedValue,
  useAnimatedProps,
} from "react-native-reanimated";
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  Line,
  LinearGradient,
  Polygon,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
const AnimatedEllipse = Animated.createAnimatedComponent(Ellipse);
const { width: W } = Dimensions.get("window");
const H = 200; // total height of the component

// ─── Types ────────────────────────────────────────────────────────────────────

type SpotlightTrussProps = {
  /** Reanimated shared value for carousel progress (0 to len-1) */
  progress: SharedValue<number>;
  /** Per-slide spot colours */
  spotColors: string[];
};

// ─── Truss Bar ────────────────────────────────────────────────────────────────
// Pure SVG, no animation needed — always black steel

export const TrussBar = ({ width }: { width: number }) => {
  const BAR_Y = 5;
  const BAR_H = 18;

  const startX = 20;
  const trussWidth = width - startX * 2;

  const segments = Math.max(6, Math.floor(trussWidth / 50));
  const segW = trussWidth / segments;

  const railHeight = 2.5;

  // Top rail position
  const topRailY = BAR_Y;

  // Bottom rail position
  const bottomRailY = BAR_Y + BAR_H - railHeight;

  // Center lines of rails
  const topJointY = topRailY + railHeight / 2;
  const bottomJointY = bottomRailY + railHeight / 2;

  return (
    <G>
      {/* Left End Cap */}
      <Rect
        x={startX - 5}
        y={BAR_Y - 4}
        width={5}
        height={BAR_H + 8}
        fill="#2A2A2A"
        rx={2}
      />

      {/* Right End Cap */}
      <Rect
        x={startX + trussWidth}
        y={BAR_Y - 4}
        width={5}
        height={BAR_H + 8}
        fill="#2A2A2A"
        rx={2}
      />

      {/* Top Rail */}
      <Rect
        x={startX}
        y={topRailY}
        width={trussWidth}
        height={railHeight}
        fill="#2A2A2A"
        rx={2}
      />

      {/* Bottom Rail */}
      <Rect
        x={startX}
        y={bottomRailY}
        width={trussWidth}
        height={railHeight}
        fill="#2A2A2A"
        rx={2}
      />

      {/* Vertical Members */}
      {Array.from({ length: segments + 1 }).map((_, i) => {
        const x = startX + i * segW;
        return (
          <Line
            key={`v-${i}`}
            x1={x}
            y1={topJointY}
            x2={x}
            y2={bottomJointY}
            stroke="#666"
            strokeWidth={1.5}
          />
        );
      })}

      {/* X Bracing */}
      {Array.from({ length: segments }).map((_, i) => {
        const x1 = startX + i * segW;
        const x2 = startX + (i + 1) * segW;

        return (
          <G key={`x-${i}`}>
            <Line
              x1={x1}
              y1={topJointY}
              x2={x2}
              y2={bottomJointY}
              stroke="#666"
              strokeWidth={1.5}
            />

            <Line
              x1={x1}
              y1={bottomJointY}
              x2={x2}
              y2={topJointY}
              stroke="#666"
              strokeWidth={1.5}
            />
          </G>
        );
      })}
    </G>
  );
};

// ─── Single Spotlight Head ───────────────────────────────────────────────────

type SpotHeadProps = {
  cx: number; // center x
  trussBottom: number;
  hangLength: number;
  tiltDeg?: number; // degrees — negative = left, positive = right
};

const SpotHead = ({
  cx,
  trussBottom,
  hangLength,
  tiltDeg = 0,
}: SpotHeadProps) => {
  const neckY = trussBottom + hangLength;
  const bodyH = 22;
  const bodyW = 20;
  const lensR = 7;

  // pivot = center of the lamp body bottom
  const pivotX = cx;
  const pivotY = neckY + bodyH;

  return (
    <G>
      {/* Hang wire */}
      <Line
        x1={cx}
        y1={trussBottom}
        x2={cx}
        y2={neckY}
        stroke="#666"
        strokeWidth={2}
      />
      <Rect x={cx - 6} y={neckY - 4} width={12} height={7} fill="#666" rx={2} />

      {/* Lamp body — rotated around pivot */}
      <G origin={`${pivotX}, ${pivotY}`} rotation={tiltDeg}>
        {/* Body trapezoid */}
        <Polygon
          points={`
            ${cx - bodyW / 2 + 5},${neckY + 2}
            ${cx + bodyW / 2 - 5},${neckY + 2}
            ${cx + bodyW / 2},${neckY + bodyH + 2}
            ${cx - bodyW / 2},${neckY + bodyH + 2}
          `}
          fill="#2A2A2A"
        />
        {/* Rim ring */}
        <Ellipse
          cx={cx}
          cy={neckY + bodyH + 2}
          rx={bodyW / 2}
          ry={5}
          fill="#2A2A2A"
          stroke="#666"
          strokeWidth={1.5}
        />
        {/* Lens glow */}
        <Circle
          cx={cx}
          cy={neckY + bodyH + 1}
          r={lensR}
          fill="#dff4ff"
          opacity={0.9}
        />
        <Circle
          cx={cx}
          cy={neckY + bodyH - 1}
          r={lensR - 3}
          fill="#ffffff"
          opacity={0.95}
        />
        {/* Top bracket knuckle */}
      </G>
    </G>
  );
};

// ─── Animated Cone ────────────────────────────────────────────────────────────

type AnimatedConeProps = {
  tipX: number;
  tipY: number;
  spreadX: number; // half-width at bottom
  bottomY: number;
  gradId: string;
  progress: SharedValue<number>;
  spotColors: string[];
};

const AnimatedCone = ({
  tipX,
  tipY,
  spreadX,
  bottomY,
  gradId,
  progress,
  spotColors,
}: AnimatedConeProps) => {
  const points = `${tipX},${tipY} ${tipX - spreadX},${bottomY} ${tipX + spreadX},${bottomY}`;

  return (
    <G>
      <Defs>
        {spotColors.map((color, index) => (
          <LinearGradient
            key={index}
            id={`${gradId}_${index}`}
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <Stop offset="0%" stopColor={color} stopOpacity={0.55} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </LinearGradient>
        ))}
      </Defs>
      {spotColors.map((color, index) => {
        const animatedProps = useAnimatedProps(() => {
          const len = spotColors.length;
          let diff = progress.value - index;
          diff = ((((diff + len / 2) % len) + len) % len) - len / 2;
          const opacity = Math.max(0, 1 - Math.abs(diff));
          return { opacity };
        });
        return (
          <AnimatedPolygon
            key={index}
            points={points}
            fill={`url(#${gradId}_${index})`}
            animatedProps={animatedProps}
          />
        );
      })}
    </G>
  );
};

// ─── Animated Pool (merged ellipse at bottom) ─────────────────────────────────

const AnimatedPool = ({
  cx,
  cy,
  rx,
  ry,
  gradId,
  scrollX,
  spotColors,
  slideWidth,
}: {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  gradId: string;
  progress: SharedValue<number>;
  spotColors: string[];
}) => {
  return (
    <G>
      <Defs>
        {spotColors.map((color, index) => (
          <RadialGradient
            key={index}
            id={`${gradId}_${index}`}
            cx="50%"
            cy="50%"
            rx="50%"
            ry="50%"
          >
            <Stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <Stop offset="100%" stopColor={color} stopOpacity={0} />
          </RadialGradient>
        ))}
      </Defs>
      {spotColors.map((color, index) => {
        const animatedProps = useAnimatedProps(() => {
          const len = spotColors.length;
          let diff = progress.value - index;
          diff = ((((diff + len / 2) % len) + len) % len) - len / 2;
          const opacity = Math.max(0, 1 - Math.abs(diff));
          return { opacity };
        });
        return (
          <AnimatedEllipse
            key={index}
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill={`url(#${gradId}_${index})`}
            animatedProps={animatedProps}
          />
        );
      })}
    </G>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SpotlightTruss({
  progress,
  spotColors,
}: SpotlightTrussProps) {
  const TRUSS_BOTTOM = 23; // bottom of truss rail
  const HANG = 10; // wire length
  const HEAD_BODY_H = 28;
  const TIP_Y = TRUSS_BOTTOM + HANG + HEAD_BODY_H; // cone tip = bottom of lamp

  // Three lamp positions
  const L_CX = W * 0.18; // left lamp
  const M_CX = W * 0.5; // center lamp
  const R_CX = W * 0.82; // right lamp

  const CONE_BOTTOM_Y = H - 40;
  const POOL_Y = H - 22;

  return (
    <View style={styles.root} pointerEvents="none">
      <Svg width={W} height={H}>
        {/* ── Light cones (drawn first, behind everything) ── */}
        <AnimatedCone
          tipX={L_CX}
          tipY={TIP_Y}
          spreadX={W * 0.15}
          bottomY={CONE_BOTTOM_Y}
          gradId="coneL"
          progress={progress}
          spotColors={spotColors}
        />
        <AnimatedCone
          tipX={M_CX}
          tipY={TIP_Y}
          spreadX={W * 0.15}
          bottomY={CONE_BOTTOM_Y}
          gradId="coneM"
          progress={progress}
          spotColors={spotColors}
        />
        <AnimatedCone
          tipX={R_CX}
          tipY={TIP_Y}
          spreadX={W * 0.15}
          bottomY={CONE_BOTTOM_Y}
          gradId="coneR"
          progress={progress}
          spotColors={spotColors}
        />

        {/* ── Merged pool of light at bottom ── */}

        {/* ── Truss bar (on top of cones) ── */}
        <TrussBar width={W} />

        {/* ── Spotlight heads ── */}
        <SpotHead
          cx={L_CX}
          trussBottom={TRUSS_BOTTOM}
          hangLength={HANG}
          tiltDeg={-16}
        />
        <SpotHead
          cx={M_CX}
          trussBottom={TRUSS_BOTTOM}
          hangLength={HANG}
          tiltDeg={0}
        />
        <SpotHead
          cx={R_CX}
          trussBottom={TRUSS_BOTTOM}
          hangLength={HANG}
          tiltDeg={16}
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: W,
    height: H,
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 3,
  },
});
