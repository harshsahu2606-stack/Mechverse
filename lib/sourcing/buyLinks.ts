/**
 * Helper utility to generate verified Indian purchasing links (Amazon.in, Flipkart, Robu.in, ElectronicsComp)
 */

export interface BuyLinkSet {
  amazonUrl: string;
  flipkartUrl: string;
  officialUrl: string;
  officialVendor: string;
}

export function generateBuyLinks(
  componentName: string,
  officialUrl?: string,
  vendorName?: string
): BuyLinkSet {
  // Clean query for optimal Amazon.in and Flipkart Indian search results
  const cleanQuery = componentName
    .replace(/\(.*?\)/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim();
  const encodedQuery = encodeURIComponent(cleanQuery);

  return {
    amazonUrl: `https://www.amazon.in/s?k=${encodedQuery}`,
    flipkartUrl: `https://www.flipkart.com/search?q=${encodedQuery}`,
    officialUrl: officialUrl || `https://robu.in/?s=${encodedQuery}&post_type=product`,
    officialVendor: vendorName || "Robu.in",
  };
}
