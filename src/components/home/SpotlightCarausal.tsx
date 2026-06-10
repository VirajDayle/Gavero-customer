import React, { useCallback, useRef } from "react";
import {
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, Polygon, RadialGradient, Stop } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_MARGIN = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;

// ─── Shop Data ────────────────────────────────────────────────────────────────

const SHOPS = [
  {
    id: "1",
    name: "FreshMart",
    sub: "Groceries in 15 min",
    tag: "GROCERY",
    tagBg: "#1a6b3a",
    tagColor: "#6de8a0",
    bannerBg: ["#1a5c35", "#0d3d22"] as [string, string],
    spotColor: "#2dbd6e",
    headerTint: "rgba(13, 42, 26, 0.90)",
    bgColor: "#0d1f13",
  },
  {
    id: "2",
    name: "SpiceRoute",
    sub: "Restaurant · 25 min",
    tag: "FOOD",
    tagBg: "#6b1a0d",
    tagColor: "#ff9d7d",
    bannerBg: ["#8b2210", "#5c1508"] as [string, string],
    spotColor: "#ff6b2b",
    headerTint: "rgba(42, 15, 10, 0.90)",
    bgColor: "#1f0b06",
  },
  {
    id: "3",
    name: "MediQuick",
    sub: "Pharmacy · 20 min",
    tag: "PHARMACY",
    tagBg: "#0d2a4a",
    tagColor: "#7dbfff",
    bannerBg: ["#0d3a6b", "#082244"] as [string, string],
    spotColor: "#4a9eff",
    headerTint: "rgba(10, 26, 46, 0.90)",
    bgColor: "#060f1e",
  },
  {
    id: "4",
    name: "TrendyThreads",
    sub: "Fashion · Try & Buy",
    tag: "FASHION",
    tagBg: "#3d0a4a",
    tagColor: "#d97dff",
    bannerBg: ["#5c1080", "#3a0855"] as [string, string],
    spotColor: "#a84fff",
    headerTint: "rgba(26, 10, 46, 0.90)",
    bgColor: "#100820",
  },
];

const SHOP_COUNT = SHOPS.length;

// ─── Animated Spotlight ───────────────────────────────────────────────────────

type SpotlightProps = {
  scrollX: SharedValue<number>;
  side: "left" | "right";
};

const AnimatedSpotlight = ({ scrollX, side }: SpotlightProps) => {
  const animStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      scrollX.value,
      SHOPS.map((_, i) => i * CARD_WIDTH),
      SHOPS.map((s) => s.spotColor),
    );
    return { opacity: 1, tintColor: color };
  });

  // We animate the SVG stop color via a wrapper opacity trick —
  // each shop's spotlight is pre-rendered and we crossfade them.
  // For simplicity here, we render one SVG and animate opacity of a colored overlay.
  const colorStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      scrollX.value,
      SHOPS.map((_, i) => i * CARD_WIDTH),
      SHOPS.map((s) => s.spotColor),
    );
    return { backgroundColor: color };
  });

  const isLeft = side === "left";

  return (
    <View
      style={[
        styles.spotlightContainer,
        isLeft ? styles.spotlightLeft : styles.spotlightRight,
      ]}
      pointerEvents="none"
    >
      <Animated.View style={[StyleSheet.absoluteFill, styles.spotlightMask]}>
        {/* Colored cone via a masked gradient view */}
        <Animated.View style={[styles.spotlightColor, colorStyle]} />
      </Animated.View>
      <Svg width="160" height="300" viewBox="0 0 160 300">
        <Defs>
          <RadialGradient
            id={`sg_${side}`}
            cx={isLeft ? "0%" : "100%"}
            cy="100%"
            rx="100%"
            ry="100%"
          >
            <Stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
            <Stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Polygon
          points={isLeft ? "0,300 70,300 140,0" : "160,300 90,300 20,0"}
          fill={`url(#sg_${side})`}
        />
      </Svg>
    </View>
  );
};

// ─── Scene Background ─────────────────────────────────────────────────────────

const SceneBackground = ({ scrollX }: { scrollX: SharedValue<number> }) => {
  const bgStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      scrollX.value,
      SHOPS.map((_, i) => i * CARD_WIDTH),
      SHOPS.map((s) => s.bgColor),
    );
    return { backgroundColor: color };
  });

  return <Animated.View style={[StyleSheet.absoluteFill, bgStyle]} />;
};

// ─── Sticky Header ────────────────────────────────────────────────────────────

const StickyHeader = ({
  scrollX,
  topInset,
}: {
  scrollX: SharedValue<number>;
  topInset: number;
}) => {
  const headerStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      scrollX.value,
      SHOPS.map((_, i) => i * CARD_WIDTH),
      SHOPS.map((s) => s.headerTint),
    );
    return { backgroundColor: color };
  });

  return (
    <Animated.View
      style={[styles.header, { paddingTop: topInset + 8 }, headerStyle]}
    >
      <TouchableOpacity style={styles.headerLoc} activeOpacity={0.7}>
        <Text style={styles.headerPin}>📍</Text>
        <View>
          <Text style={styles.headerTitle}>Home</Text>
          <Text style={styles.headerSub}>Sector 4, Raipur ›</Text>
        </View>
      </TouchableOpacity>
      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Text style={styles.iconText}>🔍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Text style={styles.iconText}>🔔</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

// ─── Banner Card ──────────────────────────────────────────────────────────────

type Shop = (typeof SHOPS)[number];

const BannerCard = ({ shop }: { shop: Shop }) => (
  <View style={styles.card}>
    {/* Gradient bg simulated with two-color View */}
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: shop.bannerBg[0], borderRadius: 20 },
      ]}
    />
    <View style={[styles.cardOverlay, { borderRadius: 20 }]} />

    <View style={styles.cardContent}>
      <View style={[styles.tagPill, { backgroundColor: shop.tagBg }]}>
        <Text style={[styles.tagText, { color: shop.tagColor }]}>
          {shop.tag}
        </Text>
      </View>
      <Text style={styles.cardName}>{shop.name}</Text>
      <Text style={styles.cardSub}>{shop.sub}</Text>
    </View>
  </View>
);

