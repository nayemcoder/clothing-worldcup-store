import './style.css'
import { supabase, hasSupabaseConfig } from './supabaseClient.js'
import fashionHero from './assets/fashion-hero.png'
import jerseyBanner from './assets/jersey-banner.png'

// SVG Icon helper
const svgIcons = {
  'search': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>',
  'shopping-bag': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>',
  'log-in': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>',
  'log-out': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>',
  'menu': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>',
  'user': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>',
  'x': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>',
  'star': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 10.26 24 10.27 17.18 16.7 20.27 25 12 19.54 3.73 25 6.82 16.7 0 10.27 8.91 10.26 12 2"></polygon></svg>',
  'sparkles': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v6m4-2l-4 4m0 0l-4-4m4 4v6"></path></svg>',
  'trophy': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-9a2 2 0 0 0-2-2h-2"></path><path d="M6 9c0-1 1-2 3-2h6c2 0 3 1 3 2"></path><path d="M9 5a2 2 0 0 1 6 0"></path><path d="M12 12v3"></path></svg>',
  'shirt': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 3h-3V1h-2v2H8L6 9h12l-2-6z"></path><path d="M6 9v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V9"></path><path d="M9 13h6"></path></svg>',
  'package-check': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16.5 9.4l-7.8 7.8-4.3-4.3"></path><path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>',
  'layout-dashboard': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>',
  'truck': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="15" height="10"></rect><path d="M16 6v4"></path><circle cx="5.5" cy="20.5" r="2.5"></circle><circle cx="18.5" cy="20.5" r="2.5"></circle><path d="M16 16h4a2 2 0 0 1 2 2v2"></path></svg>',
  'save': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
  'heart': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  'check': '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>',
}

function renderIcon(name) {
  return svgIcons[name] || ''
}

