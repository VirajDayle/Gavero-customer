import * as Location from "expo-location";

export interface ReverseGeocodeAddress {
  city: string | null;
  countryCode: string | null;
  formattedAddress: string;
  pinCode: string | null;
  state: string | null;
  line1: string | null; // street / area / sublocality from geocoder
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeAddress | null> {
  const result = await Location.reverseGeocodeAsync({
    latitude,
    longitude,
  });

  if (!result.length) {
    return null;
  }

  const place = result[0];

  const formattedAddress = [
    place.name,
    place.street,
    place.city,
    place.region,
    place.postalCode,
    place.country,
  ]
    .filter(Boolean)
    .join(", ");

  return {
    city: place.city ?? null,
    formattedAddress: place.formattedAddress || formattedAddress,
    countryCode: place.isoCountryCode ?? null,
    pinCode: place.postalCode ?? null,
    state: place.region ?? null,
    line1: place.street ?? null,
  };
}
