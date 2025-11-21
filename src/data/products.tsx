import { Product } from '../types/Product';
import droit from '../assets/droit.png'
import gris from '../assets/gris.png'
import w from '../assets/1.png'
import { useState, useEffect } from 'react';
import { getProducts } from '../api/productsApi';




export const products: Product[] = [

  /*
  // Skinny Jeans
  {
    id: 'skinny-001',
    name: 'Classic Skinny Fit',
    category: 'skinny',
    description: 'Timeless skinny jeans with stretch comfort. Perfect for everyday wear with a flattering fit.',
    price: 89.99,
    discountPrice: 69.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2017/08/14/13/16/shoes-2640427_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46'],
    featured: true,
    bestSeller: true
  },
  {
    id: 'skinny-002',
    name: 'Dark Wash Skinny',
    category: 'skinny',
    description: 'Premium dark wash skinny jeans with a sleek silhouette. Versatile and sophisticated.',
    price: 95.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2017/03/20/20/36/blue-jeans-2160265_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46'],
    featured: true
  },
  {
    id: 'skinny-003',
    name: 'High Waist Skinny',
    category: 'skinny',
    description: 'Modern high-waisted skinny jeans that elongate your silhouette beautifully.',
    price: 79.99,
    discountPrice: 59.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2023/10/24/02/01/women-8337216_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46'],
    bestSeller: true
  },
  {
    id: 'skinny-004',
    name: 'Distressed Skinny',
    category: 'skinny',
    description: 'Edgy distressed skinny jeans with ripped details. Fashion-forward and trendy.',
    price: 92.99,
    inStock: false,
    images: ['https://cdn.pixabay.com/photo/2018/05/06/03/39/woman-3377839_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46']
  },

  // Straight Jeans
  {
    id: 'straight-001',
    name: 'Classic Straight Leg',
    category: 'straight',
    description: 'Timeless straight-leg jeans with a comfortable fit. A wardrobe essential.',
    price: 85.99,
    discountPrice: 64.99,
    inStock: true,
    images: [droit],
    sizes: ['36', '38', '40', '42', '44','46'],
    bestSeller: true
  },
  {
    id: 'straight-002',
    name: 'Vintage Straight',
    category: 'straight',
    description: 'Vintage-inspired straight jeans with authentic details and perfect fade.',
    price: 98.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2017/03/20/20/36/blue-jeans-2160265_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46']
  },
  {
    id: 'straight-003',
    name: 'Mid Rise Straight',
    category: 'straight',
    description: 'Comfortable mid-rise straight jeans perfect for all-day wear.',
    price: 82.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2023/10/24/02/01/women-8337216_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46'],
    featured: true
  },

  // Bootcut Jeans
  {
    id: 'bootcut-001',
    name: 'Classic Bootcut',
    category: 'bootcut',
    description: 'Flattering bootcut jeans that balance your silhouette beautifully.',
    price: 88.99,
    discountPrice: 68.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2018/05/06/03/39/woman-3377839_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46'],
    featured: true
  },
  {
    id: 'bootcut-002',
    name: 'High Rise Bootcut',
    category: 'bootcut',
    description: 'High-rise bootcut jeans with a vintage vibe and modern comfort.',
    price: 94.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2017/03/20/20/36/blue-jeans-2160265_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46']
  },

  // Wide-Leg Jeans
  {
    id: 'wide-001',
    name: 'Wide Leg Palazzo',
    category: 'wide-leg',
    description: 'Fashion-forward wide-leg jeans with elegant drape and flow.',
    price: 96.99,
    discountPrice: 76.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2022/03/06/03/18/friends-7050708_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46'],
    bestSeller: true,
    featured: true
  },
  {
    id: 'wide-002',
    name: 'Relaxed Wide Leg',
    category: 'wide-leg',
    description: 'Comfortable and trendy wide-leg jeans perfect for casual sophistication.',
    price: 91.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2023/10/24/02/01/women-8337216_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46']
  },
  {
    id: 'wide-003',
    name: 'Cropped Wide Leg',
    category: 'wide-leg',
    description: 'Stylish cropped wide-leg jeans showing off your favorite shoes.',
    price: 87.99,
    inStock: false,
    images: ['https://cdn.pixabay.com/photo/2018/05/06/03/39/woman-3377839_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46']
  },

  // Boyfriend Jeans
  {
    id: 'boyfriend-001',
    name: 'Relaxed Boyfriend',
    category: 'boyfriend',
    description: 'Effortlessly cool boyfriend jeans with a relaxed, comfortable fit.',
    price: 84.99,
    discountPrice: 64.99,
    inStock: true,
    images: [gris],
    sizes: ['36', '38', '40', '42', '44','46'],
    bestSeller: true
  },
  {
    id: 'boyfriend-002',
    name: 'Distressed Boyfriend',
    category: 'boyfriend',
    description: 'Trendy distressed boyfriend jeans with authentic worn details.',
    price: 89.99,
    inStock: true,
    images: [droit,w],
    sizes: ['36', '38', '40', '42', '44','46'],
    featured: true
  },
  {
    id: 'boyfriend-003',
    name: 'Rolled Cuff Boyfriend',
    category: 'boyfriend',
    description: 'Casual boyfriend jeans with stylish rolled cuffs for a laid-back look.',
    price: 86.99,
    inStock: true,
    images: ['https://cdn.pixabay.com/photo/2022/03/06/03/18/friends-7050708_1280.jpg'],
    sizes: ['36', '38', '40', '42', '44','46']
  }

*/
];
// Helper functions

export const getFeaturedProducts = () => products.filter(p => p.featured);
export const getBestSellers = () => products.filter(p => p.bestSeller);