const fallbackProducts = [
  {
    id: 'demo-1',
    name: 'Midnight Tailored Blazer',
    category: 'Fashion',
    collection: 'City Edit',
    description: 'A sharp blazer for evening fits, office wear, and layered street styling.',
    price: 89,
    rating: 4.9,
    colors: ['#111827', '#f8fafc'],
    sizes: ['S', 'M', 'L', 'XL'],
    image_url: fashionHero,
    stock: 28,
    is_worldcup: false,
  },
  {
    id: 'demo-2',
    name: 'Layered Cotton Overshirt',
    category: 'Fashion',
    collection: 'Everyday',
    description: 'Heavy cotton overshirt with a relaxed cut and year-round layering weight.',
    price: 54,
    rating: 4.7,
    colors: ['#b91c1c', '#1f2937', '#f9fafb'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image_url: fashionHero,
    stock: 42,
    is_worldcup: false,
  },
  {
    id: 'demo-3',
    name: 'World Cup Home Jersey',
    category: 'World Cup Jerseys',
    collection: '2026 Jersey Drop',
    description: 'Fan-ready home jersey inspired by global tournament colors.',
    price: 72,
    rating: 4.9,
    colors: ['#16a34a', '#ffffff', '#dc2626'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image_url: jerseyBanner,
    stock: 60,
    is_worldcup: true,
  },
  {
    id: 'demo-4',
    name: 'World Cup Away Jersey',
    category: 'World Cup Jerseys',
    collection: '2026 Jersey Drop',
    description: 'Lightweight away jersey with breathable mesh texture and bold color blocking.',
    price: 76,
    rating: 4.8,
    colors: ['#1d4ed8', '#facc15', '#111827'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    image_url: jerseyBanner,
    stock: 54,
    is_worldcup: true,
  },
  {
    id: 'demo-5',
    name: 'Relaxed Denim Set',
    category: 'Fashion',
    collection: 'Weekend',
    description: 'Soft denim styling for casual daily outfits.',
    price: 68,
    rating: 4.6,
    colors: ['#1e3a8a', '#93c5fd'],
    sizes: ['S', 'M', 'L', 'XL'],
    image_url: fashionHero,
    stock: 36,
    is_worldcup: false,
  },
  {
    id: 'demo-6',
    name: 'Limited Goalkeeper Jersey',
    category: 'World Cup Jerseys',
    collection: '2026 Jersey Drop',
    description: 'A darker goalkeeper-style jersey for collectors and match-day streetwear.',
    price: 82,
    rating: 4.7,
    colors: ['#0f172a', '#22c55e', '#eab308'],
    sizes: ['M', 'L', 'XL'],
    image_url: jerseyBanner,
    stock: 24,
    is_worldcup: true,
  },
]

const orderSteps = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered']

const state = {
  products: fallbackProducts,
  activeCategory: 'All',
  cart: [],
  orders: [],
  adminOrders: [],
  adminStats: null,
  user: null,
  profile: null,
  view: 'shop',
  message: '',
  editingProduct: null,
  adminProducts: [],
}

function routeFromHash() {
  const route = window.location.hash.replace('#', '')
  return route || 'shop'
}

function go(view) {
  window.location.hash = view
}

function money(value) {
  // Bangladesh Taka currency
  return '৳' + Number(value || 0).toLocaleString('en-BD', { maximumFractionDigits: 0 })
}

function normalizedProduct(product) {
  return {
    ...product,
    colors: Array.isArray(product.colors) ? product.colors : [],
    sizes: Array.isArray(product.sizes) ? product.sizes : ['S', 'M', 'L', 'XL'],
    image_url: product.image_url || (product.is_worldcup ? jerseyBanner : fashionHero),
  }
}

function filteredProducts() {
  if (state.activeCategory === 'All') return state.products
  return state.products.filter((product) => product.category === state.activeCategory)
}

function cartTotal() {
  return state.cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
}

function cartCount() {
  return state.cart.reduce((sum, item) => sum + item.quantity, 0)
}

function setMessage(message) {
  state.message = message
  render()
}

async function loadSession() {
  if (!hasSupabaseConfig) return

  const {
    data: { session },
  } = await supabase.auth.getSession()

  state.user = session?.user || null
  await loadProfile()
}

async function loadProfile() {
  state.profile = null
  if (!hasSupabaseConfig || !state.user) return

  const { data, error } = await supabase.from('profiles').select('*').eq('id', state.user.id).maybeSingle()
  if (!error) state.profile = data
}

async function loadProducts() {
  if (!hasSupabaseConfig) return

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.warn('Product load failed. Using demo products.', error)
    return
  }

  if (data?.length) state.products = data.map(normalizedProduct)
}

async function loadCart() {
  if (!hasSupabaseConfig || !state.user) {
    state.cart = JSON.parse(localStorage.getItem('threadcup_cart') || '[]')
    return
  }

  let { data: cart, error } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', state.user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (!cart && !error) {
    const created = await supabase.from('carts').insert({ user_id: state.user.id }).select('id').single()
    cart = created.data
  }

  if (!cart) {
    state.cart = []
    return
  }

  const { data: items } = await supabase
    .from('cart_items')
    .select('id, product_id, quantity, size, color, products(*)')
    .eq('cart_id', cart.id)

  state.cart = (items || []).map((item) => ({
    cartItemId: item.id,
    ...normalizedProduct(item.products),
    id: item.product_id,
    quantity: item.quantity,
    size: item.size,
    color: item.color,
  }))
}

async function getActiveCartId() {
  if (!state.user) return null
  const { data: cart } = await supabase
    .from('carts')
    .select('id')
    .eq('user_id', state.user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (cart) return cart.id

  const { data: created } = await supabase.from('carts').insert({ user_id: state.user.id }).select('id').single()
  return created?.id || null
}

async function addToCart(productId) {
  const product = state.products.find((item) => item.id === productId)
  if (!product) return

  if (!hasSupabaseConfig || !state.user || String(productId).startsWith('demo-')) {
    const existing = state.cart.find((item) => item.id === productId)
    if (existing) existing.quantity += 1
    else state.cart.push({ ...product, quantity: 1, size: product.sizes?.[0] || 'M', color: product.colors?.[0] || '' })
    localStorage.setItem('threadcup_cart', JSON.stringify(state.cart))
    render()
    return
  }

  const cartId = await getActiveCartId()
  const existing = state.cart.find((item) => item.id === productId)

  if (existing?.cartItemId) {
    await supabase.from('cart_items').update({ quantity: existing.quantity + 1 }).eq('id', existing.cartItemId)
  } else {
    await supabase.from('cart_items').insert({
      cart_id: cartId,
      product_id: productId,
      quantity: 1,
      size: product.sizes?.[0] || 'M',
      color: product.colors?.[0] || '',
    })
  }

  await loadCart()
  render()
}

async function removeFromCart(item) {
  if (item.cartItemId && hasSupabaseConfig) {
    await supabase.from('cart_items').delete().eq('id', item.cartItemId)
  } else {
    state.cart = state.cart.filter((cartItem) => cartItem.id !== item.id)
    localStorage.setItem('threadcup_cart', JSON.stringify(state.cart))
  }

  await loadCart()
  render()
}

async function loadOrders() {
  state.orders = []
  if (!hasSupabaseConfig || !state.user) return

  const { data } = await supabase
    .from('orders')
    .select('*, order_events(*)')
    .eq('user_id', state.user.id)
    .order('created_at', { ascending: false })

  state.orders = data || []
}

async function loadAdminData() {
  state.adminOrders = []
  state.adminStats = null
  if (!hasSupabaseConfig || state.profile?.role !== 'admin') return

  const [ordersResult, productsResult, profilesResult] = await Promise.all([
    supabase.from('orders').select('*, order_events(*)').order('created_at', { ascending: false }).limit(20),
    supabase.from('products').select('id, stock, is_active'),
    supabase.from('profiles').select('id'),
  ])

  state.adminOrders = ordersResult.data || []
  const products = productsResult.data || []
  state.adminStats = {
    totalOrders: state.adminOrders.length,
    pendingOrders: state.adminOrders.filter((order) => order.order_status === 'pending' || order.status === 'pending').length,
    totalProducts: products.length,
    lowStock: products.filter((product) => product.stock <= 5).length,
    totalCustomers: profilesResult.data?.length || 0,
  }

  await loadAdminProducts()
}

async function submitAuth(event) {
  event.preventDefault()
  if (!hasSupabaseConfig) {
    setMessage('Add your Supabase URL and anon key in .env first.')
    return
  }

  const form = event.currentTarget
  const formData = new FormData(form)
  const mode = formData.get('mode')
  const email = formData.get('email')
  const password = formData.get('password')
  const fullName = formData.get('full_name')

  const result =
    mode === 'register'
      ? await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } })
      : await supabase.auth.signInWithPassword({ email, password })

  if (result.error) {
    setMessage(result.error.message)
    return
  }

  await loadSession()
  await loadCart()
  await loadOrders()
  await loadAdminData()
  state.message = mode === 'register' ? 'Account created. Check email confirmation settings if login is blocked.' : 'Signed in.'
  go('account')
}

