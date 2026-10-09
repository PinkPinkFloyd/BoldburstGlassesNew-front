import { test } from 'node:test'
import assert from 'node:assert/strict'
import { build } from 'esbuild'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
// Exercise the real adapter without Nuxt or a browser, including persisted state.
const temp = await mkdtemp(join(tmpdir(), 'boldburst-test-'))
await build({ entryPoints: ['app/utils/demo-api.ts'], bundle: true, platform: 'node', format: 'esm', outfile: join(temp, 'adapter.mjs') })
const { createDemoApi, DEMO_STORAGE_KEY } = await import(pathToFileURL(join(temp, 'adapter.mjs')).href)
await rm(temp, { recursive: true, force: true })
function context() {
  const values = new Map()
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value), removeItem: key => values.delete(key) }
  return { api: createDemoApi(storage), storage, values }
}
const login = api => api('/auth/login', { method: 'POST', body: { email: 'demo@example.com', password: 'demo1234' } })
const address = { firstName: 'Demo', lastName: 'Shopper', address: 'Example Street', city: 'Example City', zip: '10001', country: 'Example Country' }

test('catalog includes four categories, valid variants, detail and missing-product errors', async () => {
  const { api } = context()
  const products = await api('/products')
  assert.equal(products.length, 16)
  for (const slug of ['myopia', 'sunglasses', 'reading', 'contacts']) assert.equal((await api('/products/category/' + slug)).length, 4)
  for (const product of products) {
    assert.ok(product.images.length && product.variants.length)
    assert.equal((await api('/products/' + product.id)).name, product.name)
  }
  await assert.rejects(api('/products/999999'), /not found/)
  assert.deepEqual(await api('/products/category/missing'), [])
  await assert.rejects(api('/payment'), /Unsupported/)
})

test('guest cart merges on login, variants remain distinct, quantities persist and totals are correct', async () => {
  const { api, storage } = context()
  const [product] = await api('/products')
  const add = id => api('/cart/add', { method: 'POST', body: { productVariantId: id, quantity: 1 } })
  await add(product.variants[0].id)
  await add(product.variants[0].id)
  await add(product.variants[1].id)
  await login(api)
  let { items } = await api('/cart')
  assert.equal(items.length, 2)
  assert.equal(items[0].quantity, 2)
  await api('/cart/quantity/' + items[0].id, { method: 'PATCH', body: { quantity: 3 } })
  items = (await createDemoApi(storage)('/cart')).items
  assert.equal(items[0].quantity, 3)
  const subtotal = Math.round(product.price * 91 * 100) * 4
  const expected = subtotal + Math.round(subtotal * 0.08)
  const order = await api('/orders', { method: 'POST', body: { shippingAddress: address } })
  assert.equal(Math.round(order.totalAmount * 91 * 100), expected)
  assert.equal(order.items[0].quantity, 3)
  assert.equal(order.status, 'PAID')
  assert.deepEqual((await api('/cart')).items, [])
  await assert.rejects(api('/orders', { method: 'POST', body: { shippingAddress: address } }), /empty/)
  assert.equal((await createDemoApi(storage)('/orders')).length, 1)
})

test('registration, logout, account isolation and reset never save passwords or shipping addresses', async () => {
  const { api, storage } = context()
  const register = { method: 'POST', body: { name: 'Sample', email: 'sample@example.com', password: 'demo1234' } }
  await api('/auth/register', register)
  await assert.rejects(api('/auth/register', register), /already registered/)
  const [product] = await api('/products')
  await api('/cart/add', { method: 'POST', body: { productVariantId: product.variants[0].id, quantity: 1 } })
  await api('/orders', { method: 'POST', body: { shippingAddress: address } })
  assert.equal((await api('/orders')).length, 1)
  const raw = storage.getItem(DEMO_STORAGE_KEY)
  assert.ok(!raw.includes('demo1234') && !raw.includes('password') && !raw.includes('Example Street'))
  await api('/auth/logout', { method: 'POST' })
  await assert.rejects(api('/auth/profile'), /sign in/)
  await login(api)
  assert.equal((await api('/orders')).length, 0)
  await api('/demo/reset', { method: 'POST' })
  await assert.rejects(api('/auth/profile'), /sign in/)
  assert.deepEqual((await api('/cart')).items, [])
  assert.equal(JSON.parse(storage.getItem(DEMO_STORAGE_KEY)).users.length, 1)
})

test('invalid quantities, empty checkout and missing address are rejected', async () => {
  const { api } = context()
  await login(api)
  const [product] = await api('/products')
  await assert.rejects(api('/orders', { method: 'POST', body: { shippingAddress: address } }), /empty/)
  for (const quantity of [-1, 0, 1.5, 100, 'bad']) await assert.rejects(api('/cart/add', { method: 'POST', body: { productVariantId: product.variants[0].id, quantity } }), /Quantity/)
  await api('/cart/add', { method: 'POST', body: { productVariantId: product.variants[0].id, quantity: 1 } })
  await assert.rejects(api('/orders', { method: 'POST', body: {} }), /address/)
  const { items } = await api('/cart')
  await api('/cart/remove/' + items[0].id, { method: 'DELETE' })
  assert.deepEqual((await api('/cart')).items, [])
})

test('broken or blocked storage recovers without making network requests', async () => {
  const { storage } = context()
  storage.setItem(DEMO_STORAGE_KEY, '{bad json')
  assert.deepEqual((await createDemoApi(storage)('/cart')).items, [])
  storage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ version: 1, users: [], orders: [null], carts: {}, nextId: 1, session: null }))
  assert.deepEqual((await createDemoApi(storage)('/cart')).items, [])
  const blocked = { getItem() { throw new Error('Blocked') }, setItem() { throw new Error('Blocked') }, removeItem() { throw new Error('Blocked') } }
  const api = createDemoApi(blocked)
  await login(api)
  assert.equal((await api('/auth/profile')).email, 'demo@example.com')
})
