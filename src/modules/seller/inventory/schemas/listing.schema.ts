import { z } from 'zod';

// ============================================================================
// ENUMS (from DBML verbacc-connect-erd.dbml)
// ============================================================================

export const ItemCondition = {
  NEW: 'new',
  USED: 'used',
  REFURBISHED: 'refurbished',
} as const;

export type ItemConditionType = (typeof ItemCondition)[keyof typeof ItemCondition];

export const ItemStatus = {
  AVAILABLE: 'available',
  SOLD: 'sold',
  RESERVED: 'reserved',
} as const;

export type ItemStatusType = (typeof ItemStatus)[keyof typeof ItemStatus];

export const PriceType = {
  FIXED: 'fixed',
  NEGOTIABLE: 'negotiable',
} as const;

export type PriceTypeValue = (typeof PriceType)[keyof typeof PriceType];

export const DeliveryType = {
  FIXED: 'fixed',
  CALCULATED: 'calculated',
  FREE: 'free',
} as const;

export type DeliveryTypeValue = (typeof DeliveryType)[keyof typeof DeliveryType];

// ============================================================================
// CATEGORIES (Hardcoded marketplace categories)
// ============================================================================

export const MARKETPLACE_CATEGORIES = [
  { id: 'electronics', label: 'Electronics', icon: 'Smartphone' },
  { id: 'appliances', label: 'Appliances', icon: 'Microwave' },
  { id: 'furniture', label: 'Furniture', icon: 'Armchair' },
  { id: 'books', label: 'Books & Stationery', icon: 'BookOpen' },
  { id: 'clothing', label: 'Clothing & Fashion', icon: 'Shirt' },
  { id: 'kitchen', label: 'Kitchen & Dining', icon: 'ChefHat' },
  { id: 'sports', label: 'Sports & Fitness', icon: 'Dumbbell' },
  { id: 'beauty', label: 'Beauty & Personal Care', icon: 'Sparkles' },
  { id: 'other', label: 'Other', icon: 'Package' },
] as const;

export type CategoryId = (typeof MARKETPLACE_CATEGORIES)[number]['id'];

// ============================================================================
// COMMISSION CONSTANTS
// ============================================================================

export const PLATFORM_FEE_PERCENTAGE = 0.12; // 12%
export const SELLER_PERCENTAGE = 0.88; // 88%
export const MIN_PRICE_NGN = 500;

/**
 * Calculate the final price (what buyer pays) from base price
 */
export function calculateFinalPrice(basePrice: number): number {
  return Math.ceil(basePrice * (1 + PLATFORM_FEE_PERCENTAGE));
}

/**
 * Calculate the platform fee from base price
 */
export function calculatePlatformFee(basePrice: number): number {
  return Math.ceil(basePrice * PLATFORM_FEE_PERCENTAGE);
}

// ============================================================================
// ZOD SCHEMAS (Zod v4 syntax)
// ============================================================================

// Step 1: Identity & Category
export const step1Schema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title cannot exceed 255 characters'),
  category_id: z
    .string()
    .min(1, 'Please select a category'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(2000, 'Description cannot exceed 2000 characters'),
  base_price: z
    .number({ message: 'Price is required' })
    .min(MIN_PRICE_NGN, `Minimum price is ₦${MIN_PRICE_NGN.toLocaleString()}`),
  price_type: z.enum(['fixed', 'negotiable'], { message: 'Please select pricing type' }),
});

export type Step1Data = z.infer<typeof step1Schema>;

// Step 2: Media & Condition
export const step2Schema = z.object({
  media_urls: z
    .array(z.string().url())
    .min(3, 'At least 3 photos are required')
    .max(10, 'Maximum 10 photos allowed'),
  condition: z.enum(['new', 'used', 'refurbished'], { message: 'Please select item condition' }),
  quantity: z
    .number()
    .int()
    .min(1, 'Quantity must be at least 1'),
});

export type Step2Data = z.infer<typeof step2Schema>;

// Step 3: Fulfillment & Logistics
export const step3Schema = z.object({
  pickup_landmark: z
    .string()
    .min(5, 'Pickup location must be at least 5 characters')
    .max(500, 'Pickup location cannot exceed 500 characters'),
  allow_pickup: z.boolean(),
  allow_delivery: z.boolean(),
  delivery_fee_type: z.enum(['fixed', 'calculated', 'free']).optional(),
  base_delivery_fee: z.number().min(0).optional(),
});

export type Step3Data = z.infer<typeof step3Schema>;

// Combined listing schema
export const listingSchema = step1Schema.merge(step2Schema).merge(step3Schema);

export type ListingData = z.infer<typeof listingSchema>;

// ============================================================================
// API PAYLOAD TYPES
// ============================================================================

export interface CreateListingPayload {
  // market_items
  title: string;
  category_id: string;
  description: string;
  condition: ItemConditionType;
  quantity: number;
  media_urls: string[];
  pickup_landmark: string;
  
  // market_item_prices
  base_price: number;
  final_price: number;
  price_type: PriceTypeValue;
  
  // market_logistics
  allow_pickup: boolean;
  allow_delivery: boolean;
  delivery_fee_type?: DeliveryTypeValue;
  base_delivery_fee?: number;
}

/**
 * Transform wizard form data into API payload
 */
export function createListingPayload(data: ListingData): CreateListingPayload {
  return {
    title: data.title,
    category_id: data.category_id,
    description: data.description,
    condition: data.condition as ItemConditionType,
    quantity: data.quantity,
    media_urls: data.media_urls,
    pickup_landmark: data.pickup_landmark,
    
    base_price: data.base_price,
    final_price: calculateFinalPrice(data.base_price),
    price_type: data.price_type as PriceTypeValue,
    
    allow_pickup: data.allow_pickup,
    allow_delivery: data.allow_delivery,
    delivery_fee_type: data.delivery_fee_type as DeliveryTypeValue | undefined,
    base_delivery_fee: data.base_delivery_fee,
  };
}
