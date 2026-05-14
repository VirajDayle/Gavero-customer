const TILE_SIZE = 34;
const TILE_GAP = 8;
const TILE_STRIDE = TILE_SIZE + TILE_GAP;
const COPIES = 6;
const ROWS = 7;

// Import all png icon with path

const SVG_ICON_POOL = [
  { type: "fruit", icon: require("../assets/images/apple.png") },
  { type: "fruit", icon: require("../assets/images/avacado.png") },
  { type: "fruit", icon: require("../assets/images/banana.png") },
  { type: "fruit", icon: require("../assets/images/capsicum.png") },
  { type: "fruit", icon: require("../assets/images/coconut.png") },
  {
    type: "fruit",
    icon: require("../assets/images/sweetpotato.png"),
  },
  {
    type: "fruit",
    icon: require("../assets/images/watermelon.png"),
  },
  {
    type: "fruit",
    icon: require("../assets/images/pineapple.png"),
  },
  { type: "food", icon: require("../assets/images/biryani.png") },
  { type: "food", icon: require("../assets/images/burger.png") },
  { type: "food", icon: require("../assets/images/eggs.png") },
  { type: "food", icon: require("../assets/images/frenchfries.png") },
  { type: "food", icon: require("../assets/images/pizza.png") },
  { type: "food", icon: require("../assets/images/sandwich.png") },
  { type: "food", icon: require("../assets/images/sushi.png") },
  { type: "food", icon: require("../assets/images/noodles.png") },
  { type: "food", icon: require("../assets/images/chinesefood.png") },
  { type: "food", icon: require("../assets/images/biscuit.png") },
  { type: "food", icon: require("../assets/images/saucecan.png") },
  { type: "food", icon: require("../assets/images/cupcake.png") },
  { type: "food", icon: require("../assets/images/noodles2.png") },

  { type: "dessert", icon: require("../assets/images/cake.png") },
  { type: "dessert", icon: require("../assets/images/choclate.png") },
  { type: "dessert", icon: require("../assets/images/icecream.png") },
  {
    type: "dessert",
    icon: require("../assets/images/icecream2.png"),
  },
  { type: "dessert", icon: require("../assets/images/pudding.png") },
  { type: "dessert", icon: require("../assets/images/cream.png") },
  { type: "dessert", icon: require("../assets/images/cream2.png") },
  { type: "drinks", icon: require("../assets/images/softdrink.png") },
  { type: "drinks", icon: require("../assets/images/water.png") },
  { type: "drinks", icon: require("../assets/images/wine.png") },
  { type: "drinks", icon: require("../assets/images/soda.png") },
  { type: "grocery", icon: require("../assets/images/rice.png") },
  { type: "grocery", icon: require("../assets/images/dogfood.png") },
  { type: "grocery", icon: require("../assets/images/soap.png") },
  { type: "grocery", icon: require("../assets/images/sugar.png") },
  { type: "grocery", icon: require("../assets/images/cheese.png") },
  { type: "grocery", icon: require("../assets/images/salt.png") },
  { type: "grocery", icon: require("../assets/images/bread.png") },
  { type: "grocery", icon: require("../assets/images/seedbag.png") },

  {
    type: "sports",
    icon: require("../assets/images/americanfootball.png"),
  },
  { type: "sports", icon: require("../assets/images/ball.png") },
  { type: "sports", icon: require("../assets/images/bat.png") },
  { type: "sports", icon: require("../assets/images/bowling.png") },
  { type: "sports", icon: require("../assets/images/skating.png") },
  { type: "sports", icon: require("../assets/images/whistle.png") },
  { type: "toys", icon: require("../assets/images/puzzle.png") },
  { type: "toys", icon: require("../assets/images/teddy.png") },
  { type: "toys", icon: require("../assets/images/teddy2.png") },

  { type: "toys", icon: require("../assets/images/truck.png") },
  { type: "music", icon: require("../assets/images/dholak.png") },
  { type: "music", icon: require("../assets/images/instument.png") },
  {
    type: "stationery",
    icon: require("../assets/images/pencil.png"),
  },
  { type: "stationery", icon: require("../assets/images/pin.png") },
  {
    type: "stationery",
    icon: require("../assets/images/scissior.png"),
  },
  {
    type: "stationery",
    icon: require("../assets/images/steplar.png"),
  },
  {
    type: "stationery",
    icon: require("../assets/images/notebook.png"),
  },
  {
    type: "electronics",
    icon: require("../assets/images/pendrive.png"),
  },
  { type: "home", icon: require("../assets/images/iron.png") },
  { type: "home", icon: require("../assets/images/hairdryer.png") },
  { type: "home", icon: require("../assets/images/hammer.png") },
  {
    type: "home",
    icon: require("../assets/images/paintingroller.png"),
  },
  {
    type: "home",
    icon: require("../assets/images/lightlamp.png"),
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
