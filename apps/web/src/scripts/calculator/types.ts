/**
 * Calculator Types
 * Re-exports and local type definitions for calculator module
 */

import type { CalculatorState, ProductItem, CartItem } from "@/types";

// Re-export types needed by other calculator modules
export type { CalculatorState, ProductItem, CartItem };

// DOM elements map type
export type ElementsMap = Record<string, HTMLElement | null>;

// Category type for items
export type ItemCategory = "package" | "mattress" | "accessory";