async function signOut() {
  if (hasSupabaseConfig) await supabase.auth.signOut()
  state.user = null
  state.profile = null
  state.orders = []
  state.adminOrders = []
  state.message = 'Signed out.'
  await loadCart()
  go('shop')
}

async function updateProfile(event) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  const payload = {
    full_name: formData.get('full_name'),
    phone: formData.get('phone'),
  }

  const { error } = await supabase.from('profiles').update(payload).eq('id', state.user.id)
  if (error) {
    setMessage(error.message)
    return
  }

  await loadProfile()
  setMessage('Profile updated.')
}

async function submitOrder(event) {
  event.preventDefault()

  if (!state.cart.length) {
    setMessage('Add at least one item before checkout.')
    return
  }

  if (!hasSupabaseConfig || !state.user) {
    setMessage('Sign in before placing a real order.')
    go('auth')
    return
  }

  const formData = new FormData(event.currentTarget)
  const items = state.cart.map(({ id, name, price, quantity, size, color }) => ({
    id,
    name,
    price: Number(price),
    quantity,
    size,
    color,
  }))

  const payload = {
    user_id: state.user.id,
    customer_name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    shipping_address: {
      city: formData.get('city'),
      address_line: formData.get('address_line'),
      zip_code: formData.get('zip_code'),
      country: 'Bangladesh',
    },
    total_amount: cartTotal(),
    payment_status: 'pending', // Cash on Delivery - payment pending until delivery
    payment_method: 'cash_on_delivery',
    order_status: 'pending',
    status: 'pending',
    items,
  }

  const { data: order, error } = await supabase.from('orders').insert(payload).select('id').single()
  if (error) {
    setMessage(`Order could not be saved: ${error.message}`)
    return
  }

  await supabase.from('order_events').insert({
    order_id: order.id,
    status: 'pending',
    note: 'Order received from customer checkout. Payment: Cash on Delivery',
  })

  for (const item of state.cart) {
    if (item.cartItemId) await supabase.from('cart_items').delete().eq('id', item.cartItemId)
  }

  state.cart = []
  localStorage.removeItem('threadcup_cart')
  await loadCart()
  await loadOrders()
  setMessage('✓ Order placed successfully! We will contact you soon for payment.')
  go('orders')
}

