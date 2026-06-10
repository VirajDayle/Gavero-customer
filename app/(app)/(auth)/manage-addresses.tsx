import Header from "@/src/components/ui/Header";
import { LABEL_ICONS } from "@/src/constants/location";
import { SELECT_ADDRESS } from "@/src/constants/selectAddress";
import { getCurrentRegion } from "@/src/utils/location/currentRegion";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useRouter } from "expo-router";
import { styled } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

// ─── Types ────────────────────────────────────────────────────────────────────

interface Address {
  id: string;
  formattatedAddress: string;
  label: string;
  receiverName: string;
  receiverPhone: string;
}

interface AddressData {
  current: Address | null;
  saved: Address[];
}

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const getIcon = (label: string): keyof typeof Ionicons.glyphMap =>
  LABEL_ICONS[label.toLowerCase()] ?? "compass-outline";

// ─── Sub Components ───────────────────────────────────────────────────────────

const SectionLabel = ({ title }: { title: string }) => (
  <View className="px-4 pt-3.5 pb-1.5">
    <Text className="text-sm font-medium tracking-[0.1px] text-gray-400 uppercase">
      {title}
    </Text>
  </View>
);

interface AddressRowProps {
  address: Address;
  isActive?: boolean;
  onSelect: (address: Address) => void;
  onDelete?: (id: string) => void;
}

const AddressRow = ({
  address,
  isActive = false,
  onSelect,
  onDelete,
}: AddressRowProps) => (
  <Pressable
    onPress={() => onSelect(address)}
    style={({ pressed }) => [
      isActive && styles.addressRowActive,
      pressed && styles.addressRowPressed,
    ]}
    className="flex-row gap-3 m-2 bg-white px-2 py-3 rounded-xl justify-between"
  >
    <View className="flex-row items-center gap-4 ml-2 flex-1">
      <Ionicons name={getIcon(address.label)} size={20} />
      <View className="flex-1">
        <View className="flex-row gap-1.5">
          <Text className="text-[15px] font-medium" numberOfLines={1}>
            {address.label.charAt(0).toUpperCase() + address.label.slice(1)}
          </Text>
        </View>
        <Text className="text-sm text-gray-500 ">
          {address.formattatedAddress}
        </Text>
        <Text className="text-xs text-gray-400" numberOfLines={1}>
          {address.receiverName} · {address.receiverPhone}
        </Text>
      </View>
    </View>

    {/* Right action */}
    <View className="justify-center">
      {!isActive && onDelete && (
        <Pressable
          onPress={() => onDelete(address.id)}
          hitSlop={8}
          style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
        >
          <Ionicons name="trash-outline" size={20} />
        </Pressable>
      )}
    </View>
  </Pressable>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const ManageAddresses = () => {
  const router = useRouter();
  const [addresses, setAddresses] = useState<AddressData>(SELECT_ADDRESS);
  const [isLoading, setIsLoading] = useState(false);

  const hasSaved = addresses.saved.length > 0;

  const handleNewAddress = async () => {
    setIsLoading(true);

    const currentRegion = await getCurrentRegion();

    if (!currentRegion) {
      setIsLoading(false);
      return;
    }

    setIsLoading(false);

    router.push({
      pathname: "/map-address",
      params: {
        latitude: currentRegion.latitude.toString(),
        longitude: currentRegion.longitude.toString(),
        latitudeDelta: currentRegion.latitudeDelta.toString(),
        longitudeDelta: currentRegion.longitudeDelta.toString(),
      },
    });
  };

  const handleSelectAddress = (address: Address) => {
    // For now, let's just make it current
    const isAlreadyCurrent = addresses.current?.id === address.id;
    if (isAlreadyCurrent) return;

    setAddresses(prev => {
        const newSaved = [...prev.saved, ...(prev.current ? [prev.current] : [])].filter(a => a.id !== address.id);
        return {
            current: address,
            saved: newSaved
        };
    });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(prev => ({
        ...prev,
        saved: prev.saved.filter(a => a.id !== id)
    }));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]">
      <Header title="Manage Addresses" back border />
      
      {/* Content wrapper mimicking the inner Modal view style of AddressDropdown */}
      <View className="flex-1 bg-[#F8FAFC]">
        {/* Add Address */}
        <Pressable
          onPress={() => {
            handleNewAddress();
          }}
          className="mx-2 mt-2 flex-row items-center justify-between rounded-xl bg-white px-2 py-3.5 active:opacity-70"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons
              name="add-circle-outline"
              size={24}
              color="#16A34A"
            />

            <Text className="text-[16px] font-semibold tracking-wide text-[#16A34A]">
              Add new address
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
        </Pressable>

        <ScrollView
          bounces={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        >
          {isLoading ? (
            <View className="items-center z-10 m-10">
              <ActivityIndicator size={30} />
            </View>
          ) : (
            <>
              {addresses.current && (
                <>
                  <SectionLabel title="Active Address" />

                  <AddressRow
                    address={addresses.current}
                    isActive
                    onSelect={handleSelectAddress}
                  />
                </>
              )}

              {hasSaved && (
                <>
                  <SectionLabel title="Saved Addresses" />

                  {addresses.saved.map((address) => (
                    <AddressRow
                      key={address.id}
                      address={address}
                      onSelect={handleSelectAddress}
                      onDelete={handleDeleteAddress}
                    />
                  ))}
                </>
              )}

              {!addresses.current && !hasSaved && (
                <View style={styles.emptyState}>
                  <Ionicons
                    name="location-outline"
                    size={32}
                    color="#D1D5DB"
                  />

                  <Text style={styles.emptyText}>
                    No addresses saved yet
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  addressRowActive: {
    backgroundColor: "#FFFBEB",
  },
  addressRowPressed: {
    backgroundColor: "#F9FAFB",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 32,
    gap: 8,
  },
  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
  },
});

export default ManageAddresses;
