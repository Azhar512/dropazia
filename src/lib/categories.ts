export const CATEGORIES = [
  "women clothing",
  "men's clothing",
  "home essential",
  "kitten wave",
  "cosmetics",
  "kids clothing",
  "jewelry",
  "handbags",
  "beding",
  "home decoration",
  "men's shoes",
  "ladies shoes",
  "kids shoes",
  "bathroom products",
  "Islamic accessories",
  "men's watches",
  "Ladies watch's",
  "Kids watch's",
  "perfumes",
  "toys and stationery"
] as const;

export type Category = typeof CATEGORIES[number];
