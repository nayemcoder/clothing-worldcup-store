# ThreadCup Clothing And World Cup Jersey Store

A Vite JavaScript storefront for clothing fashion and new World Cup football jersey options. **Now with professional Bangladesh-focused features, Cash on Delivery payment, and admin product management.**

It includes a polished responsive website, local demo product data, Supabase integration, and a ready-to-run database schema.

## ✨ What's New (Professional Edition)

### 🇧🇩 Bangladesh Localization
- **Bangladeshi Taka (৳) Currency**: All prices displayed in BDT
- **BD-Specific Checkout Form**: City dropdown with major Bangladesh cities (Dhaka, Chittagong, Sylhet, Khulna, Rajshahi, Barisal, Rangpur, Mymensingh)
- **Bangladesh Phone Number Validation**: Form validates phone numbers for Bangladesh
- **Postal Code Support**: Additional field for ZIP/postal codes
- **Delivery Information**: Displays expected delivery time (2-3 business days)

### 💵 Cash on Delivery (COD) Payment
- **COD as Default Payment Method**: No online payment processing required
- **Pending Payment Status**: Orders are marked as "pending" until delivery
- **Professional COD Badge**: Visual indicator showing "Cash on Delivery - Pay when delivered"
- **Payment Status Tracking**: Admin dashboard shows payment method for each order
- **Customer Confirmation**: Success message confirms COD payment terms

### 📊 Admin Product Management
- **Product Price Editing**: Admins can update product prices from the admin dashboard
- **Products Tab**: New dedicated "Products" tab in admin panel
- **Real-Time Updates**: Price changes immediately reflect on the storefront
- **Product Thumbnails**: Display product images in the management interface
- **Stock Monitoring**: View current stock levels for each product

### 🎨 Professional UI & Icons
- **Professional Icons**: Added 10+ new lucide icons throughout the app:
  - Shopping bag, truck (delivery), edit, save, upload, plus, trash, alert, check
- **Enhanced Admin Dashboard**: Two-tab interface (Orders & Products)
- **Better Form Styling**: Professional input fields and selects for Bangladesh context
- **Toast Notifications**: Slide-up animations for user feedback
- **Improved Buttons**: Hover effects and visual feedback
- **Consistent Branding**: Professional color scheme and typography

## What Is Included

- Vite vanilla JavaScript app
- Fashion and World Cup jersey product catalog
- Product category filters
- Shopping cart UI
- Customer signup/login with Supabase Auth
- Customer profile page
- Persistent cart for logged-in customers
- Checkout form that saves orders to Supabase
- Customer order tracking page
- Admin dashboard for order progress and business stats
- Newsletter form that saves emails to Supabase when configured
- Generated project assets in `src/assets`
- Supabase SQL schema in `supabase/schema.sql`
- Full business SQL setup in `supabase/business-system.sql`
- `.env.example` for Supabase keys

## 1. Install The Project

```bash
cd clothing-worldcup-store
npm install
```

On Windows PowerShell, if `npm` is blocked by execution policy, use:

```bash
npm.cmd install
```

## 2. Run The Website Locally

```bash
npm run dev
```

PowerShell alternative:

```bash
npm.cmd run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

The website works immediately with demo data. Supabase is only required when you want real database saving.

## 3. Create Supabase Project

1. Go to `https://supabase.com`.
2. Create a new project.
3. Open the project dashboard.
4. Go to `SQL Editor`.
5. Open `supabase/business-system.sql` from this project.
6. Paste the full SQL into Supabase and run it.

This creates:

- `profiles`
- `products`
- `carts`
- `cart_items`
- `orders`
- `order_events`
- `addresses`
- `newsletter_signups`
- customer/admin profile roles
- RLS policies for customers and admins
- sample clothing and jersey products

## 4. Connect Vite To Supabase

Create a new file named `.env` in the project root:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Then edit `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-public-anon-key
```

Find these values in Supabase:

1. Open your Supabase project.
2. Go to `Project Settings`.
3. Go to `API`.
4. Copy `Project URL` into `VITE_SUPABASE_URL`.
5. Copy the public `anon` key into `VITE_SUPABASE_ANON_KEY`.

