export const PRODUCT_LIMITS: Record<string, number> = {
  chapathi: 19,
  poori: 13,
};

export const getProductLimit = (slug: string) => {
  return PRODUCT_LIMITS[slug] ?? Infinity;
};
