/*
 # Create profiles table and security policies

 1. New Tables
   - `profiles`
     - `id` (uuid, primary key, references auth.users)
     - `full_name` (text)
     - `avatar_url` (text)
     - `newsletter_subscribed` (boolean)
     - `created_at` (timestamp with time zone)
     - `updated_at` (timestamp with time zone)

 2. Security
   - Enable RLS on profiles table
   - Add policies for:
     - Users can read their own profile
     - Users can update their own profile
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  newsletter_subscribed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to handle profile creation on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id)
  VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- User Preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles ON DELETE CASCADE,
  topics text[],
  keywords text[],
  preferred_sources text[],
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own preferences" ON user_preferences FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE TO authenticated USING (auth.uid() = user_id);

-- Raw News Articles table
CREATE TABLE IF NOT EXISTS news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text UNIQUE NOT NULL,
  title text,
  source text,
  author text,
  published_at timestamptz,
  content text,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE news_articles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access to all users" ON news_articles FOR SELECT TO authenticated; -- Adjust as needed

-- Processed Summaries table
CREATE TABLE IF NOT EXISTS article_summaries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES news_articles ON DELETE CASCADE NOT NULL,
  summary text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (article_id)
);
ALTER TABLE article_summaries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access to all users" ON article_summaries FOR SELECT TO authenticated; -- Adjust as needed

-- Sentiment Labels table
CREATE TABLE IF NOT EXISTS article_sentiment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id uuid REFERENCES news_articles ON DELETE CASCADE NOT NULL,
  sentiment_label text,
  explanation text,
  created_at timestamptz DEFAULT now(),
  UNIQUE (article_id)
);
ALTER TABLE article_sentiment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable read access to all users" ON article_sentiment FOR SELECT TO authenticated; -- Adjust as needed
