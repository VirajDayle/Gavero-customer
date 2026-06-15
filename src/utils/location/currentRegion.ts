import * as Location from "expo-location";
import { Region } from "react-native-maps";

export async function getCurrentRegion(): Promise<Region | null> {
  const { status } = await Location.getForegroundPermissionsAsync();

  const finalStatus =
    status === "granted"
      ? status
      : (await Location.requestForegroundPermissionsAsync()).status;

  if (finalStatus !== "granted") {
    console.log("[MapAddressSelect] Location permission denied");
    return null;
  }

  const location = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.High,
  });

  return {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };
}
