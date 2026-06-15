import BigGroceryProduct, {
  InfoData,
} from "@/src/components/shops/groceryShop/BigGroceryProduct";
import { FlashList } from "@shopify/flash-list";
import React from "react";
import { Dimensions, Image, Pressable, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedFlashList = Animated.createAnimatedComponent(FlashList);

const { height: FullHeight, width: FullWidth } = Dimensions.get("screen");
const height = FullHeight - 140;
const CARD_WIDTH = FullWidth - 48;
const SPACING = 12;
const SNAP_INTERVAL = CARD_WIDTH + SPACING;

const THUMBNAIL_SPACING = 66;

const groceryImages1 = [
  "https://m.media-amazon.com/images/I/71PWhguzXkL._SL1300_.jpg",
  "https://m.media-amazon.com/images/I/71XS1OFYJ8L._SL1300_.jpg",
  "https://m.media-amazon.com/images/I/61R0tVVTwML._SL1300_.jpg",
  "https://m.media-amazon.com/images/I/91qNdE1G4tL._SL1500_.jpg",
];

const PRODUCT_INFO_MOCK: Record<string, InfoData> = {
  Highlight: {
    type: "text",
    content:
      "Premium quality whole wheat atta. Rich in fiber and essential nutrients. Finely ground for soft and fluffy rotis.",
  },
  Description: {
    type: "text",
    content:
      "Aashirvaad Atta with Multigrains gives you the wholesome goodness of six different grains – wheat, soya, channa, oat, maize and psyllium husk.",
  },
  Ingredients: {
    type: "table",
    headers: ["Ingredient", "Percentage"],
    rows: [
      ["Whole Wheat", "90.9%"],
      ["Defatted Soya Flour", "2.0%"],
      ["Oat Flour", "1.5%"],
      ["Psyllium Husk Powder", "1.5%"],
      ["Maize Flour", "1.5%"],
      ["Bengal Gram Flour", "2.6%"],
    ],
  },
  "Nutrition Information": {
    type: "table",
    headers: ["Nutritional Parameter", "Per 100g"],
    rows: [
      ["Energy", "366 kcal"],
      ["Protein", "14.5 g"],
      ["Carbohydrate", "73.1 g"],
      ["Total Sugars", "4.8 g"],
      ["Added Sugars", "0 g"],
      ["Total Fat", "1.7 g"],
      ["Dietary Fibre", "12.5 g"],
    ],
  },
};

const PRODUCTS = [
  {
    id: "1",
    images: groceryImages1,
    title: "Aashirvaad Atta with Multigrains, 5kg pack, The High Fibre Atta",
    shortTitle: "Aashirvaad Atta with Multigrains",
    weight: "5 Kg",
    pricePerUnit: "₹0.555/1 Kg",
    discountPercentage: "20%",
    currentPrice: "₹219",
    originalPrice: "₹274",
    brandName: "Aashirvad",
    sellerName: "Balaji Mart",
    productInfo: PRODUCT_INFO_MOCK,
  },
  {
    id: "2",
    images: [
      "https://m.media-amazon.com/images/I/614mm2hYHyL._SL1000_.jpg",
      "https://m.media-amazon.com/images/I/61P4za8gJcL._SL1000_.jpg",
    ],
    title: "Tata Salt, Vacuum Evaporated Iodised Salt, 1 kg",
    shortTitle: "Tata Salt",
    weight: "1 Kg",
    pricePerUnit: "₹28/1 Kg",
    discountPercentage: "10%",
    currentPrice: "₹25",
    originalPrice: "₹28",
    brandName: "Tata",
    sellerName: "Balaji Mart",
    productInfo: {
      Highlight: {
        type: "text",
        content:
          "Vacuum evaporated iodised salt. Provides iodine which helps in mental development of children.",
      },
    },
  },
  {
    id: "3",
    images: [
      "https://m.media-amazon.com/images/I/815+an25xuL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/81t3at0mYDL._SL1500_.jpg",
    ],
    title: "Maggi 2-Minute Instant Noodles, Masala, 70g (Pack of 12)",
    shortTitle: "Maggi Masala Noodles",
    weight: "840 g",
    pricePerUnit: "₹0.20/1 g",
    discountPercentage: "5%",
    currentPrice: "₹168",
    originalPrice: "₹176",
    brandName: "Nestle",
    sellerName: "Balaji Mart",
    productInfo: {
      Description: {
        type: "text",
        content:
          "Maggi 2-Minute Masala Noodles is an instant noodles brand manufactured by Nestle. Made with the choicest quality spices.",
      },
      Ingredients: {
        type: "table",
        headers: ["Ingredient", "Content"],
        rows: [
          ["Refined Wheat Flour (Maida)", "78.4%"],
          ["Palm Oil", "Edible Vegetable Oil"],
          ["Iodised Salt", "Standard"],
          ["Wheat Gluten", "Added"],
        ],
      },
    },
  },
  {
    id: "4",
    images: [
      "https://m.media-amazon.com/images/I/41xPqHxjEGL._SY300_SX300_QL70_FMwebp_.jpg",
      "https://m.media-amazon.com/images/I/61rY73psjVL._SL1100_.jpg",
    ],
    title: "Fortune Sunlite Refined Sunflower Oil, 1L Pet Bottle",
    shortTitle: "Fortune Sunflower Oil",
    weight: "1 L",
    pricePerUnit: "₹145/1 L",
    discountPercentage: "15%",
    currentPrice: "₹145",
    originalPrice: "₹170",
    brandName: "Fortune",
    sellerName: "Balaji Mart",
    productInfo: {
      Highlight: {
        type: "text",
        content: "Light and healthy, easy to digest. Rich in vitamins.",
      },
    },
  },
  {
    id: "5",
    images: [
      "https://m.media-amazon.com/images/I/717GgfVk6YL._SL1500_.jpg",
      "https://m.media-amazon.com/images/I/61FzvpdoS6L._SL1000_.jpg",
    ],
    title: "Amul Butter - Pasteurized, 500g",
    shortTitle: "Amul Butter",
    weight: "500 g",
    pricePerUnit: "₹0.57/1 g",
    discountPercentage: "0%",
    currentPrice: "₹285",
    originalPrice: "₹285",
    brandName: "Amul",
    sellerName: "Balaji Mart",
    productInfo: {
      Highlight: {
        type: "text",
        content: "Made from fresh cream. The taste of India.",
      },
    },
  },
  {
    id: "6",
    images: [
      "https://m.media-amazon.com/images/I/51l5pzNZ50L._SL1000_.jpg",
      "https://m.media-amazon.com/images/I/51g5KyP-uBL._SL1000_.jpg",
    ],
    title: "Brooke Bond Red Label Tea, 1 kg",
    shortTitle: "Red Label Tea",
    weight: "1 Kg",
    pricePerUnit: "₹450/1 Kg",
    discountPercentage: "18%",
    currentPrice: "₹369",
    originalPrice: "₹450",
    brandName: "Brooke Bond",
    sellerName: "Balaji Mart",
    productInfo: {
      Highlight: {
        type: "text",
        content: "High quality blend of tea rich in taste and flavour.",
      },
    },
  },
];

const AnimatedThumbnail = ({
  product,
  index,
  thumbScrollX,
  onPress,
}: {
  product: any;
  index: number;
  thumbScrollX: any;
  onPress: () => void;
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    const position = index - thumbScrollX.value / THUMBNAIL_SPACING;

    const size = interpolate(
      position,
      [-3, -2, -1, 0, 1, 2, 3],
      [32, 48, 48, 64, 48, 48, 32],
      Extrapolation.CLAMP,
    );

    const opacity = interpolate(
      position,
      [-3, -2, -1, 0, 1, 2, 3],
      [0, 0.6, 0.6, 1, 0.6, 0.6, 0],
      Extrapolation.CLAMP,
    );

    const borderColor = interpolateColor(
      position,
      [-1, 0, 1],
      ["#e5e7eb", "#d1d5db", "#e5e7eb"], // gray-200 for inactive, gray-300 for active
    );

    return {
      width: size,
      height: size,
      opacity,
      borderWidth: 1,
      borderColor,
    };
  });

  return (
    <Pressable
      style={{
        width: THUMBNAIL_SPACING,
        height: THUMBNAIL_SPACING,
        justifyContent: "center",
        alignItems: "center",
      }}
      onPress={onPress}
    >
      <Animated.View
        style={[
          {
            borderRadius: 12,
            overflow: "hidden",
            backgroundColor: "white",
            elevation: 5,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
          },
          animatedStyle,
        ]}
      >
        <Image
          source={{ uri: product.images[0] }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </Animated.View>
    </Pressable>
  );
};

const AnimatedGroceryCard = ({
  item,
  onExpandChange,
}: {
  item: any;
  onExpandChange: (expanded: boolean) => void;
}) => {
  const insets = useSafeAreaInsets();
  const progress = useSharedValue(0);
  const isExpanded = useSharedValue(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const handleExpandChange = (expanded: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onExpandChange(expanded);
  };

  useAnimatedReaction(
    () => isExpanded.value,
    (currentValue, previousValue) => {
      if (currentValue !== previousValue) {
        runOnJS(handleExpandChange)(currentValue);
      }
    },
  );

  const animatedStyle = useAnimatedStyle(() => {
    return {
      marginHorizontal: interpolate(progress.value, [0, 1], [0, -24]),
      marginTop: interpolate(progress.value, [0, 1], [0, -40]),
      marginBottom: interpolate(progress.value, [0, 1], [80, -20]),
      borderRadius: interpolate(progress.value, [0, 1], [16, 0]),
      // paddingBottom: interpolate(progress.value, [0, 1], [0, insets.bottom]),
      zIndex: progress.value > 0 ? 100 : 0,
      elevation: progress.value > 0 ? 10 : 0,
    };
  });

  return (
    <Animated.View
      className="flex-1 bg-white overflow-hidden"
      style={animatedStyle}
    >
      <BigGroceryProduct
        images={item.images}
        title={item.title}
        shortTitle={item.shortTitle}
        weight={item.weight}
        pricePerUnit={item.pricePerUnit}
        discountPercentage={item.discountPercentage}
        currentPrice={item.currentPrice}
        originalPrice={item.originalPrice}
        brandName={item.brandName}
        sellerName={item.sellerName}
        productInfo={item.productInfo as Record<string, InfoData>}
        progress={progress}
        isExpanded={isExpanded}
      />
    </Animated.View>
  );
};

const BigGroceryPage = () => {
  const [scrollEnabled, setScrollEnabled] = React.useState(true);
  const scrollX = useSharedValue(0);
  const listRef = React.useRef<any>(null);

  const thumbRef = useAnimatedRef<Animated.ScrollView>();
  const thumbScrollX = useSharedValue(0);
  const isScrollingThumb = useSharedValue(false);

  const syncMainList = (offsetX: number) => {
    const index = Math.round(offsetX / THUMBNAIL_SPACING);
    listRef.current?.scrollToOffset({
      offset: index * SNAP_INTERVAL,
      animated: false,
    });

    // Wait a brief moment for the main list's scrollX to update before releasing the thumb lock
    setTimeout(() => {
      isScrollingThumb.value = false;
    }, 50);
  };

  const thumbScrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      thumbScrollX.value = event.contentOffset.x;
    },
    onBeginDrag: () => {
      isScrollingThumb.value = true;
    },
    onMomentumEnd: (event) => {
      // Do not release the lock synchronously to prevent yanking!
      // Let the JS thread handle the jump and release the lock after.
      runOnJS(syncMainList)(event.contentOffset.x);
    },
  });

  useAnimatedReaction(
    () => scrollX.value,
    (current) => {
      if (!isScrollingThumb.value) {
        const targetThumbOffset = (current / SNAP_INTERVAL) * THUMBNAIL_SPACING;
        scrollTo(thumbRef, targetThumbOffset, 0, false);
      }
    },
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)", // 50% black backdrop
        }}
      >
        <AnimatedFlashList
          ref={listRef}
          data={PRODUCTS}
          horizontal
          scrollEnabled={scrollEnabled}
          snapToInterval={SNAP_INTERVAL}
          estimatedItemSize={SNAP_INTERVAL}
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: 40,
            paddingHorizontal: 24,
            paddingBottom: 120,
          }}
          keyExtractor={(item: any) => item.id}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          renderItem={({ item }: { item: any }) => (
            <View style={{ height, width: CARD_WIDTH, marginRight: SPACING }}>
              <AnimatedGroceryCard
                item={item}
                onExpandChange={(expanded) => setScrollEnabled(!expanded)}
              />
            </View>
          )}
        />

        {scrollEnabled && (
          <Animated.View
            className="absolute bottom-16 left-0 right-0 h-20 z-10 "
            pointerEvents="box-none"
          >
            <Animated.ScrollView
              ref={thumbRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={THUMBNAIL_SPACING}
              decelerationRate="fast"
              contentContainerStyle={{
                paddingHorizontal: FullWidth / 2 - THUMBNAIL_SPACING / 2,
                alignItems: "center",
              }}
              onScroll={thumbScrollHandler}
              scrollEventThrottle={16}
              contentOffset={{
                x: (scrollX.value / SNAP_INTERVAL) * THUMBNAIL_SPACING,
                y: 0,
              }}
            >
              {PRODUCTS.map((product, index) => (
                <AnimatedThumbnail
                  key={product.id}
                  product={product}
                  index={index}
                  thumbScrollX={thumbScrollX}
                  onPress={() => {
                    const currentIndex = Math.round(
                      scrollX.value / SNAP_INTERVAL,
                    );
                    const distance = Math.abs(currentIndex - index);

                    listRef.current?.scrollToOffset({
                      offset: index * SNAP_INTERVAL,
                      // Only animate if it's right next to the current item to avoid visual noise
                      animated: distance === 1,
                    });
                  }}
                />
              ))}
            </Animated.ScrollView>
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default BigGroceryPage;
