# Women's Jeans E-Commerce Website

A professional e-commerce website for women's clothing, specializing in jeans and different styles.

## Project Overview

This is a complete e-commerce platform built with React, TypeScript, Vite, and Tailwind CSS. The website allows customers to browse, select, and order women's jeans across various styles with a modern, responsive design.

## Features

### Product Management
- **15 Product Listings**: Pre-loaded with 15 different jean styles across 5 categories
- **Product Categories**: Skinny, Straight, Bootcut, Wide Leg, and Boyfriend jeans
- **Product Details**: Each product includes photos, price, discount pricing, stock status, sizes (XS-XL)
- **Featured & Best Sellers**: Special badges for featured products and best sellers
- **Stock Management**: Visual indicators for in-stock and out-of-stock items

### Shopping Experience
- **Homepage**: Welcome page with featured products, best sellers, and category previews
- **Shop Page**: Complete product catalog with filtering by category and stock status
- **Category Pages**: Dedicated pages for each jean style
- **Product Detail Pages**: Full product information with size selection and quantity controls
- **Shopping Cart**: Add to cart, quantity management, remove items, clear cart functionality
- **Checkout System**: Customer details form with validation (name, address, phone)
- **Order Confirmation**: Detailed order summary after successful checkout

### Additional Pages
- **Categories Page**: Visual overview of all jean styles with descriptions
- **Contact Page**: Contact form with business information (email, phone, address)

### Design & UX
- **Modern Design**: Clean, feminine design with gradient accents (rose, pink, purple tones)
- **Fully Responsive**: Mobile-first design that works on all devices
- **Interactive Elements**: Hover effects, smooth transitions, loading states
- **Professional Layout**: Grid-based layouts, card components, sticky header
- **Visual Feedback**: Toast notifications, badges, icons for better UX

## Technology Stack

### Core Framework
- **React**: 18.3.1 - Component-based UI library
- **TypeScript**: 5.8.3 - Type-safe development
- **Vite**: 7.0.0 - Fast build tool and dev server
- **React Router DOM**: 6.30.1 - Client-side routing

### State Management
- **Zustand**: 4.4.7 - Lightweight state management for shopping cart

### Styling
- **Tailwind CSS**: 3.4.17 - Utility-first CSS framework
- **Lucide React**: Icon library for UI elements

### Images
- **Pixabay**: High-quality stock images for product photos

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header with cart icon
│   ├── Footer.tsx      # Site footer with links and contact info
│   └── ProductCard.tsx # Product display card component
├── pages/              # Page components
│   ├── HomePage.tsx           # Landing page
│   ├── ShopPage.tsx           # All products with filters
│   ├── CategoriesPage.tsx     # Category overview
│   ├── CategoryPage.tsx       # Single category products
│   ├── ProductDetailPage.tsx  # Individual product page
│   ├── CartPage.tsx           # Shopping cart
│   ├── CheckoutPage.tsx       # Order form
│   ├── OrderConfirmationPage.tsx # Order success
│   └── ContactPage.tsx        # Contact form
├── store/              # State management
│   └── useCartStore.ts # Shopping cart Zustand store
├── types/              # TypeScript types
│   └── Product.ts     # Product, CartItem, Order interfaces
├── data/               # Static data
│   └── products.ts    # Product catalog (15 pre-loaded products)
└── App.tsx            # Main app with routing
```

## Development Commands

- **Install dependencies**: `npm install`
- **Build project**: `npm run build`
- **Development server**: `npm run dev` (for local development only)

## Key Features for Store Management

### Easy Product Updates
Products are managed in `src/data/products.ts`. To add or modify products:

1. **Add New Product**: Add a new object to the `products` array
2. **Update Pricing**: Modify `price` and `discountPrice` fields
3. **Stock Status**: Toggle `inStock` boolean
4. **Product Images**: Replace image URLs in the `images` array
5. **Categories**: Choose from: 'skinny', 'straight', 'bootcut', 'wide-leg', 'boyfriend'

Example:
```typescript
{
  id: 'unique-id',
  name: 'Product Name',
  category: 'skinny',
  description: 'Product description',
  price: 99.99,
  discountPrice: 79.99, // Optional
  inStock: true,
  images: ['image-url'],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  featured: true,      // Optional
  bestSeller: true     // Optional
}
```

### Order Processing
- Orders are stored in browser localStorage temporarily
- Order data includes: customer details, items, quantities, total amount
- Access order history through browser's localStorage inspector

## Design System

### Color Palette
- **Primary**: Rose/Pink gradients (rose-500, pink-600)
- **Secondary**: Purple/Indigo for accents
- **Categories**: Each category has unique gradient colors
- **Status**: Green for in-stock, Red for out-of-stock

### Typography
- **Headings**: Bold, large sizes (text-4xl to text-5xl)
- **Body**: Clean, readable (text-base to text-lg)
- **Labels**: Uppercase tracking for category tags

### Layout
- **Max Width**: 7xl container (1280px)
- **Grid**: Responsive grid (1 col mobile → 4 cols desktop)
- **Spacing**: Generous padding and margins (py-16, gap-8)
- **Rounded Corners**: Modern rounded elements (rounded-2xl, rounded-full)

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design
- Touch-friendly interactions

## Future Enhancement Recommendations

1. **Backend Integration**: Connect to a real database for product management
2. **User Accounts**: Add user authentication and order history
3. **Payment Gateway**: Integrate payment processing (Stripe, PayPal)
4. **Admin Panel**: Build admin interface for product/order management
5. **Search Functionality**: Add product search feature
6. **Wishlist**: Allow users to save favorite products
7. **Reviews**: Customer product reviews and ratings
8. **Email Notifications**: Order confirmation emails

## Notes

- This is a frontend-only implementation
- Orders are stored locally and will be lost on browser cache clear
- Product images are from Pixabay (royalty-free)
- All prices are in USD
- Free shipping is included in all orders