async function submitNewsletter(event) {
  event.preventDefault()
  const email = new FormData(event.currentTarget).get('email')
  if (hasSupabaseConfig) await supabase.from('newsletter_signups').insert({ email })
  event.currentTarget.reset()
  setMessage('You are on the drop list.')
}

async function updateOrderStatus(orderId, status) {
  const { error } = await supabase.from('orders').update({ order_status: status, status }).eq('id', orderId)
  if (error) {
    setMessage(error.message)
    return
  }

  await supabase.from('order_events').insert({
    order_id: orderId,
    status,
    note: `Admin updated order to ${status}.`,
  })

  await loadAdminData()
  setMessage('Order progress updated.')
}

async function loadAdminProducts() {
  if (!hasSupabaseConfig || state.profile?.role !== 'admin') return
  
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (!error) state.adminProducts = data || []
}

async function updateProductPrice(productId, newPrice) {
  if (!hasSupabaseConfig || state.profile?.role !== 'admin') {
    setMessage('Admin access required.')
    return
  }

  const { error } = await supabase
    .from('products')
    .update({ price: Number(newPrice) })
    .eq('id', productId)
  
  if (error) {
    setMessage(`Error updating price: ${error.message}`)
    return
  }

  await loadAdminProducts()
  await loadProducts()
  render()
  setMessage('Price updated successfully.')
}

async function updateProductImage(productId, imageUrl) {
  if (!hasSupabaseConfig || state.profile?.role !== 'admin') {
    setMessage('Admin access required.')
    return
  }

  const { error } = await supabase
    .from('products')
    .update({ image_url: imageUrl })
    .eq('id', productId)
  
  if (error) {
    setMessage(`Error updating image: ${error.message}`)
    return
  }

  await loadAdminProducts()
  await loadProducts()
  render()
  setMessage('Product image updated successfully.')
}

function headerTemplate() {
  const isAdmin = state.profile?.role === 'admin'
  return `
    <header class="site-header">
      <a class="brand" href="#shop" aria-label="ThreadCup home">
        <span>TC</span>
        ThreadCup
      </a>
      <nav data-nav>
        <a href="#shop">Shop</a>
        <a href="#checkout">Cart</a>
        <a href="#orders">Orders</a>
        <a href="#account">Account</a>
        ${isAdmin ? '<a href="#admin">Admin</a>' : ''}
      </nav>
      <div class="header-actions">
        <button type="button" aria-label="Search">${renderIcon('search')}</button>
        <button type="button" class="cart-pill" data-go="checkout" aria-label="Cart">
          ${renderIcon('shopping-bag')}
          <span>${cartCount()}</span>
        </button>
        ${
          state.user
            ? `<button type="button" data-sign-out aria-label="Sign out">${renderIcon('log-out')}</button>`
            : `<button type="button" data-go="auth" aria-label="Sign in">${renderIcon('log-in')}</button>`
        }
        <button type="button" class="menu-button" data-menu aria-label="Menu">${renderIcon('menu')}</button>
      </div>
    </header>
  `
}

function productGridTemplate() {
  return filteredProducts()
    .map(
      (product) => `
        <article class="product-card">
          <img src="${product.image_url}" alt="${product.name}">
          <div class="product-content">
            <div class="product-meta">
              <span>${product.collection}</span>
              <span>${renderIcon('star')}${product.rating}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description || 'Premium fashion item for your store collection.'}</p>
            <div class="swatches" aria-label="Available colors">
              ${product.colors.map((color) => `<span style="--swatch:${color}"></span>`).join('')}
            </div>
            <div class="stock-row">
              <span>Stock: ${product.stock ?? 'Ready'}</span>
              <span>Sizes: ${(product.sizes || []).join(', ')}</span>
            </div>
            <div class="product-actions">
              <strong>${money(product.price)}</strong>
              <button type="button" data-add="${product.id}">
                ${renderIcon('shopping-bag')}
                Add
              </button>
            </div>
          </div>
        </article>
      `,
    )
    .join('')
}

