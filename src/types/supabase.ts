export type User = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
};

export type Restaurant = {
  id: string;
  name: string;
  japanese_name: string | null;
  address: string;
  description: string | null;
  location: string;
  cuisine: string | null;
  rating: number | null;
  image_url: string | null;
  url: string | null;
  operating_hours: string | null;
  google_maps_link: string | null;
  created_at: string;
  updated_at: string;
};

export type Reservation = {
  id: string;
  user_id: string;
  restaurant_id: string;
  reservation_date: string;
  party_size: number;
  status: 'pending' | 'confirmed' | 'canceled';
  payment_status: 'pending' | 'completed';
  payment_amount: number;
  created_at: string;
  updated_at: string;
};