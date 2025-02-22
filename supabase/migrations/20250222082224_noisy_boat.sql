/*
  # Initial Schema Setup for IRU TOMO

  1. New Tables
    - `users`: Store user information
      - `id` (UUID, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `phone` (text)
      - Timestamps
    
    - `restaurants`: Store restaurant information
      - `id` (UUID, primary key)
      - `name` (text)
      - `address` (text)
      - `description` (text)
      - `location` (text)
      - `cuisine` (text)
      - `rating` (decimal)
      - `image_url` (text)
      - Timestamps
    
    - `reservations`: Store reservation information
      - `id` (UUID, primary key)
      - `user_id` (UUID, foreign key)
      - `restaurant_id` (UUID, foreign key)
      - `reservation_date` (timestamptz)
      - `party_size` (integer)
      - `status` (text)
      - `payment_status` (text)
      - `payment_amount` (integer)
      - Timestamps

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create restaurants table
CREATE TABLE restaurants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  location TEXT NOT NULL,
  cuisine TEXT,
  rating DECIMAL(2,1),
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reservations table
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  restaurant_id UUID NOT NULL REFERENCES restaurants(id),
  reservation_date TIMESTAMPTZ NOT NULL,
  party_size INTEGER NOT NULL CHECK (party_size > 0 AND party_size <= 10),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'canceled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed')),
  payment_amount INTEGER DEFAULT 1000,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read restaurants"
  ON restaurants
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can read own reservations"
  ON reservations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reservations"
  ON reservations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);