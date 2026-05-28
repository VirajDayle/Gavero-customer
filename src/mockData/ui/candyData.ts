const TILE_SIZE = 34;
const TILE_GAP = 8;
const TILE_STRIDE = TILE_SIZE + TILE_GAP;
const COPIES = 6;
const ROWS = 7;

// Import all png icon with path

export const SVG_ICON_POOL = [
  { type: "fruit", icon: require("@/src/assets/images/candy/apple.png") },
  { type: "fruit", icon: require("@/src/assets/images/candy/avacado.png") },
  { type: "fruit", icon: require("@/src/assets/images/candy/banana.png") },
  { type: "fruit", icon: require("@/src/assets/images/candy/capsicum.png") },
  { type: "fruit", icon: require("@/src/assets/images/candy/coconut.png") },
  {
    type: "fruit",
    icon: require("@/src/assets/images/candy/sweetpotato.png"),
  },
  {
    type: "fruit",
    icon: require("@/src/assets/images/candy/watermelon.png"),
  },
  {
    type: "fruit",
    icon: require("@/src/assets/images/candy/pineapple.png"),
  },
  { type: "food", icon: require("@/src/assets/images/candy/biryani.png") },
  { type: "food", icon: require("@/src/assets/images/candy/burger.png") },
  { type: "food", icon: require("@/src/assets/images/candy/eggs.png") },
  { type: "food", icon: require("@/src/assets/images/candy/frenchfries.png") },
  { type: "food", icon: require("@/src/assets/images/candy/pizza.png") },
  { type: "food", icon: require("@/src/assets/images/candy/sandwich.png") },
  { type: "food", icon: require("@/src/assets/images/candy/sushi.png") },
  { type: "food", icon: require("@/src/assets/images/candy/noodles.png") },
  { type: "food", icon: require("@/src/assets/images/candy/chinesefood.png") },
  { type: "food", icon: require("@/src/assets/images/candy/biscuit.png") },
  { type: "food", icon: require("@/src/assets/images/candy/saucecan.png") },
  { type: "food", icon: require("@/src/assets/images/candy/cupcake.png") },
  { type: "food", icon: require("@/src/assets/images/candy/noodles2.png") },

  { type: "dessert", icon: require("@/src/assets/images/candy/cake.png") },
  { type: "dessert", icon: require("@/src/assets/images/candy/choclate.png") },
  { type: "dessert", icon: require("@/src/assets/images/candy/icecream.png") },
  {
    type: "dessert",
    icon: require("@/src/assets/images/candy/icecream2.png"),
  },
  { type: "dessert", icon: require("@/src/assets/images/candy/pudding.png") },
  { type: "dessert", icon: require("@/src/assets/images/candy/cream.png") },
  { type: "dessert", icon: require("@/src/assets/images/candy/cream2.png") },
  { type: "drinks", icon: require("@/src/assets/images/candy/softdrink.png") },
  { type: "drinks", icon: require("@/src/assets/images/candy/water.png") },
  { type: "drinks", icon: require("@/src/assets/images/candy/wine.png") },
  { type: "drinks", icon: require("@/src/assets/images/candy/soda.png") },
  { type: "grocery", icon: require("@/src/assets/images/candy/rice.png") },
  { type: "grocery", icon: require("@/src/assets/images/candy/dogfood.png") },
  { type: "grocery", icon: require("@/src/assets/images/candy/soap.png") },
  { type: "grocery", icon: require("@/src/assets/images/candy/sugar.png") },
  { type: "grocery", icon: require("@/src/assets/images/candy/cheese.png") },
  { type: "grocery", icon: require("@/src/assets/images/candy/salt.png") },
  { type: "grocery", icon: require("@/src/assets/images/candy/bread.png") },
  { type: "grocery", icon: require("@/src/assets/images/candy/seedbag.png") },

  {
    type: "sports",
    icon: require("@/src/assets/images/candy/americanfootball.png"),
  },
  { type: "sports", icon: require("@/src/assets/images/candy/ball.png") },
  { type: "sports", icon: require("@/src/assets/images/candy/bat.png") },
  { type: "sports", icon: require("@/src/assets/images/candy/bowling.png") },
  { type: "sports", icon: require("@/src/assets/images/candy/skating.png") },
  { type: "sports", icon: require("@/src/assets/images/candy/whistle.png") },
  { type: "toys", icon: require("@/src/assets/images/candy/puzzle.png") },
  { type: "toys", icon: require("@/src/assets/images/candy/teddy.png") },
  { type: "toys", icon: require("@/src/assets/images/candy/teddy2.png") },

  { type: "toys", icon: require("@/src/assets/images/candy/truck.png") },
  { type: "music", icon: require("@/src/assets/images/candy/dholak.png") },
  { type: "music", icon: require("@/src/assets/images/candy/instument.png") },
  {
    type: "stationery",
    icon: require("@/src/assets/images/candy/pencil.png"),
  },
  { type: "stationery", icon: require("@/src/assets/images/candy/pin.png") },
  {
    type: "stationery",
    icon: require("@/src/assets/images/candy/scissior.png"),
  },
  {
    type: "stationery",
    icon: require("@/src/assets/images/candy/steplar.png"),
  },
  {
    type: "stationery",
    icon: require("@/src/assets/images/candy/notebook.png"),
  },
  {
    type: "electronics",
    icon: require("@/src/assets/images/candy/pendrive.png"),
  },
  { type: "home", icon: require("@/src/assets/images/candy/iron.png") },
  { type: "home", icon: require("@/src/assets/images/candy/hairdryer.png") },
  { type: "home", icon: require("@/src/assets/images/candy/hammer.png") },
  {
    type: "home",
    icon: require("@/src/assets/images/candy/paintingroller.png"),
  },
  {
    type: "home",
    icon: require("@/src/assets/images/candy/lightlamp.png"),
  },
];

// Sin based shuffle all icons

const SHUFFLED_POOL = [...SVG_ICON_POOL]
  .map((item, i) => ({ item, sort: Math.sin(i * 127.1 + 311.7) }))
  .sort((a, b) => a.sort - b.sort)
  .map(({ item }) => item);

function buildRowSlices(pool: typeof SHUFFLED_POOL, rows: number) {
  const sliceSize = Math.ceil(pool.length / rows);
  return Array.from({ length: rows }, (_, r) =>
    pool.slice(r * sliceSize, (r + 1) * sliceSize),
  );
}

export const ROW_SLICES = buildRowSlices(SHUFFLED_POOL, ROWS);
