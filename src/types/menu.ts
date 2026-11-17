export type DietaryType = 'veg' | 'non-veg' | 'neutral';

export type MenuCategoryId =
  | 'refreshments'
  | 'soups'
  | 'tandoor'
  | 'chinese'
  | 'indian-main'
  | 'rice-biryani'
  | 'roti-naan'
  | 'extras-sweets';

export interface MenuCategoryMeta {
  id: MenuCategoryId;
  label: string;
  shortLabel: string;
  description: string;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: MenuCategoryId;
  subCategory: string;
  dietary: DietaryType;
  image: string;
  portionNote?: string;
  groupId?: string;
  groupTitle?: string;
  variantLabel?: string;
}

export interface BulkOrderItem {
  id: string;
  name: string;
  subCategory: 'Royal Biryanis' | 'Fragrant Pulaos' | 'Specialties & Curries';
  dietary: 'veg' | 'non-veg';
  image: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type OrderType = 'Takeaway' | 'Home Delivery';

export interface CheckoutFormState {
  customerName: string;
  contactNumber: string;
  orderType: OrderType;
  deliveryAddress: string;
  specialInstructions: string;
}

export interface PartyEnquiryFormState {
  customerName: string;
  contactNumber: string;
  eventDate: string;
  approximateQuantity: string;
  foodRequirements: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  cuisine: string;
  caption: string;
  image: string;
}
