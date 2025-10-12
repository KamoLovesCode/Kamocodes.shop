export type ProductCategory = 'Food & Drink' | 'Handcrafts' | 'Apparel' | 'Art';

export const CATEGORIES: ProductCategory[] = ['Food & Drink', 'Handcrafts', 'Apparel', 'Art'];

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  seller: string;
  category: ProductCategory;
}

export interface CartItem extends Product {
  quantity: number;
}
