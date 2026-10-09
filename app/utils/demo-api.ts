import products from '../data/demo-products.json'
import type { ApiOptions, AuthResponse, CartEntry, Product, ShopOrder, ShopUser } from '../types/shop'
import { cartTotals } from './money'

export const DEMO_STORAGE_KEY = 'boldburst:demo:v1'
export const DEMO_EMAIL = 'demo@example.com'
export const DEMO_PASSWORD = 'demo1234'
const catalog = products as Product[]
interface DemoState {
  version: 1
  users: ShopUser[]
  session: number | null
  carts: Record<string, { id: number; productVariantId: number; quantity: number }[]>
  orders: ShopOrder[]
  nextId: number
}
function freshState(): DemoState {
  return { version: 1, users: [{ id: 1, name: 'Demo Shopper', email: DEMO_EMAIL }], session: null, carts: {}, orders: [], nextId: 2 }
}

export function createDemoApi(storage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>) {
  let memory = freshState()
  function read(): DemoState {
    let raw: string | null | undefined
    try { raw = storage?.getItem(DEMO_STORAGE_KEY) } catch { return memory }
    if (!raw) return memory
    try {
      const candidate = JSON.parse(raw) as DemoState
      if (candidate.version !== 1 || !Array.isArray(candidate.users) || !Array.isArray(candidate.orders)
        || !candidate.carts || typeof candidate.carts !== 'object' || !Number.isSafeInteger(candidate.nextId)
        || !candidate.users.every(user => user && Number.isSafeInteger(user.id) && typeof user.name === 'string' && typeof user.email === 'string')
        || !candidate.orders.every(order => order && Number.isSafeInteger(order.id) && Number.isSafeInteger(order.userId)
          && Number.isFinite(order.totalAmount) && typeof order.createdAt === 'string' && typeof order.status === 'string'
          && Array.isArray(order.items) && order.items.every(item => item && item.productVariant?.product && Number.isInteger(item.quantity)))
        || !Object.values(candidate.carts).every(cart => Array.isArray(cart) && cart.every(item => Number.isSafeInteger(item.id)
          && catalog.some(product => product.variants.some(variant => variant.id === item.productVariantId))
          && Number.isInteger(item.quantity) && item.quantity > 0 && item.quantity <= 99))
        || (candidate.session !== null && !candidate.users.some(user => user.id === candidate.session))) {
        throw new Error('Invalid demo storage')
      }
      memory = candidate
    } catch {
      memory = freshState()
      try { storage?.removeItem(DEMO_STORAGE_KEY) } catch { /* Storage can be unavailable in private browsing. */ }
    }
    return memory
  }
  function save(state: DemoState) {
    memory = state
    try { storage?.setItem(DEMO_STORAGE_KEY, JSON.stringify(state)) } catch { /* Keep this session usable without storage. */ }
  }
  function cartKey(state: DemoState) { return state.session === null ? 'guest' : `user:${state.session}` }
  function variantById(id: number) {
    const product = catalog.find(product => product.variants.some(variant => variant.id === id))
    const variant = product?.variants.find(variant => variant.id === id)
    if (!product || !variant) throw new Error('Product variant not found')
    return { product, variant }
  }
  function entries(state: DemoState): CartEntry[] {
    return (state.carts[cartKey(state)] || []).map(item => {
      const { product, variant } = variantById(item.productVariantId)
      return { id: item.id, quantity: item.quantity, product, productVariant: variant }
    })
  }
  function signIn(state: DemoState, user: ShopUser): AuthResponse {
    const guest = state.carts.guest || []
    state.session = user.id
    const cart = state.carts[cartKey(state)] ||= []
    for (const item of guest) {
      const existing = cart.find(entry => entry.productVariantId === item.productVariantId)
      if (existing) existing.quantity = Math.min(99, existing.quantity + item.quantity)
      else cart.push(item)
    }
    delete state.carts.guest
    save(state)
    return { user, access_token: `demo-session-${user.id}` }
  }
  async function request<T>(path: string, options: ApiOptions = {}): Promise<T> {
    const state = read()
    const method = options.method || 'GET'
    const body = options.body || {}
    let response: unknown
    if (method === 'GET' && path === '/products') response = catalog
    else if (method === 'GET' && path.startsWith('/products/category/')) {
      const slug = path.slice('/products/category/'.length).toLowerCase()
      response = catalog.filter(product => product.category.name.toLowerCase() === slug)
    } else if (method === 'GET' && /^\/products\/\d+$/.test(path)) {
      response = catalog.find(product => product.id === Number(path.split('/').at(-1)))
      if (!response) throw new Error('Product not found')
    } else if (method === 'POST' && (path === '/auth/login' || path === '/auth/register')) {
      const email = String(body.email || '').trim().toLowerCase()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || body.password !== DEMO_PASSWORD) {
        throw new Error('Use the demo passphrase: demo1234')
      }
      let user = state.users.find(user => user.email === email)
      if (path === '/auth/register') {
        if (user) throw new Error('This demo email is already registered')
        const name = String(body.name || '').trim()
        if (!name) throw new Error('Please enter a display name')
        user = { id: state.nextId++, name, email }
        state.users.push(user)
      }
      if (!user) throw new Error('Use demo@example.com or register a demo identity first')
      response = signIn(state, user)
    } else if (method === 'GET' && path === '/auth/profile') {
      response = state.users.find(user => user.id === state.session)
      if (!response) throw new Error('Please sign in first')
    } else if (method === 'POST' && path === '/auth/logout') {
      state.session = null
      save(state)
      response = {}
    } else if (method === 'POST' && path === '/demo/reset') {
      save(freshState())
      response = {}
    } else if (method === 'GET' && path === '/cart') response = { items: entries(state) }
    else if (method === 'POST' && path === '/cart/add') {
      const variantId = Number(body.productVariantId)
      const quantity = Number(body.quantity)
      variantById(variantId)
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Quantity must be between 1 and 99')
      const cart = state.carts[cartKey(state)] ||= []
      const existing = cart.find(item => item.productVariantId === variantId)
      if (existing && existing.quantity + quantity > 99) throw new Error('Maximum quantity is 99')
      if (existing) existing.quantity += quantity
      else cart.push({ id: state.nextId++, productVariantId: variantId, quantity })
      save(state)
      response = { items: entries(state) }
    } else if ((method === 'DELETE' && path.startsWith('/cart/remove/')) || (method === 'PATCH' && path.startsWith('/cart/quantity/'))) {
      const id = Number(path.split('/').at(-1))
      const cart = state.carts[cartKey(state)] ||= []
      const index = cart.findIndex(item => item.id === id)
      if (index < 0) throw new Error('Cart item not found')
      if (method === 'DELETE') cart.splice(index, 1)
      else {
        const quantity = Number(body.quantity)
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new Error('Quantity must be between 1 and 99')
        cart[index]!.quantity = quantity
      }
      save(state)
      response = { items: entries(state) }
    } else if (method === 'GET' && path === '/orders') {
      if (state.session === null) throw new Error('Please sign in first')
      response = state.orders.filter(order => order.userId === state.session)
    } else if (method === 'POST' && path === '/orders') {
      if (state.session === null) throw new Error('Please sign in first')
      const cart = entries(state)
      if (!cart.length) throw new Error('Your cart is empty')
      const address = body.shippingAddress as Record<string, unknown> | undefined
      if (!address || !['firstName', 'lastName', 'address', 'city', 'zip', 'country'].every(key => typeof address[key] === 'string' && String(address[key]).trim())) {
        throw new Error('Please complete the sample shipping address')
      }
      const id = state.nextId++
      const order: ShopOrder = {
        id, orderNo: `DEMO-${id}`, userId: state.session,
        totalAmount: cartTotals(cart).total / 100 / 91,
        status: 'PAID', createdAt: new Date().toISOString(),
        items: cart.map(item => ({ id: item.id, quantity: item.quantity, price: item.product.price, productVariant: { ...item.productVariant, product: item.product } })),
      }
      state.orders.unshift(order)
      state.carts[cartKey(state)] = []
      save(state)
      response = order
    } else throw new Error(`Unsupported demo operation: ${method} ${path}`)
    return structuredClone(response) as T
  }
  return request
}