// ─── Dot Indicators ───────────────────────────────────────────────────────────

const Dots = ({ scrollX }: { scrollX: SharedValue<number> }) => (
  <View style={styles.dotsRow}>
    {SHOPS.map((_, i) => {
      const dotStyle = useAnimatedStyle(() => {
        const active = interpolate(
          scrollX.value,
          [(i - 0.4) * CARD_WIDTH, i * CARD_WIDTH, (i + 0.4) * CARD_WIDTH],
          [0, 1, 0],
          Extrapolation.CLAMP,
        );
        return {
          width: interpolate(active, [0, 1], [6, 18]),
          opacity: interpolate(active, [0, 1], [0.35, 0.95]),
        };
      });
      return <Animated.View key={i} style={[styles.dot, dotStyle]} />;
    })}
  </View>
);

// ─── Quick Category Pills ─────────────────────────────────────────────────────

const CATEGORIES = [
  { label: "Grocery", emoji: "🛒" },
  { label: "Food", emoji: "🍛" },
  { label: "Pharmacy", emoji: "💊" },
  { label: "More", emoji: "⋯" },
];

const QuickCategories = () => (
  <View style={styles.categoryBar}>
    {CATEGORIES.map((c) => (
      <TouchableOpacity
        key={c.label}
        style={styles.catPill}
        activeOpacity={0.7}
      >
        <Text style={styles.catEmoji}>{c.emoji}</Text>
        <Text style={styles.catLabel}>{c.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SpotlightCarousel() {
  const insets = useSafeAreaInsets();
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<Animated.FlatList<Shop>>(null);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const renderItem = useCallback(
    ({ item }: { item: Shop }) => <BannerCard shop={item} />,
    [],
  );

  const keyExtractor = useCallback((item: Shop) => item.id, []);

  return (
    <View style={styles.root}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Scene background — interpolates per slide */}
      <SceneBackground scrollX={scrollX} />

      {/* Spotlights — bottom-left and bottom-right cones */}
      <AnimatedSpotlight scrollX={scrollX} side="left" />
      <AnimatedSpotlight scrollX={scrollX} side="right" />

      {/* Sticky header */}
      <StickyHeader scrollX={scrollX} topInset={insets.top} />

      {/* Carousel */}
      <View style={styles.carouselWrapper}>
        <Animated.FlatList<Shop>
          ref={flatListRef}
          data={SHOPS}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + CARD_MARGIN}
          snapToAlignment="start"
          decelerationRate="fast"
          contentContainerStyle={styles.flatListContent}
          onScroll={onScroll}
          scrollEventThrottle={16}
        />
        {/* Dots */}
        <Dots scrollX={scrollX} />
      </View>

      {/* Quick category strip */}
      <QuickCategories />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0d0d0d",
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 12,
    zIndex: 10,
  },
  headerLoc: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  headerPin: {
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  headerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 1,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 4,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  iconText: {
    fontSize: 18,
  },

  // Scene / spotlights
  spotlightContainer: {
    position: "absolute",
    bottom: 110,
    width: 160,
    height: 300,
    zIndex: 2,
    overflow: "hidden",
  },
  spotlightLeft: {
    left: -20,
  },
  spotlightRight: {
    right: -20,
  },
  spotlightMask: {
    // clip cone shape — actual cone drawn by SVG Polygon above
    zIndex: 1,
  },
  spotlightColor: {
    ...StyleSheet.absoluteFillObject,
    // This tints the white SVG polygon via mix-blend-mode equivalent
    // On RN we use opacity + colored overlay on top of white SVG
    opacity: 0.7,
  },

  // Carousel
  carouselWrapper: {
    flex: 1,
    justifyContent: "center",
    zIndex: 5,
  },
  flatListContent: {
    paddingHorizontal: CARD_MARGIN,
    gap: CARD_MARGIN,
    alignItems: "center",
  },
  card: {
    width: CARD_WIDTH,
    height: 180,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginRight: CARD_MARGIN,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0)",
    // Simulates gradient from bottom — use expo-linear-gradient for true gradient
    // LinearGradient from='transparent' to='rgba(0,0,0,0.65)' start={[0,0]} end={[0,1]}
  },
  cardContent: {
    padding: 16,
    zIndex: 2,
  },
  tagPill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  cardName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.3,
  },
  cardSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginTop: 3,
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    marginBottom: 4,
  },
  dot: {
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.85)",
  },

  // Category bar
  categoryBar: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.35)",
    borderTopWidth: 0.5,
    borderTopColor: "rgba(255,255,255,0.08)",
    zIndex: 5,
  },
  catPill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingVertical: 8,
  },
  catEmoji: {
    fontSize: 13,
  },
  catLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
});
