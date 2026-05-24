import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

const googlePlacesApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAP_API;

interface GoogleInputProps {
  icon?: string;
  initialLocation?: string;
  containerStyle?: string;
  textInputBackgroundColor?: string;
  handlePress: (details: { latitude: number; longitude: number; address: string }) => void;
}

const GoogleTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
  currentLocation,
}: GoogleInputProps & {
  currentLocation?: { latitude: number; longitude: number };
}) => {
  console.log("currentLocation", currentLocation);
  return (
    <View className={`w-full absolute top-4 z-50 shadow-sm ${containerStyle}`}>
      <GooglePlacesAutocomplete
        fetchDetails={true}
        placeholder="Search"
        debounce={200}
        styles={{
          textInputContainer: {
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            marginHorizontal: 20,
            position: "relative",
            shadowColor: "#d4d4d4",
          },
          textInput: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            fontSize: 16,
            fontWeight: "600",
            marginTop: 5,
            width: "100%",
            borderRadius: 200,
          },
          listView: {
            backgroundColor: textInputBackgroundColor
              ? textInputBackgroundColor
              : "white",
            position: "absolute",
            top: 55,
            left: 20,
            right: 20,
            borderRadius: 10,
            shadowColor: "#d4d4d4",
            zIndex: 99,
            elevation: 5,
          },
        }}
        onPress={(data, details = null) => {
          handlePress({
            latitude: details?.geometry.location.lat!,
            longitude: details?.geometry.location.lng!,
            address: data.description,
          });
        }}
        query={{
          key: googlePlacesApiKey,
          language: "en",
          ...(currentLocation && {
            location: `${currentLocation.latitude},${currentLocation.longitude}`,
            radius: 50000, // 50km radius
          }),
        }}
        renderLeftButton={() => (
          <View className="justify-center items-center w-6 h-6">
            <Ionicons name="search" />
          </View>
        )}
        textInputProps={{
          placeholderTextColor: "gray",
          placeholder: initialLocation ?? "Where do you want to go?",
        }}
      />
    </View>
  );
};

export default GoogleTextInput;
