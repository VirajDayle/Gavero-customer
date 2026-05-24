import AddressConfirm from "@/src/components/location/AddressConfirm";
import MapPin from "@/src/components/location/MapPin";
import MyLocationFAB from "@/src/components/location/MyLocationFAB";
import PlaceResult, {
  PlaceDetails,
} from "@/src/components/location/PlaceResult";
import Header from "@/src/components/ui/Header";
import SearchBar from "@/src/components/ui/SearchBar";
import { MAP_STYLE } from "@/src/constants/mapStyle";
import { useAddressStore } from "@/src/store/addressStore";
import { getCurrentRegion } from "@/src/utils/location/currentRegion";
import {
  reverseGeocode,
  ReverseGeocodeAddress,
} from "@/src/utils/location/reverseGeocode";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Animated, Pressable, StyleSheet, TextInput, View } from "react-native";
import MapView, { PROVIDER_GOOGLE, Region } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─── Guard ────────────────────────────────────────────────────────────────────

const googleApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_API;

if (!googleApiKey) {
  throw new Error(
    "[MapAddressSelect] EXPO_PUBLIC_GOOGLE_MAP_API is not set. " +
      "Add it to your .env file.",
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function MapAddressSelect() {
  const params = useLocalSearchParams<{
    latitude: string;
    longitude: string;
    latitudeDelta: string;
    longitudeDelta: string;
  }>();

  const initialRegion: Region = {
    latitude: Number(params.latitude),
    longitude: Number(params.longitude),
    latitudeDelta: Number(params.latitudeDelta),
    longitudeDelta: Number(params.longitudeDelta),
  };

  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const searchInputRef = useRef<TextInput>(null);

  // ── Map drag state ─────────────────────────────────────────────────────────

  const [currentRegion, setCurrentRegion] = useState<Region>(initialRegion);
  const [isDragging, setIsDragging] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [liveAddress, setLiveAddress] = useState<ReverseGeocodeAddress | null>(
    null,
  );
  const hasStartedDragging = useRef(false);

  const pinAnim = useRef(new Animated.Value(0)).current;
  const pinScale = useRef(new Animated.Value(1)).current;

  // ── Search state ───────────────────────────────────────────────────────────

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const setDraftGeocode = useAddressStore((s) => s.setDraftGeocode);

  // ── Map drag handlers ──────────────────────────────────────────────────────

  const onRegionChangeStart = useCallback(() => {
    hasStartedDragging.current = true;
    setIsDragging(true);
    setLiveAddress(null);

    Animated.parallel([
      Animated.spring(pinAnim, {
        toValue: -3,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
      Animated.spring(pinScale, {
        toValue: 1.1,
        useNativeDriver: true,
        tension: 120,
        friction: 8,
      }),
    ]).start();
  }, [pinAnim, pinScale]);

  const onRegionChangeComplete = useCallback(
    async (region: Region) => {
      setCurrentRegion(region);
      setIsDragging(false);

      Animated.parallel([
        Animated.spring(pinAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 180,
          friction: 14,
        }),
        Animated.spring(pinScale, {
          toValue: 1,
          useNativeDriver: true,
          tension: 180,
          friction: 14,
        }),
      ]).start();

      setIsGeocoding(true);
      try {
        const result = await reverseGeocode(region.latitude, region.longitude);
        setLiveAddress(result);
      } finally {
        setIsGeocoding(false);
      }
    },
    [pinAnim, pinScale],
  );

  // ── My location ────────────────────────────────────────────────────────────

  const handleMyLocation = useCallback(async () => {
    dismissSearchBar();
    const region = await getCurrentRegion();
    if (!region) return;
    mapRef.current?.animateToRegion(region, 400);
  }, []);

  // ── Place selected from autocomplete ──────────────────────────────────────

  const dismissSearchBar = () => {
    setSearchQuery("");
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  };

  const handlePlaceSelected = useCallback((details: PlaceDetails) => {
    const { lat, lng } = details.geometry.location;

    const targetRegion: Region = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    };

    // Fly the map to the selected place
    mapRef.current?.animateToRegion(targetRegion, 500);
    setCurrentRegion(targetRegion);

    // Dismiss search UI
    dismissSearchBar();
  }, []);

  // ── Confirm ────────────────────────────────────────────────────────────────

  const handleConfirm = useCallback(() => {
    dismissSearchBar();
    if (!liveAddress || !currentRegion) return;
    setDraftGeocode(liveAddress, currentRegion);
    router.push("/address-details");
  }, [liveAddress, currentRegion, setDraftGeocode]);

  // ── Dismiss search on map tap ──────────────────────────────────────────────

  const handleMapPress = useCallback(() => {
    if (isSearchFocused) {
      setIsSearchFocused(false);
      searchInputRef.current?.blur();
    }
  }, [isSearchFocused]);

  // ── Render ─────────────────────────────────────────────────────────────────

  const showResults = isSearchFocused && searchQuery.length > 0;

  return (
    <View style={styles.root}>
      {/* ── Header + SearchBar (above map) ── */}
      <View style={{ paddingTop: insets.top, backgroundColor: "#fff" }}>
        <Header title="Set delivery location" back />
        <SearchBar
          className="mx-3 my-1"
          placeholderText="Search for area, street name…"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => {
            // Small delay so a prediction tap registers before blur fires
            setTimeout(() => setIsSearchFocused(false), 150);
          }}
          onChangeText={setSearchQuery}
          value={searchQuery}
          inputRef={searchInputRef}
          onClear={() => {
            setSearchQuery("");
            setIsSearchFocused(false);
            searchInputRef.current?.blur();
          }}
        />
      </View>

      {/* ── Map layer ── */}
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1, marginBottom: insets.bottom }}
          provider={PROVIDER_GOOGLE}
          initialRegion={initialRegion}
          onRegionChangeStart={onRegionChangeStart}
          onRegionChangeComplete={onRegionChangeComplete}
          onPress={handleMapPress}
          showsMyLocationButton={false}
          showsUserLocation
          customMapStyle={MAP_STYLE}
          rotateEnabled={false}
          showsCompass={false}
        />

        {/* ── Autocomplete dropdown (overlays map) ── */}
        {showResults && (
          <>
            {/* Full-screen backdrop — catches taps anywhere on the map */}
            <Pressable
              style={StyleSheet.absoluteFillObject}
              onPress={() => {
                dismissSearchBar();
                searchInputRef.current?.blur();
              }}
            />
            <PlaceResult
              apiKey={googleApiKey!}
              location={initialRegion}
              focused={isSearchFocused}
              query={searchQuery}
              onPlaceSelected={handlePlaceSelected}
              onClear={() => setSearchQuery("")}
            />
          </>
        )}

        {/* ── Centre pin ── */}
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              marginBottom: insets.bottom,
              transform: [{ translateY: -14 }],
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <MapPin hasStartedDragging={hasStartedDragging.current} />
        </View>

        {/* ── My location FAB ── */}
        <View
          style={{
            position: "absolute",
            bottom: insets.bottom + 145,
            width: "100%",
            alignItems: "center",
          }}
        >
          <MyLocationFAB isDragging={isDragging} hasStartedDragging={hasStartedDragging.current} onPress={handleMyLocation} />
        </View>

        {/* ── Address confirm bar ── */}
        <View
          className="mx-5"
          style={{
            position: "absolute",
            bottom: insets.bottom + 35,
            width: "100%",
          }}
        >
          <AddressConfirm
            isDragging={isDragging}
            isGeocoding={isGeocoding}
            formattedAddress={liveAddress?.formattedAddress}
            onConfirm={handleConfirm}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