function shopTemplate() {
  return `
    <main id="top">
      <section class="hero-section">
        <img src="${fashionHero}" alt="Fashion boutique with clothing and jersey display">
        <div class="hero-copy">
          <span class="eyebrow">${renderIcon('sparkles')} Live fashion business system</span>
          <h1>Clothing Fashion And World Cup Jerseys</h1>
          <p>Shop products, sign in as a customer, place orders, track progress, and manage business operations from the admin dashboard.</p>
          <div class="hero-actions">
            <a href="#shop">Shop collection</a>
            <a href="#auth">Customer login</a>
          </div>
        </div>
      </section>

      <section class="stats-band" aria-label="Store highlights">
        <div><strong>${state.products.length}</strong><span>Active products</span></div>
        <div><strong>${state.products.filter((item) => item.is_worldcup).length}</strong><span>Jersey options</span></div>
        <div><strong>${hasSupabaseConfig ? 'Live' : 'Demo'}</strong><span>Supabase mode</span></div>
      </section>

      <section class="section-shell split-feature" id="jerseys">
        <div>
          <span class="eyebrow">${renderIcon('trophy')} Jersey option</span>
          <h2>World Cup kits built for fans and street styling.</h2>
          <p>Use the admin dashboard to add jersey variants, update stock, and move orders from pending to delivered.</p>
        </div>
        <img src="${jerseyBanner}" alt="World Cup football jerseys displayed in a retail scene">
      </section>

      <section class="section-shell">
        <div class="section-heading">
          <div>
            <span class="eyebrow">${renderIcon('shirt')} Collection</span>
            <h2>Latest drops</h2>
          </div>
          <div class="filters" aria-label="Product filters">
            <button type="button" class="${state.activeCategory === 'All' ? 'is-active' : ''}" data-category="All">All</button>
            <button type="button" class="${state.activeCategory === 'Fashion' ? 'is-active' : ''}" data-category="Fashion">Fashion</button>
            <button type="button" class="${state.activeCategory === 'World Cup Jerseys' ? 'is-active' : ''}" data-category="World Cup Jerseys">Jerseys</button>
          </div>
        </div>
        <div class="product-grid">${productGridTemplate()}</div>
      </section>

      ${newsletterTemplate()}
    </main>
  `
}

function authTemplate() {
  return `
    <main class="portal-layout">
      <section class="auth-panel">
        <div>
          <span class="eyebrow">${renderIcon('user')} Customer access</span>
          <h1>Sign in or create your profile.</h1>
          <p>Customers can save carts, place orders, and track progress. Admins use the same login and get dashboard access by role.</p>
        </div>
        <form class="stack-form" data-auth-form>
          <label>
            Mode
            <select name="mode">
              <option value="login">Login</option>
              <option value="register">Register</option>
            </select>
          </label>
          <label>
            Full name
            <input name="full_name" type="text" placeholder="Only needed for register">
          </label>
          <label>
            Email
            <input name="email" type="email" required placeholder="you@example.com">
          </label>
          <label>
            Password
            <input name="password" type="password" required minlength="6" placeholder="At least 6 characters">
          </label>
          <button type="submit">Continue</button>
        </form>
      </section>
    </main>
  `
}

