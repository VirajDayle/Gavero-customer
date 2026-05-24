// ─── Subtle custom map style (desaturated, clean) ─────────────────────────────
export const MAP_STYLE = [
  // Base land color
  {
    elementType: "geometry",
    stylers: [{ color: "#F8FAFC" }],
  },

  // Labels
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#374151" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ color: "#FFFFFF" }],
  },

  // Remove unnecessary icons
  {
    elementType: "labels.icon",
    stylers: [{ visibility: "off" }],
  },

  // Roads
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#FFFFFF" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#E5E7EB" }],
  },

  // Highway
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#FFE7C2" }],
  },

  // Buildings / urban blocks
  {
    featureType: "landscape.man_made",
    elementType: "geometry",
    stylers: [{ color: "#F1F5F9" }],
  },

  // Business areas
  {
    featureType: "poi.business",
    elementType: "geometry",
    stylers: [{ color: "#E2E8F0" }],
  },

  // Parks
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#DCFCE7" }],
  },

  // Water
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#BFDBFE" }],
  },

  // Transit minimal
  {
    featureType: "transit",
    stylers: [{ visibility: "off" }],
  },

  // Local road labels
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6B7280" }],
  },
];
