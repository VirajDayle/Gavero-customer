/**
 * CandyRow — production-grade infinite-scroll icon strip
 *
 * Props
 * ──────────────────────────────────────────────────────
 * icons       – array of { icon: ImageSourcePropType } items for this row
 * direction   – "ltr" | "rtl"  (default: "ltr")
 * duration    – animation loop duration in ms  (default: 20_000)
 * copies      – how many times to duplicate the icon slice (default: 4)
 *               Rule: copies × (slice width) must exceed screen width.
 *               4 is safe for all phones at tileSize=34/gap=8.
 * tileSize    – px width & height of each tile  (default: 34)
 * tileGap     – px gap between tiles            (default: 8)
 * iconSize    – px width & height of the Image  (default: 26)
 * className   – NativeWind class string applied to the outer View
 */

import clsx from "clsx";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  ImageSourcePropType,
  View,
} from "react-native";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CandyRowIcon {
  /** The require(…) image source */
  icon: ImageSourcePropType;
  /** Optional semantic type — used as part of the stable React key */
  type?: string;
}

export interface CandyRowProps {
  icons: CandyRowIcon[];
  direction?: "ltr" | "rtl";
  duration?: number;
  copies?: number;
  tileSize?: number;
  tileGap?: number;
  iconSize?: number;
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CandyRow({
  icons,
  direction = "ltr",
  duration = 20_000,
  copies = 4,
  tileSize = 34,
  tileGap = 8,
  iconSize = 26,
  className,
}: CandyRowProps) {
  const translateX = useRef(new Animated.Value(0)).current;

  const tileStride = tileSize + tileGap;

  /**
   * loopWidth = the pixel distance for exactly ONE copy of the slice.
   *
   * We animate: 0 → -loopWidth  (ltr)  or  -loopWidth → 0  (rtl)
   * Because the strip is `copies` identical repetitions, snapping back
   * after one copy is completely invisible — seamless loop.
   *
   * The old code used `(icons.length * copies * stride) / 2` which is
   * only correct when copies === 2. With any other count it creates a
   * subtle jump or unnecessary over-travel.
   */
  const loopWidth = icons.length * tileStride;

  // Flatten copies into a stable keyed array — memoised so it's not
  // rebuilt on every render (animation state changes cause re-renders
  // via Animated internals on some RN versions).
  const allIcons = useMemo(
    () =>
      Array.from({ length: copies }, (_, copyIdx) =>
        icons.map((item, iconIdx) => ({
          ...item,
          _key: `c${copyIdx}-i${iconIdx}-${item.type ?? "icon"}`,
        })),
      ).flat(),
    // icons identity is stable (module-level constant); copies/type are
    // unlikely to change, but list them for correctness.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [icons, copies],
  );

  useEffect(() => {
    if (icons.length === 0 || loopWidth === 0) return;

    const startX = direction === "ltr" ? 0 : -loopWidth;
    const endX = direction === "ltr" ? -loopWidth : 0;

    translateX.setValue(startX);

    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: endX,
        duration,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    anim.start();
    return () => anim.stop();
    // Restart when any of these change (e.g. parent toggles direction).
    // translateX ref itself is stable — no need to list it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [direction, duration, loopWidth]);

  return (
    <View
      className={clsx("overflow-hidden", className)}
      style={{ overflow: "hidden" }} // belt-and-suspenders for RN platforms
    >
      <Animated.View
        style={{
          flexDirection: "row",
          gap: tileGap,
          transform: [{ translateX }],
        }}
      >
        {allIcons.map((item) => (
          <View
            key={item._key}
            style={{
              width: tileSize,
              height: tileSize,
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Image
              source={item.icon}
              style={{ width: iconSize, height: iconSize }}
              resizeMode="contain"
              fadeDuration={150}
            />
          </View>
        ))}
      </Animated.View>
    </View>
  );
}