function checkoutTemplate() {
  const profile = state.profile || {}
  const totalPrice = cartTotal()
  return `
    <main class="checkout-section page-checkout">
      <div class="cart-panel">
        <h2>${renderIcon('shopping-bag')}Order Summary</h2>
        ${
          state.cart.length
            ? state.cart
                .map(
                  (item) => `
                    <div class="cart-item">
                      <div>
                        <strong>${item.name}</strong>
                        <span>${item.quantity} × ${money(item.price)}</span>
                        ${item.size ? `<span style="color:rgba(255,255,255,0.6);font-size:0.8rem">Size: ${item.size}</span>` : ''}
                      </div>
                      <button type="button" aria-label="Remove ${item.name}" data-remove="${item.id}" title="Remove item">
                        ${renderIcon('x')}
                      </button>
                    </div>
                  `,
                )
                .join('')
            : '<p class="empty-cart">Your cart is ready for a fresh fit.</p>'
        }
        <div class="cart-total">
          <span>Subtotal</span>
          <strong>${money(totalPrice)}</strong>
        </div>
        <div style="padding:12px;border-radius:6px;background:rgba(34,197,94,0.1);margin-top:12px;border:1px solid rgba(34,197,94,0.3)">
          <div style="color:rgba(255,255,255,0.9);font-size:0.9rem;display:flex;align-items:center;gap:8px">
            ${renderIcon('truck')}
            <span><strong>Cash on Delivery</strong> - Pay when delivered</span>
          </div>
        </div>
      </div>
      <form class="checkout-form" data-order-form>
        <h2>Delivery Details</h2>
        <label>Full Name<input name="name" type="text" value="${profile.full_name || ''}" placeholder="Your full name" required></label>
        <label>Email<input name="email" type="email" value="${profile.email || state.user?.email || ''}" placeholder="your@email.com" required></label>
        <label>Phone Number<input name="phone" type="tel" value="${profile.phone || ''}" placeholder="+880-17XX-XXXXXX or 01X-XXXXXX" pattern="^[+]?[0-9]{11,14}$" required title="Enter a valid Bangladesh phone number"></label>
        <label>City<select name="city" required>
          <option value="">Select City</option>
          <option value="Dhaka">Dhaka</option>
          <option value="Chittagong">Chittagong</option>
          <option value="Sylhet">Sylhet</option>
          <option value="Khulna">Khulna</option>
          <option value="Rajshahi">Rajshahi</option>
          <option value="Barisal">Barisal</option>
          <option value="Rangpur">Rangpur</option>
          <option value="Mymensingh">Mymensingh</option>
          <option value="Other">Other</option>
        </select></label>
        <label>Detailed Address<input name="address_line" type="text" placeholder="House/Apartment no, Road, Area" required></label>
        <label>Postal Code (Optional)<input name="zip_code" type="text" placeholder="Postal/ZIP code"></label>
        <div style="padding:12px;border-radius:6px;background:rgba(255,255,255,0.08);margin:12px 0">
          <strong style="font-size:0.9rem">Delivery Details:</strong>
          <p style="color:rgba(255,255,255,0.7);font-size:0.85rem;margin:8px 0 0 0">We will deliver your order within 2-3 business days. A representative will contact you to confirm the delivery time.</p>
        </div>
        <button type="submit">Place Order (${money(totalPrice)})</button>
        <p class="form-status" style="text-align:center;margin-top:12px;color:rgba(255,255,255,0.6);font-size:0.85rem">Secure checkout • COD payment</p>
      </form>
    </main>
  `
}

function accountTemplate() {
  if (!state.user) return authTemplate()
  const profile = state.profile || {}
  return `
    <main class="portal-layout">
      <section class="dashboard-shell">
        <div class="section-heading">
          <div>
            <span class="eyebrow">${renderIcon('user')} Customer profile</span>
            <h1>${profile.full_name || state.user.email}</h1>
            <p>Role: <strong>${profile.role || 'customer'}</strong></p>
          </div>
          ${profile.role === 'admin' ? `<button type="button" data-go="admin">Open admin dashboard</button>` : ''}
        </div>
        <form class="stack-form light-form" data-profile-form>
          <label>Full name<input name="full_name" type="text" value="${profile.full_name || ''}" required></label>
          <label>Phone<input name="phone" type="tel" value="${profile.phone || ''}" placeholder="+880..."></label>
          <button type="submit">Save profile</button>
        </form>
      </section>
    </main>
  `
}

function orderProgressTemplate(order) {
  const status = order.order_status || order.status || 'pending'
  const activeIndex = Math.max(orderSteps.indexOf(status), 0)
  return `
    <div class="progress-line">
      ${orderSteps
        .map((step, index) => `<span class="${index <= activeIndex ? 'is-done' : ''}">${step}</span>`)
        .join('')}
    </div>
  `
}

function ordersTemplate() {
  if (!state.user) return authTemplate()
  return `
    <main class="portal-layout">
      <section class="dashboard-shell">
        <div class="section-heading">
          <div>
            <span class="eyebrow">${renderIcon('package-check')} Customer orders</span>
            <h1>My orders</h1>
          </div>
          <button type="button" data-refresh-orders>Refresh</button>
        </div>
        <div class="order-list">
          ${
            state.orders.length
              ? state.orders
                  .map(
                    (order) => `
                      <article class="order-card">
                        <div>
                          <strong>Order ${order.id.slice(0, 8)}</strong>
                          <span>${new Date(order.created_at).toLocaleString()}</span>
                        </div>
                        <strong>${money(order.total_amount)}</strong>
                        ${orderProgressTemplate(order)}
                      </article>
                    `,
                  )
                  .join('')
              : '<p>No orders yet. Add products to cart and place your first order.</p>'
          }
        </div>
      </section>
    </main>
  `
}

