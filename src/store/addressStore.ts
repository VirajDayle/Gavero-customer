// src/store/addressStore.ts
import type { Region } from "react-native-maps";
import { create } from "zustand";
import type { ReverseGeocodeAddress } from "../utils/location/reverseGeocode";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AddressLabel = "home" | "work" | "office" | "other";

export interface SavedAddress {
  id: string;
  formattedAddress: string;
  label: AddressLabel;
  customLabel: string | null;
  receiverName: string | null;
  receiverPhone: string | null;
}

export interface DraftAddress {
  geocoded: ReverseGeocodeAddress;
  coordinates: Region;
  line1: string;
  label: AddressLabel;
  customLabel: string | null;
  receiverName: string | null;
  receiverPhone: string | null;
}

// ─── Store ────────────────────────────────────────────────────────────────────

interface AddressStore {
  // ── Draft (add address flow: page 1 → page 3) ──────────────────────────────
  draft: DraftAddress | null;
  setDraftGeocode: (
    geocoded: ReverseGeocodeAddress,
    coordinates: Region,
  ) => void;
  setDraftLine1: (line1: string) => void;
  setDraftLabel: (label: AddressLabel) => void;
  setDraftCustomLabel: (customLabel: string | null) => void;
  setDraftReceiver: (name: string | null, phone: string | null) => void;
  clearDraft: () => void;

  // ── Saved addresses (shown in dropdown list) ───────────────────────────────
  savedAddresses: SavedAddress[];
  setSavedAddresses: (addresses: SavedAddress[]) => void;
  addSavedAddress: (address: SavedAddress) => void;
  removeSavedAddress: (id: string) => void;

  // ── Active address (shown on home screen header) ───────────────────────────
  activeAddress: SavedAddress | null;
  setActiveAddress: (address: SavedAddress) => void;
}

export const useAddressStore = create<AddressStore>((set) => ({
  // ── Draft ──────────────────────────────────────────────────────────────────
  draft: null,

  setDraftGeocode: (geocoded, coordinates) =>
    set((state) => ({
      draft: {
        geocoded,
        coordinates,
        line1: state.draft?.line1 ?? "",
        label: state.draft?.label ?? "home",
        customLabel: state.draft?.customLabel ?? null,
        receiverName: state.draft?.receiverName ?? null,
        receiverPhone: state.draft?.receiverPhone ?? null,
      },
    })),

  setDraftLine1: (line1) =>
    set((state) => ({
      draft: state.draft ? { ...state.draft, line1 } : null,
    })),

  setDraftLabel: (label) =>
    set((state) => ({
      draft: state.draft
        ? {
          ...state.draft,
          label,
          // auto-clear customLabel when switching away from 'other'
          customLabel: label !== "other" ? null : state.draft.customLabel,
        }
        : null,
    })),

  setDraftCustomLabel: (customLabel) =>
    set((state) => ({
      draft: state.draft ? { ...state.draft, customLabel } : null,
    })),

  setDraftReceiver: (receiverName, receiverPhone) =>
    set((state) => ({
      draft: state.draft
        ? { ...state.draft, receiverName, receiverPhone }
        : null,
    })),

  clearDraft: () => set({ draft: null }),

  // ── Saved addresses ────────────────────────────────────────────────────────
  savedAddresses: [],

  // Called once on dropdown open — replaces entire list with server response
  setSavedAddresses: (addresses) => set({ savedAddresses: addresses }),

  // Called after successful POST /addresses — appends without re-fetching
  addSavedAddress: (address) =>
    set((state) => ({
      savedAddresses: [...state.savedAddresses, address],
    })),

  // Called after successful DELETE /addresses/:id
  removeSavedAddress: (id) =>
    set((state) => ({
      savedAddresses: state.savedAddresses.filter((a) => a.id !== id),
      // if user deletes the active address, clear it too
      activeAddress:
        state.activeAddress?.id === id ? null : state.activeAddress,
    })),

  // ── Active address ─────────────────────────────────────────────────────────
  activeAddress: null,
  setActiveAddress: (address) => set({ activeAddress: address }),
}));
