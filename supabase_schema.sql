-- ==============================================================================
-- 《靈魂之境 ‧ 宇宙迴響 (Soul Oracle)》Supabase / PostgreSQL 完整資料庫架構規格書 (第二版 V2)
-- 版本：v2.0 (全端點數經濟、每日冥想上限10點、每日免費抽卡、音頻Freemium、21天免費/超額願望牆)
-- 技術棧：GitHub + Vercel + Supabase (PostgreSQL 16 / Auth) + Next.js 15
-- ==============================================================================

-- 1. 會員個人資料與點數資產表 (profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  nickname TEXT DEFAULT '尋光旅人',
  avatar_url TEXT,
  points INTEGER DEFAULT 0 CHECK (points >= 0),            -- 累積的心靈星光點數
  last_draw_date DATE DEFAULT NULL,                        -- 每日免費抽卡記錄日期 (NULL 或今日日期)
  daily_meditation_points_date DATE DEFAULT CURRENT_DATE,  -- 每日冥想上限重置判定日期
  daily_meditation_points_earned INTEGER DEFAULT 0,        -- 當日已賺取的冥想點數 (上限 10 點)
  wish_free_claimed BOOLEAN DEFAULT FALSE,                 -- 連續 21 天達成後的免費許願額度是否已領用
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 自動同步 auth.users 建立 profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname, points, daily_meditation_points_date, daily_meditation_points_earned, wish_free_claimed)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', '尋光旅人'), 0, CURRENT_DATE, 0, FALSE)
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 2. 每日冥想與點數紀錄表 (meditation_logs)
CREATE TABLE IF NOT EXISTS public.meditation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes IN (1, 3, 5, 10)),
  points_earned INTEGER DEFAULT 0 CHECK (points_earned >= 0 AND points_earned <= 10),
  meditation_date DATE DEFAULT CURRENT_DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_meditation_logs_user_date ON public.meditation_logs(user_id, meditation_date);

-- 3. 成就與解鎖狀態表 (badges)
-- badge_type: '7_days_quote' (連續7天贈送宇宙金句卡), '21_days_wish' (連續21天解鎖願望牆許願特權)
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL CHECK (badge_type IN ('7_days_quote', '21_days_wish')),
  reward_quote TEXT,                                       -- 獲得的金句內容 (針對 7天金句卡)
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, badge_type)
);

-- 4. 宇宙允許願望牆 (wish_wall)
-- 連續 21 天解鎖後贈送 1 次免費，超額發布消耗點數 (例如扣 20 點)
CREATE TABLE IF NOT EXISTS public.wish_wall (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  author_nickname TEXT DEFAULT '星光旅人',
  wish_content TEXT NOT NULL,
  is_free_claim BOOLEAN DEFAULT FALSE,                     -- 是否為 21 天里程碑贈送的免費額度
  points_cost INTEGER DEFAULT 0 CHECK (points_cost >= 0),  -- 本次發布消耗的點數 (免費為 0，超額為 20)
  is_public BOOLEAN DEFAULT TRUE,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. 心靈音樂與肯定句音頻庫 (music_tracks)
-- 免費區 (price_points = 0) vs 點數解鎖區 (如 432Hz 頌缽音頻需點數解鎖)
CREATE TABLE IF NOT EXISTS public.music_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  duration_label TEXT DEFAULT '15:00',
  audio_url TEXT NOT NULL,
  price_points INTEGER DEFAULT 0 CHECK (price_points >= 0), -- 0 代表免費，大於 0 代表需扣點數
  category TEXT DEFAULT 'meditation',                       -- free_ambient, singing_bowl_432, affirmation, deep_sleep
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. 使用者已解鎖音樂紀錄表 (user_unlocked_music)
CREATE TABLE IF NOT EXISTS public.user_unlocked_music (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  track_id UUID REFERENCES public.music_tracks(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, track_id)
);

-- 7. 每日抽卡歷史與扣點紀錄 (card_draw_logs)
CREATE TABLE IF NOT EXISTS public.card_draw_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  deck_type TEXT NOT NULL,                                 -- release, manifest, unicorn, cosmic_oneliner
  card_id UUID,
  is_free BOOLEAN DEFAULT TRUE,                            -- 當日第一次為 TRUE，超額抽卡為 FALSE
  points_deducted INTEGER DEFAULT 0,                       -- 扣除點數 (0 或 5)
  drawn_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. 心事書寫與願望顯化核心表 (Soul Inquiries & Wishes)
CREATE TABLE IF NOT EXISTS public.soul_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  mood_tag TEXT,
  journal_text TEXT NOT NULL,
  universe_reply TEXT NOT NULL,
  interaction_points_awarded INTEGER DEFAULT 3,            -- 心事放手書寫互動獲贈點數
  is_transformed BOOLEAN DEFAULT FALSE,
  transformed_at TIMESTAMPTZ,
  transformation_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.soul_wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  wish_text TEXT NOT NULL,
  universe_blessing TEXT NOT NULL,
  interaction_points_awarded INTEGER DEFAULT 2,            -- 願望種子與肯定句互動獲贈點數
  is_manifested BOOLEAN DEFAULT FALSE,
  manifested_at TIMESTAMPTZ,
  gratitude_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. Row Level Security (RLS) 安全防護政策
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meditation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wish_wall ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_unlocked_music ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.card_draw_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soul_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soul_wishes ENABLE ROW LEVEL SECURITY;

-- profiles: 個人只能讀寫自己的資料
CREATE POLICY "Users can view and edit own profile" ON public.profiles
  FOR ALL USING (auth.uid() = id);

-- meditation_logs: 個人只能讀寫自己的冥想記錄
CREATE POLICY "Users can view and add own meditation logs" ON public.meditation_logs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- badges: 個人只能查看與解鎖自己的勳章
CREATE POLICY "Users can view own badges" ON public.badges
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- wish_wall: 公開願望所有人皆可檢視，僅能新增或修改自己的願望
CREATE POLICY "Anyone can view public wishes" ON public.wish_wall
  FOR SELECT USING (is_public = TRUE);

CREATE POLICY "Users can manage own wishes" ON public.wish_wall
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- music_tracks: 所有人皆可公開讀取音樂清單 (價格與試聽網址)
CREATE POLICY "Anyone can view active tracks" ON public.music_tracks
  FOR SELECT USING (is_active = TRUE);

-- user_unlocked_music: 個人只能讀取與新增自己已解鎖的音樂
CREATE POLICY "Users can view and unlock tracks" ON public.user_unlocked_music
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- card_draw_logs: 個人只能讀取自己的抽卡記錄
CREATE POLICY "Users can view own draw logs" ON public.card_draw_logs
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- soul_inquiries & soul_wishes: 嚴格隔離，唯本人可見
CREATE POLICY "Users can view own inquiries" ON public.soul_inquiries
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own manifest wishes" ON public.soul_wishes
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