function adminTemplate() {
  if (!state.user) return authTemplate()
  if (state.profile?.role !== 'admin') {
    return `
      <main class="portal-layout">
        <section class="dashboard-shell">
          <h1>Admin access required</h1>
          <p>Your current profile role is <strong>${state.profile?.role || 'customer'}</strong>. Set your profile role to admin in Supabase to use this dashboard.</p>
        </section>
      </main>
    `
  }

  const stats = state.adminStats || {}
  const showProducts = state.view === 'admin-products'
  
  return `
    <main class="portal-layout admin-layout">
      <section class="dashboard-shell">
        <div class="section-heading">
          <div>
            <span class="eyebrow"><i data-lucide="layout-dashboard"></i> Admin dashboard</span>
            <h1>Business control center</h1>
          </div>
          <div style="display:flex;gap:8px">
            <button type="button" data-admin-view="orders" style="background:${!showProducts ? 'var(--green)' : 'transparent'};color:${!showProducts ? 'white' : 'var(--muted)'}">Orders</button>
            <button type="button" data-admin-view="products" style="background:${showProducts ? 'var(--green)' : 'transparent'};color:${showProducts ? 'white' : 'var(--muted)'}">Products</button>
            <button type="button" data-refresh-admin>Refresh</button>
          </div>
        </div>
        
        ${!showProducts ? `
          <div class="admin-stats">
            <div><strong>${stats.totalOrders || 0}</strong><span>Total orders</span></div>
            <div><strong>${stats.pendingOrders || 0}</strong><span>Pending orders</span></div>
            <div><strong>${stats.totalProducts || 0}</strong><span>Products</span></div>
            <div><strong>${stats.lowStock || 0}</strong><span>Low stock</span></div>
            <div><strong>${stats.totalCustomers || 0}</strong><span>Customers</span></div>
          </div>
          <div class="admin-table">
            <h2>${renderIcon('package-check')} Recent Orders</h2>
            ${
              state.adminOrders.length
                ? state.adminOrders
                    .map(
                      (order) => `
                        <article class="admin-row">
                          <div>
                            <strong>${order.customer_name}</strong>
                            <span>${order.email} - ${money(order.total_amount)}</span>
                            <span style="color:rgba(0,0,0,0.5);font-size:0.85rem">Payment: ${order.payment_method === 'cash_on_delivery' ? '💵 COD' : order.payment_status}</span>
                          </div>
                          <select data-order-status="${order.id}">
                            ${orderSteps
                              .map(
                                (step) =>
                                  `<option value="${step}" ${
                                    (order.order_status || order.status) === step ? 'selected' : ''
                                  }>${step}</option>`,
                              )
                              .join('')}
                          </select>
                        </article>
                      `,
                    )
                    .join('')
                : '<p>No orders available yet.</p>'
            }
          </div>
        ` : `
          <div class="admin-table">
            <h2 style="display:flex;align-items:center;gap:10px">${renderIcon('shirt')}Manage Products</h2>
            <p style="color:var(--muted);margin-bottom:20px">Edit product prices and images to keep your store up-to-date.</p>
            ${
              state.adminProducts.length
                ? state.adminProducts
                    .map(
                      (product) => `
                        <article class="admin-row" style="grid-template-columns:1fr 200px;gap:16px">
                          <div style="display:grid;gap:12px">
                            <div style="display:flex;gap:12px;align-items:start">
                              <img src="${product.image_url || fashionHero}" style="width:60px;height:60px;border-radius:6px;object-fit:cover" alt="${product.name}">
                              <div>
                                <strong>${product.name}</strong>
                                <span style="display:block;margin-top:4px">Stock: ${product.stock || 0}</span>
                              </div>
                            </div>
                          </div>
                          <div style="display:grid;gap:8px">
                            <div style="display:flex;align-items:center;gap:8px">
                              <span style="color:var(--muted);width:60px">Price:</span>
                              <input type="number" data-price-input="${product.id}" value="${product.price}" min="0" style="width:100px;padding:6px;border:1px solid var(--line);border-radius:4px" placeholder="Price">
                            </div>
                            <button type="button" data-save-price="${product.id}" style="padding:6px 12px;background:var(--green);color:white;border:0;border-radius:4px;cursor:pointer;font-size:0.9rem">
                              ${renderIcon('save')}Update
                            </button>
                          </div>
                        </article>
                      `,
                    )
                    .join('')
                : '<p>No products available yet.</p>'
            }
          </div>
        `}
      </section>
    </main>
  `
}

