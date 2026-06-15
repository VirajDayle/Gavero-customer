import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import { Region } from "react-native-maps";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PlacePrediction {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings?: Array<{ offset: number; length: number }>;
  };
  distance_meters: number;
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

export interface PlaceResultProps {
  query: string;
  apiKey: string;
  focused: boolean;
  location: Region;
  onPlaceSelected?: (details: PlaceDetails) => void;
  onClear?: () => void;
  country?: string;
  debounceMs?: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AUTOCOMPLETE_URL =
  "https://maps.googleapis.com/maps/api/place/autocomplete/json";
const DETAILS_URL = "https://maps.googleapis.com/maps/api/place/details/json";

const DETAILS_FIELDS =
  "place_id,formatted_address,name,geometry,address_components";

// ─── Component ────────────────────────────────────────────────────────────────

const getDistanceIcon = (distanceKm: string | null): string => {
  // no distance available
  if (distanceKm === null) {
    return "location-outline";
  }

  const distance = Number(distanceKm);

  // nearby
  if (distance < 10) {
    return "navigate-outline";
  }

  // far away
  return "map-outline";
};

const PlaceResult = ({
  query,
  focused,
  apiKey,
  onPlaceSelected,
  location,
  onClear,
  country = "in",
  debounceMs = 350,
}: PlaceResultProps) => {
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isFetchingPredictions, setIsFetchingPredictions] = useState(false);
  const [isFetchingDetails, setIsFetchingDetails] = useState(false);

  // Session token is refreshed after each place selection (correct billing unit)
  const sessionTokenRef = useRef(generateSessionToken());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const listAnim = useRef(new Animated.Value(0)).current;

  const shouldShow = predictions.length > 0 && focused;

  // ── Animation ──────────────────────────────────────────────────────────────

  useEffect(() => {
    Animated.spring(listAnim, {
      toValue: shouldShow ? 1 : 0,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, [shouldShow]);

  // ── Predictions ────────────────────────────────────────────────────────────

  const fetchPredictions = useCallback(
    async (text: string) => {
      if (text.length < 2) {
        setPredictions([]);
        return;
      }

      setIsFetchingPredictions(true);
      try {
        const params = new URLSearchParams({
          input: text,
          key: apiKey,
          sessiontoken: sessionTokenRef.current,
          components: `country:${country}`,
          language: "en",
          location: `${location.latitude},${location.longitude}`,
          radius: "6000",
          origin: `${location.latitude},${location.longitude}`,
        });

        const res = await fetch(`${AUTOCOMPLETE_URL}?${params}`);
        const json = await res.json();

        if (json.status === "OK") {
          setPredictions(json.predictions ?? []);
        } else if (json.status === "ZERO_RESULTS") {
          setPredictions([]);
        } else {
          // Log unexpected statuses (OVER_QUERY_LIMIT, REQUEST_DENIED, etc.)
          setPredictions([]);
        }
      } catch (err) {
        console.error("[PlaceResult] fetchPredictions error:", err);
        setPredictions([]);
      } finally {
        setIsFetchingPredictions(false);
      }
    },
    [apiKey, country, location],
  );

  // Re-fetch whenever query changes (debounced)
  useEffect(() => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!query) {
      setPredictions([]);
      onClear?.();
      return;
    }

    debounceTimer.current = setTimeout(
      () => fetchPredictions(query),
      debounceMs,
    );

    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, [query, fetchPredictions, debounceMs]);

  // ── Details fetch on selection ─────────────────────────────────────────────

  const handleSelectPrediction = useCallback(
    async (prediction: PlacePrediction) => {
      if (!onPlaceSelected) return;

      setIsFetchingDetails(true);
      try {
        const params = new URLSearchParams({
          place_id: prediction.place_id,
          key: apiKey,
          sessiontoken: sessionTokenRef.current,
          fields: DETAILS_FIELDS,
          language: "en",
        });

        const res = await fetch(`${DETAILS_URL}?${params}`);
        const json = await res.json();

        if (json.status === "OK" && json.result) {
          // Refresh session token — this billing session is now complete
          sessionTokenRef.current = generateSessionToken();
          setPredictions([]);
          onPlaceSelected(json.result as PlaceDetails);
        } else {
          console.warn("[PlaceResult] Details status:", json.status);
        }
      } catch (err) {
        console.error("[PlaceResult] fetchDetails error:", err);
      } finally {
        setIsFetchingDetails(false);
      }
    },
    [apiKey, onPlaceSelected],
  );

  // ── Render item ────────────────────────────────────────────────────────────

  const renderPrediction = ({
    item,
  }: {
    item: PlacePrediction;
    index: number;
  }) => {
    const distanceKm =
      item.distance_meters != null && !isNaN(item.distance_meters)
        ? (item.distance_meters / 1000).toFixed(1)
        : null;

    const icon = getDistanceIcon(distanceKm) as any;

    return (
      <Pressable
        onPress={() => handleSelectPrediction(item)}
        disabled={isFetchingDetails}
        className="bg-white px-2 py-3 rounded-xl mx-3 active:opacity-60"
      >
        <View className="flex-row items-center gap-4 ml-2 flex-1">
          <View>
            <Ionicons name={icon} size={18} />
          </View>
          <View className="flex-1">
            <Text
              className="text-[14px] text-gray-900 font-medium"
              numberOfLines={1}
            >
              {item.structured_formatting.main_text}
            </Text>
            {!!item.structured_formatting.secondary_text && (
              <Text
                className="text-[12px] text-gray-500 mt-0.5"
                numberOfLines={1}
              >
                {item.structured_formatting.secondary_text}
              </Text>
            )}
            {distanceKm && (
              <Text className="text-[10px] text-gray-400 mt-0.5">
                {distanceKm} km away
              </Text>
            )}
          </View>

          {isFetchingDetails && (
            <ActivityIndicator size="small" color="#9CA3AF" />
          )}
        </View>
      </Pressable>
    );
  };

  // ── Empty/loading states ───────────────────────────────────────────────────

  const showList = predictions.length > 0 && focused;
  const showLoader = isFetchingPredictions && focused && query.length >= 2;
  const showEmpty =
    !isFetchingPredictions &&
    focused &&
    query.length >= 2 &&
    predictions.length === 0;

  if (!showList && !showLoader && !showEmpty) return null;

  return (
    <View
      className="bg-[#F8FAFC] max-h-[80%] w-full absolute z-50 rounded-b-4xl py-2"
      style={{
        borderBottomColor: "#E5E7EB",
        borderRightColor: "#E5E7EB",
        borderLeftColor: "#E5E7EB",
        borderBottomWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
      }}
    >
      {showLoader && (
        <View className="py-4 items-center">
          <ActivityIndicator size="small" color="#6B7280" />
        </View>
      )}

      {showEmpty && (
        <View className="py-4 items-center">
          <Text className="text-[13px] text-gray-400">No results found</Text>
        </View>
      )}

      {showList && (
        <Animated.View
          style={{
            opacity: listAnim,
            transform: [
              {
                translateY: listAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-6, 0],
                }),
              },
            ],
          }}
        >
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={renderPrediction}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={predictions.length > 4}
            ItemSeparatorComponent={() => <View className="h-2" />}
            showsVerticalScrollIndicator={false}
          />
        </Animated.View>
      )}
    </View>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateSessionToken(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export default PlaceResult;