Restart the Vite dev server after changing `.env`.

## 5. Product Images In Supabase

The seed products work without remote images because the app falls back to local assets. To use uploaded Supabase images:

1. Go to Supabase `Storage`.
2. Create a bucket named `product-images`.
3. Upload product images.
4. Copy each public image URL.
5. Update the `image_url` field in the `products` table.

Example SQL:

```sql
update public.products
set image_url = 'https://your-project-ref.supabase.co/storage/v1/object/public/product-images/jersey-home.png'
where name = 'World Cup Home Jersey';
```

## 6. Create Your First Admin

1. Open the website.
2. Go to `Account`.
3. Register your email and password.
4. In Supabase SQL Editor, run:

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

5. Sign out and sign back in.
6. Open `Admin` in the website navigation.

## 7. Add More Products

```sql
insert into public.products
  (name, category, collection, description, price, rating, colors, sizes, stock, is_featured, is_worldcup)
values
  (
    'Premium Match-Day Jersey',
    'World Cup Jerseys',
    '2026 Jersey Drop',
    'A breathable jersey option for football fans.',
    79,
    4.8,
    array['#ffffff', '#0f8a5f', '#c92a2a'],
    array['S', 'M', 'L', 'XL'],
    40,
    true,
    true
  );
```

## 7. Admin Product Management (NEW)

### Accessing Product Management
1. Log in as admin
2. Click **Admin** in navigation
3. Click **Products** tab (next to Orders)

### Updating Product Prices
1. Find the product in the list
2. Enter the new price in the price field
3. Click **Update** button
4. Price updates immediately on the storefront

### Using Cash on Delivery
- All orders automatically use COD payment method
- Orders show as "pending" payment status until delivery
- Admin can track payment method in order list
- Customers see "💵 COD - Pay when delivered" message on checkout

### Bangladesh-Specific Features
- **Currency**: All prices shown in ৳ (Bangladeshi Taka)
- **Cities**: Checkout form includes major BD cities
- **Delivery**: Default 2-3 business days delivery time
- **Phone Format**: Validates +880 or 01X phone numbers

## 8. Customer Flow

1. Customer registers or logs in.
2. Customer adds products to cart.
3. Cart saves in Supabase when logged in.
4. Customer goes to checkout.
5. Order saves in `orders` with **COD payment method**.
6. First progress event saves in `order_events` with "Cash on Delivery" note.
7. Customer tracks order from `Orders`.
8. Admin contacts customer to confirm delivery time and payment.

## 9. Admin Flow

1. Admin logs in.
2. Admin opens `Admin`.
3. Admin can switch between **Orders** and **Products** tabs.
4. **Orders Tab**: See total orders, pending orders, products, low stock, and customers.
5. **Products Tab**: Edit product prices and update stock information.
6. Admin changes order status:
   - `pending`
   - `confirmed`
   - `processing`
   - `packed`
   - `shipped`
   - `delivered`
7. Customer sees the progress update on their order page.

## 10. Build For Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Deploy the project to Vercel, Netlify, Cloudflare Pages, or Supabase Hosting. Add the same two environment variables in the deployment dashboard.

## Project Structure

```text
clothing-worldcup-store/
  src/
    assets/
      fashion-hero.png
      jersey-banner.png
    main.js
    style.css
    supabaseClient.js
  supabase/
    schema.sql
  .env.example
  index.html
  package.json
```

## Important Notes

- Do not put Supabase service-role keys in Vite. Use only the public anon key.
- The included Row Level Security policies allow public product reads and public order/newsletter inserts.
- **Cash on Delivery**: All orders use COD payment. No payment gateway integration required.
- **Admin Product Management**: Admins can update prices from the dashboard in real-time.
- **Bangladesh Localization**: Currency (৳), cities, and phone validation are pre-configured for Bangladesh.
- For additional features, consider: payment gateway integration, SMS notifications, email receipts, advanced inventory management, and shipping rate calculation.
