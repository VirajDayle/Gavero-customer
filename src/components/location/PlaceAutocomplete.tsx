import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: Array<{ offset: number; length: number }>;
  };
  types: string[];
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  name: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
}

export interface GooglePlacesAutocompleteProps {
  apiKey: string;
  placeholder?: string;
  onPlaceSelected: (details: PlaceDetails) => void;
  onClear?: () => void;
  /** ISO 3166-1 alpha-2 country code to restrict results, e.g. "in" */
  country?: string;
  /** Debounce delay in ms (default: 350) */
  debounceMs?: number;
  /** Fetch full place details on selection (default: true) */
  fetchDetails?: boolean;
  /** Initial value */
  initialValue?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const AUTOCOMPLETE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

function getPlaceIcon(types: string[]): string {
  if (types.includes("establishment") || types.includes("store"))
    return "storefront-outline";
  if (types.includes("locality") || types.includes("political"))
    return "location-outline";
  if (types.includes("route") || types.includes("street_address"))
    return "navigate-outline";
  if (types.includes("transit_station") || types.includes("bus_station"))
    return "bus-outline";
  if (types.includes("airport")) return "airplane-outline";
  if (types.includes("hospital") || types.includes("health"))
    return "medkit-outline";
  return "pin-outline";
}

function highlightText(
  text: string,
  matches?: Array<{ offset: number; length: number }>,
): { part: string; highlight: boolean }[] {
  if (!matches || matches.length === 0)
    return [{ part: text, highlight: false }];
  const parts: { part: string; highlight: boolean }[] = [];
  let cursor = 0;
  for (const { offset, length } of matches) {
    if (offset > cursor)
      parts.push({ part: text.slice(cursor, offset), highlight: false });
    parts.push({ part: text.slice(offset, offset + length), highlight: true });
    cursor = offset + length;
  }
  if (cursor < text.length)
    parts.push({ part: text.slice(cursor), highlight: false });
  return parts;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function GooglePlacesAutocomplete({
  apiKey,
  placeholder = "Search location...",
  onPlaceSelected,
  onClear,
  country = "in",
  debounceMs = 350,
  fetchDetails = true,
  initialValue = "",
}: GooglePlacesAutocompleteProps) {
  const [query, setQuery] = useState(initialValue);
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sessionToken] = useState(() => Math.random().toString(36).slice(2));

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<TextInput>(null);
  const listAnim = useRef(new Animated.Value(0)).current;

  // animate list in/out
  useEffect(() => {
    Animated.spring(listAnim, {
      toValue: predictions.length > 0 && focused ? 1 : 0,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, [predictions.length, focused]);

  const fetchPredictions = useCallback(
    async (text: string) => {
      if (text.length < 2) {
        setPredictions([]);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({
          input: text,
          key: apiKey,
          sessiontoken: sessionToken,
          components: `country:${country}`,
          language: "en",
        });
        const res = await fetch(`${AUTOCOMPLETE_URL}?${params}`);
        const json = await res.json();
        if (json.status === "OK") {
          setPredictions(json.predictions ?? []);
        } else {
          setPredictions([]);
        }
      } catch {
        setPredictions([]);
      } finally {
        setLoading(false);
      }
    },
    [apiKey, country, sessionToken],
  );

  const handleChangeText = (text: string) => {
    setQuery(text);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!text) {
      setPredictions([]);
      onClear?.();
      return;
    }
    debounceTimer.current = setTimeout(
      () => fetchPredictions(text),
      debounceMs,
    );
  };

  const handleSelectPrediction = async (prediction: PlacePrediction) => {
    setQuery(prediction.description);
    setPredictions([]);
    Keyboard.dismiss();

    if (!fetchDetails) return;

    setDetailLoading(true);
    try {
      const params = new URLSearchParams({
        place_id: prediction.place_id,
        key: apiKey,
        sessiontoken: sessionToken,
        fields: "place_id,name,formatted_address,geometry,address_components",
      });
      const res = await fetch(`${DETAILS_URL}?${params}`);
      const json = await res.json();
      if (json.status === "OK" && json.result) {
        onPlaceSelected(json.result as PlaceDetails);
      }
    } catch {
      // silently fail — caller can handle
    } finally {
      setDetailLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setPredictions([]);
    onClear?.();
    inputRef.current?.focus();
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  const renderPrediction = ({
    item,
    index,
  }: {
    item: PlacePrediction;
    index: number;
  }) => {
    const iconName = getPlaceIcon(item.types) as any;
    const mainParts = highlightText(
      item.structured_formatting.main_text,
      item.structured_formatting.main_text_matched_substrings,
    );

    return (
      <TouchableOpacity
        style={[styles.predictionRow, index === 0 && styles.predictionRowFirst]}
        onPress={() => handleSelectPrediction(item)}
        activeOpacity={0.65}
      >
        {/* Icon column */}
        <View style={styles.predictionIcon}>
          <Ionicons name={iconName} size={18} color="#6B7280" />
        </View>

        {/* Text column */}
        <View style={styles.predictionText}>
          <Text style={styles.predictionMain} numberOfLines={1}>
            {mainParts.map((p, i) => (
              <Text
                key={i}
                style={p.highlight ? styles.highlighted : undefined}
              >
                {p.part}
              </Text>
            ))}
          </Text>
          {!!item.structured_formatting.secondary_text && (
            <Text style={styles.predictionSub} numberOfLines={1}>
              {item.structured_formatting.secondary_text}
            </Text>
          )}
        </View>

        <Ionicons name="arrow-back-outline" size={14} color="#D1D5DB" />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* ── Search bar ── */}
      <View
        style={[styles.inputWrapper, focused && styles.inputWrapperFocused]}
      >
        {/* Leading icon */}
        <View style={styles.leadingIcon}>
          {loading ? (
            <ActivityIndicator size="small" color="#6366F1" />
          ) : (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={20}
              color={focused ? "#6366F1" : "#9CA3AF"}
            />
          )}
        </View>

        {/* Text input */}
        <TextInput
          ref={inputRef}
          style={styles.input}
          value={query}
          onChangeText={handleChangeText}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            // slight delay so tap on prediction registers
            setTimeout(() => setFocused(false), 150);
          }}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          returnKeyType="search"
          autoCorrect={false}
          autoCapitalize="none"
          clearButtonMode="never" // we handle it ourselves
        />

        {/* Trailing: clear or loading detail */}
        {detailLoading ? (
          <ActivityIndicator
            size="small"
            color="#6366F1"
            style={styles.trailingIcon}
          />
        ) : query.length > 0 ? (
          <TouchableOpacity
            onPress={handleClear}
            style={styles.trailingIcon}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* ── Predictions list ── */}
      {predictions.length > 0 && focused && (
        <Animated.View
          style={[
            styles.listContainer,
            {
              opacity: listAnim,
              transform: [
                {
                  translateY: listAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-6, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={renderPrediction}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={predictions.length > 4}
            style={styles.list}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={
              <View style={styles.poweredBy}>
                <Ionicons name="logo-google" size={10} color="#9CA3AF" />
                <Text style={styles.poweredByText}> powered by Google</Text>
              </View>
            }
          />
        </Animated.View>
      )}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const RADIUS = 14;
const SHADOW = Platform.select({
  ios: {
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  android: { elevation: 4 },
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
    zIndex: 999,
  },

  // ── Input ──────────────────────────────────────────────────────────────────
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS,
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    ...SHADOW,
  },
  inputWrapperFocused: {
    borderColor: "#6366F1",
    ...(Platform.OS === "ios"
      ? { shadowOpacity: 0.22, shadowColor: "#6366F1" }
      : { elevation: 6 }),
  },
  leadingIcon: {
    width: 28,
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginHorizontal: 8,
    padding: 0, // remove default Android padding
  },
  trailingIcon: {
    padding: 2,
  },

  // ── Results list ───────────────────────────────────────────────────────────
  listContainer: {
    marginTop: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: RADIUS,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    overflow: "hidden",
    ...SHADOW,
  },
  list: {
    maxHeight: 280,
  },
  predictionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    gap: 10,
  },
  predictionRowFirst: {
    // no special style, but available for customisation
  },
  predictionIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  predictionText: {
    flex: 1,
    gap: 2,
  },
  predictionMain: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  predictionSub: {
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "400",
  },
  highlighted: {
    color: "#6366F1",
    fontWeight: "700",
  },
  separator: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 14,
  },
  poweredBy: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  poweredByText: {
    fontSize: 10,
    color: "#9CA3AF",
  },
});
