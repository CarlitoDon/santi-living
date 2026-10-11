// ==========================================================================
// TypeScript Types - Santi Living
// ==========================================================================


/**
 * Cart item
 */
export interface CartItem {
  id: string;
  name: string;
  category: "package" | "mattress" | "accessory";
  quantity: number;
  pricePerDay: number;
  includes?: string[]; // Bundle components: ["kasur busa", "sprei", "bantal"]
}

