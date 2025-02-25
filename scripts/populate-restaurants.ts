import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const OSAKA_RESTAURANTS = [
  {
    name: 'Sushi Mizutani',
    address: '1-2-3 Dotonbori, Chuo-ku, Osaka',
    description: 'A hidden gem loved by locals. Fresh seafood and skilled craftsmanship.',
    location: 'Osaka',
    cuisine: 'Sushi',
    rating: 4.8,
    image_url: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
    url: 'https://sushi-mizutani.com'
  },
  {
    name: 'Ramen Ichiro',
    address: '2-1-1 Umeda, Kita-ku, Osaka',
    description: 'Famous for rich broth and special chashu pork.',
    location: 'Osaka',
    cuisine: 'Ramen',
    rating: 4.5,
    image_url: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e',
    url: 'https://ramen-ichiro.com'
  },
  {
    name: 'Yakitori Honten',
    address: '3-1-2 Tenjinbashi, Kita-ku, Osaka',
    description: 'Traditional yakitori grilled over charcoal. Reservation required.',
    location: 'Osaka',
    cuisine: 'Yakitori',
    rating: 4.7,
    image_url: 'https://images.unsplash.com/photo-1519690889869-e705e59f72e1',
    url: 'https://yakitori-honten.com'
  },
  {
    name: 'Tempura Osaka',
    address: '4-5-6 Shinsaibashi, Chuo-ku, Osaka',
    description: 'Premium tempura using carefully selected ingredients.',
    location: 'Osaka',
    cuisine: 'Tempura',
    rating: 4.6,
    image_url: 'https://images.unsplash.com/photo-1581184953963-d15972933db1',
    url: 'https://tempura-osaka.com'
  },
  {
    name: 'Udon Sanuki',
    address: '1-2-3 Namba, Naniwa-ku, Osaka',
    description: 'Famous for firm, handmade noodles. Try with seasonal tempura.',
    location: 'Osaka',
    cuisine: 'Udon',
    rating: 4.4,
    image_url: 'https://images.unsplash.com/photo-1618841557871-b4664fbf0cb3',
    url: 'https://udon-sanuki.com'
  }
];

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

async function populateRestaurants() {
  try {
    const { error } = await supabase
      .from('restaurants')
      .insert(OSAKA_RESTAURANTS);

    if (error) throw error;
    console.log('Successfully populated restaurants');
  } catch (error) {
    console.error('Error populating restaurants:', error);
  }
}

populateRestaurants();