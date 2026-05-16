import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

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

interface AddressDropdownProps {
  visible: boolean;
  dropdownTop: number;
  addresses: AddressData;
  onClose: () => void;
  onSelect: (address: Address) => void;
  onDelete?: (id: string) => void;
}

// ─── Icon Map ─────────────────────────────────────────────────────────────────

const LABEL_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home-outline",
  work: "briefcase-outline",
  office: "business-outline",
  hotel: "bed-outline",
};

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

const AddressDropdown = ({
  visible,
  dropdownTop,
  addresses,
  onClose,
  onSelect,
  onDelete,
}: AddressDropdownProps) => {
  const hasSaved = addresses.saved.length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable className="flex-1" onPress={onClose}>
        {/* Shadow Wrapper */}
        <View
          className="absolute left-4 right-4 h-150"
          style={{
            top: dropdownTop,

            // Android
            elevation: 7,

            // iOS
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 6,
            },
            shadowOpacity: 0.12,
            shadowRadius: 12,
          }}
        >
          {/* Prevent closing when pressing inside */}
          <Pressable className="flex-1" onPress={(e) => e.stopPropagation()}>
            {/* Actual Sheet */}
            <View
              style={{ elevation: 7 }}
              className="flex-1 bg-[#F8FAFC] rounded-2xl border border-gray-100 overflow-hidden"
            >
              {/* Header */}
              <View className="flex-row items-center justify-between border-b border-gray-50 px-4 pt-1 pb-2 ">
                <Text className="sheet-heading">Your Addresses</Text>

                <TouchableOpacity
                  onPress={onClose}
                  activeOpacity={0.7}
                  hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  className="ml-3 h-8 w-8 items-center justify-center rounded-full bg-gray-100"
                  accessibilityLabel="Close"
                  accessibilityRole="button"
                >
                  <Ionicons name="close" size={16} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {/* Add Address */}
              <Pressable
                onPress={() => {
                  onClose();
                  router.push("/(app)/selectAddress");
                }}
                className="mx-2 flex-row items-center justify-between rounded-xl bg-white px-2 py-3.5 active:opacity-70"
              >
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name="add-circle-outline"
                    size={24}
                    color="#16A34A"
                  />

                  <Text className="text-lg font-semibold tracking-wide text-[#16A34A]">
                    Add new address
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color="#6B7280" />
              </Pressable>

              {/* Content */}
              <ScrollView
                bounces={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingBottom: 20,
                }}
              >
                {/* Active Address */}
                {addresses.current && (
                  <>
                    <SectionLabel title="Active Address" />

                    <AddressRow
                      address={addresses.current}
                      isActive
                      onSelect={onSelect}
                    />
                  </>
                )}

                {/* Saved Addresses */}
                {hasSaved && (
                  <>
                    <SectionLabel title="Saved Addresses" />

                    {addresses.saved.map((address) => (
                      <AddressRow
                        key={address.id}
                        address={address}
                        onSelect={onSelect}
                        onDelete={onDelete}
                      />
                    ))}
                  </>
                )}

                {/* Empty State */}
                {!addresses.current && !hasSaved && (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="location-outline"
                      size={32}
                      color="#D1D5DB"
                    />

                    <Text style={styles.emptyText}>No addresses saved yet</Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },
  sheet: {
    position: "absolute",
    left: 16,
    right: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 12,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  sectionLabel: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  sectionLabelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#374151",
    letterSpacing: 0.1,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  addressRowActive: {
    backgroundColor: "#FFFBEB",
  },
  addressRowPressed: {
    backgroundColor: "#F9FAFB",
  },
  iconBubble: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBubbleActive: {
    backgroundColor: "#FEF3C7",
  },
  addressInfo: {
    flex: 1,
    gap: 1,
  },
  addressLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  addressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111827",
  },
  activePill: {
    backgroundColor: "#FEF3C7",
    borderRadius: 99,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  activePillText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#D97706",
  },
  addressText: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 1,
  },
  receiverText: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 1,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  addIconBubble: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "#FFFBEB",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  addButtonText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#F59E0B",
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
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
});

export default AddressDropdown;
