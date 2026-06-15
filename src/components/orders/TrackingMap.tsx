import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from "react-native-maps";

const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY"; // Replace with your actual key

const SHOP_LOCATION = { latitude: 28.62, longitude: 77.22 };
const CUSTOMER_LOCATION = { latitude: 28.6139, longitude: 77.209 };
const RIDER_LOCATION = { latitude: 28.617, longitude: 77.215 };

const TrackingMap = () => {
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    // Fit all markers in view after a small delay to ensure the map has laid out
    const timeout = setTimeout(() => {
      mapRef.current?.fitToCoordinates(
        [SHOP_LOCATION, CUSTOMER_LOCATION, RIDER_LOCATION],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        },
      );
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <View className="h-full w-full flex-1 overflow-hidden rounded-2xl">
      <MapView
        ref={mapRef}
        provider={Platform.OS === "android" ? PROVIDER_GOOGLE : undefined}
        style={StyleSheet.absoluteFillObject}
        initialRegion={{
          ...RIDER_LOCATION,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        pitchEnabled={false}
        scrollEnabled={false} // Disable interaction for a cleaner card view
        zoomEnabled={false}
      >
        {/* Mock Route Line from Shop to Customer, with the rider as a waypoint */}
        <Polyline
          coordinates={[SHOP_LOCATION, RIDER_LOCATION, CUSTOMER_LOCATION]}
          strokeWidth={4}
          strokeColor="#3b82f6"
          lineJoin="round"
          lineCap="round"
        />

        {/* Shop Marker */}
        <Marker coordinate={SHOP_LOCATION} anchor={{ x: 0.5, y: 0.5 }}>
          <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-sm">
            <Ionicons name="storefront" size={20} color="#4b5563" />
          </View>
        </Marker>

        {/* Customer Marker */}
        <Marker coordinate={CUSTOMER_LOCATION} anchor={{ x: 0.5, y: 0.5 }}>
          <View className="h-10 w-10 items-center justify-center rounded-full border-2 border-gray-200 bg-white shadow-sm">
            <Ionicons name="home" size={20} color="#ea580c" />
          </View>
        </Marker>

        {/* Live Rider Marker */}
        <Marker coordinate={RIDER_LOCATION} anchor={{ x: 0.5, y: 0.5 }} zIndex={2}>
          <View className="h-12 w-12 items-center justify-center rounded-full border-2 border-blue-500 bg-white shadow-md">
            <View className="h-10 w-10 items-center justify-center rounded-full bg-blue-50">
              <Ionicons name="bicycle" size={24} color="#3b82f6" />
            </View>
          </View>
        </Marker>
      </MapView>
    </View>
  );
};

export default TrackingMap;
