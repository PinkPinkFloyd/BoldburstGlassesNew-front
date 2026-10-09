export interface ShopUser { id: number; name: string; email: string }
export interface ProductVariant { id: number; productId: number; color: string; lensType: string; stock: number }
export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: { id: number; name: string }
  images: { id: number; url: string }[]
  variants: ProductVariant[]
}
export interface CartEntry { id: number; quantity: number; product: Product; productVariant: ProductVariant }
export interface ShopOrder {
  id: number
  orderNo: string
  userId: number
  totalAmount: number
  status: string
  createdAt: string
  items: { id: number; quantity: number; price: number; productVariant: ProductVariant & { product: Product } }[]
}
export interface AuthResponse { access_token: string; user: ShopUser }
export interface ApiOptions { method?: 'GET' | 'POST' | 'DELETE' | 'PATCH'; body?: Record<string, unknown> }
export type ShopApi = <T>(path: string, options?: ApiOptions) => Promise<T>