function newsletterTemplate() {
  return `
    <section class="newsletter-band">
      <div>
        <h2>Get the next jersey drop first.</h2>
        <p>Collect customer emails in Supabase and announce new fashion arrivals or tournament jersey releases.</p>
      </div>
      <form data-newsletter-form>
        <input name="email" type="email" placeholder="Email address" required>
        <button type="submit">Join</button>
      </form>
    </section>
  `
}

function viewTemplate() {
  if (state.view === 'auth') return authTemplate()
  if (state.view === 'account') return accountTemplate()
  if (state.view === 'checkout') return checkoutTemplate()
  if (state.view === 'orders') return ordersTemplate()
  if (state.view === 'admin') return adminTemplate()
  return shopTemplate()
}

function bindEvents() {
  document.querySelector('[data-menu]')?.addEventListener('click', () => {
    document.querySelector('[data-nav]')?.classList.toggle('is-open')
  })

  document.querySelectorAll('[data-go]').forEach((button) => {
    button.addEventListener('click', () => go(button.dataset.go))
  })

  document.querySelector('[data-sign-out]')?.addEventListener('click', signOut)
  document.querySelector('[data-auth-form]')?.addEventListener('submit', submitAuth)
  document.querySelector('[data-profile-form]')?.addEventListener('submit', updateProfile)
  document.querySelector('[data-order-form]')?.addEventListener('submit', submitOrder)
  document.querySelector('[data-newsletter-form]')?.addEventListener('submit', submitNewsletter)

  document.querySelectorAll('[data-category]').forEach((button) => {
    button.addEventListener('click', () => {
      state.activeCategory = button.dataset.category
      render()
    })
  })

  document.querySelectorAll('[data-add]').forEach((button) => {
    button.addEventListener('click', () => addToCart(button.dataset.add))
  })

  document.querySelectorAll('[data-remove]').forEach((button) => {
    const item = state.cart.find((cartItem) => cartItem.id === button.dataset.remove)
    button.addEventListener('click', () => removeFromCart(item))
  })

  document.querySelector('[data-refresh-orders]')?.addEventListener('click', async () => {
    await loadOrders()
    render()
  })

  document.querySelector('[data-refresh-admin]')?.addEventListener('click', async () => {
    await loadAdminData()
    render()
  })

  document.querySelectorAll('[data-order-status]').forEach((select) => {
    select.addEventListener('change', () => updateOrderStatus(select.dataset.orderStatus, select.value))
  })

  document.querySelectorAll('[data-admin-view]').forEach((button) => {
    button.addEventListener('click', async () => {
      if (button.dataset.adminView === 'products') {
        await loadAdminProducts()
        state.view = 'admin'
      }
      render()
    })
  })

  document.querySelectorAll('[data-save-price]').forEach((button) => {
    button.addEventListener('click', async () => {
      const productId = button.dataset.savePrice
      const priceInput = document.querySelector(`[data-price-input="${productId}"]`)
      const newPrice = priceInput?.value
      
      if (!newPrice || isNaN(newPrice)) {
        setMessage('Please enter a valid price.')
        return
      }

      button.disabled = true
      button.textContent = 'Updating...'
      await updateProductPrice(productId, newPrice)
      button.disabled = false
      button.innerHTML = '<i data-lucide="save" style="width:16px;height:16px;margin-right:4px;display:inline;vertical-align:-2px"></i>Update'
      createIcons()
    })
  })
}

function render() {
  document.querySelector('#app').innerHTML = `
    ${headerTemplate()}
    ${state.message ? `<div class="toast-message">${state.message}</div>` : ''}
    ${viewTemplate()}
  `
  bindEvents()
}

async function refreshForRoute() {
  state.view = routeFromHash()
  if (state.view === 'orders') await loadOrders()
  if (state.view === 'admin') await loadAdminData()
  render()
}

window.addEventListener('hashchange', refreshForRoute)

if (hasSupabaseConfig) {
  supabase.auth.onAuthStateChange(async (_event, session) => {
    state.user = session?.user || null
    await loadProfile()
    await loadCart()
    await loadOrders()
    await loadAdminData()
    render()
  })
}

await loadSession()
await loadProducts()
await loadCart()
await loadOrders()
await loadAdminData()
state.view = routeFromHash()
render()
