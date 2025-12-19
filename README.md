# Online Grocery Shop (HTML/CSS/JS, Node, MongoDB)

A full-stack online grocery shop with multiple pages, cart functionality, search, categories, order management, and attractive animations.

## Features
- **Home Page**: Attractive offers and welcome section with animations
- **Products Page**: Product catalog with images, prices, weights (kg), search, filter by category, add to cart
- **Cart Page**: View cart items with images, weights, remove items, proceed to order
- **Order Page**: Customer details form, order summary with images and weights, place order
- Shopping cart with local storage persistence across pages
- Order placement with full customer details
- Admin panel to add products with weight (Ctrl+A in Products page)
- Responsive design with smooth animations (fade-in, slide-in, bounce, pulse)
- User-friendly interface with hover effects and transitions

## Pages
- `index.html`: Home page with offers
- `products.html`: Product listing and admin add product
- `cart.html`: Shopping cart
- `order.html`: Order placement

## Product Features
- Images for each product
- Weight display (e.g., 1kg, 500g)
- Category filtering
- Search functionality
- Add to cart with quantity

## Animations
- Header slide-in animations
- Hero and offers fade-in
- Product cards hover effects
- Cart items slide-in
- Buttons with bounce and pulse effects
- Form elements with smooth transitions

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Start MongoDB locally (or set `MONGO_URI` in `.env`)

3. Run server:

```bash
npm run dev
```

4. Run client (in another terminal):

```bash
npx http-server public -p 5500 -c-1
```

Open http://localhost:5500

## Adding Products
- Go to Products page
- Press Ctrl+A to show admin form
- Fill in details including weight (e.g., "1kg", "500g")
- Add image URL or use placeholder
