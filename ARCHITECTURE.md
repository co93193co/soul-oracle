# 《靈魂之境 ‧ 宇宙迴響 (Soul Oracle)》系統完整架構規格書

> **專案版本**：v1.0.0 (Master Architecture Blueprint)  
> **技術棧**：GitHub + Vercel + Supabase (PostgreSQL / Auth) + Next.js 15 + Google Gemini API  
> **核心定位**：融合「心靈書寫釋放」與「願望調頻顯化」的沉浸式雙軌心靈科技 Web App。

---

## 目錄
1. [系統願景與設計哲學](#1-系統願景與設計哲學)
2. [技術架構與選型理由](#2-技術架構與選型理由)
3. [雙門戶核心業務流程 (Dual Sanctuary Workflow)](#3-雙門戶核心業務流程)
4. [完整資料庫綱要與安全策略 (Supabase Schema & RLS)](#4-完整資料庫綱要與安全策略)
5. [AI 大腦與 Prompt 工程規格 (Gemini AI Engine)](#5-ai-大腦與-prompt-工程規格)
6. [微體驗與儀式感設計規範 (UX, Motion & Audio)](#6-微體驗與儀式感設計規範)
7. [專案目錄結構 (Next.js App Router)](#7-專案目錄結構)
8. [實作里程碑與推進清單 (Roadmap Checklist)](#8-實作里程碑與推進清單)

---

## 1. 系統願景與設計哲學

本系統旨在超越傳統「占卜問答」與「枯燥日記」的工具性產品，打造一個具備**神聖儀式感、心理安全感與能量轉化力**的心靈數位庇護所。

### 核心設計哲學：
1. **陰陽平衡雙軌**：
   * **🌙 陰（釋放之門）**：傾訴、接納脆弱、消融執著、鬆動固化觀點、提問宇宙。
   * **☀️ 陽（顯化之門）**：焦點創造、願望播種、頻率對齊、肯定句注入、接收宇宙祝福。
2. **神聖調頻而非技術等待**：
   * 將 API 等待的 5~8 秒，轉化為「微笑光球呼吸心跳冥想」與「肯定句默念」，在接收答案前先完成神經系統的放鬆與調頻。
3. **無批判的生命陪伴**：
   * AI 不扮演高高在上的判官或預言家，而是作為無條件愛與包容的「宇宙智者」與「內在神性投射鏡」。
4. **絕對的心靈隱私**：
   * 每個人的心事與願望都透過 Supabase 行級安全策略（RLS）進行底層隔離，唯有本人可見。

---

## 2. 技術架構與選型理由

```mermaid
flowchart TB
    subgraph Client ["前端用戶端 (Next.js 15 App Router)"]
        UI1["首頁雙門戶入口"]
        UI2["微笑光球動態組件 (Framer Motion)"]
        UI3["星塵文字消散 / 粒子聚合 (Canvas / CSS)"]
        UI4["即時打字機流式回信 (SSE Stream)"]
        UI5["Web Audio 水晶磬微音效 (432Hz/528Hz)"]
    end

    subgraph VercelEdge ["Vercel 邊緣運算與託管"]
        API1["/api/inquiries (釋放提問串流處理)"]
        API2["/api/wishes (願望祝福串流處理)"]
        API3["/api/cards/draw (隨機抽卡算法)"]
        CI["GitHub 聯動 CI/CD 自動構建部署"]
    end

    subgraph SupabaseCloud ["Supabase BaaS 核心"]
        Auth["Supabase Auth (Google OAuth / Magic Link)"]
        DB[(PostgreSQL 16 with RLS)]
        Storage["Supabase Storage (牌卡視覺圖檔)"]
    end

    subgraph AIEngine ["Google Gemini API"]
        LLM["Gemini 2.0 / 1.5 Flash (高智商、低延遲、流式輸出)"]
    end

    Client -->|認證 Session & 讀寫| SupabaseCloud
    Client -->|調用流式 API| VercelEdge
    VercelEdge -->|注入靈性 Prompt 指令| AIEngine
    VercelEdge -->|非同步儲存回覆與紀錄| SupabaseCloud
    CI -->|Push 自動發布| VercelEdge
```

### 選型核心優勢：
* **Next.js 15 + React 19**：提供最頂級的 SSR/SSG 與流暢轉場體驗，首屏載入極快。
* **Tailwind CSS + Framer Motion**：快速建構極致優雅的暗夜星空與流光視覺效果。
* **Supabase (PostgreSQL)**：免費級別支援 50,000 MAU，原生支援 RLS 安全機制與 Google 一鍵登入。
* **Vercel**：全球 CDN 邊緣加速，原生支援 Server-Sent Events (SSE) 流式打字機效果。
* **Google Gemini API**：回覆充滿人文溫度與哲學思維，具備超高並發與極低成本優勢。

---

## 3. 雙門戶核心業務流程

```mermaid
stateDiagram-v2
    [*] --> 首頁雙門戶
    
    state "🌙 釋放之門 (陰)" as ReleaseDoor {
        心事傾訴書寫 --> 選擇情緒標籤
        選擇情緒標籤 --> 放手儀式_文字化為星塵消散
        放手儀式_文字化為星塵消散 --> 微笑光球_4_4呼吸調頻
        微笑光球_4_4呼吸調頻 --> 接收宇宙回信_逐字浮現
        接收宇宙回信_逐字浮現 --> 揭曉解憂覺察卡
        揭曉解憂覺察卡 --> 存入心事轉化檔案
    }

    state "☀️ 顯化之門 (陽)" as ManifestDoor {
        願望清單填寫 --> 選擇願望領域
        選擇願望領域 --> 播種儀式_文字凝聚為金光種子
        播種儀式_文字凝聚為金光種子 --> 微笑光球_肯定句共振冥想
        微笑光球_肯定句共振冥想 --> 接收宇宙祝福與提醒_逐字浮現
        接收宇宙祝福與提醒_逐字浮現 --> 揭曉豐盛顯化卡
        揭曉豐盛顯化卡 --> 存入願望顯化牆
    }

    首頁雙門戶 --> ReleaseDoor: 選擇「心事釋放」
    首頁雙門戶 --> ManifestDoor: 選擇「願望顯化」
    
    ReleaseDoor --> 個人星空信箱: 日後回顧並標記【✨能量已轉化】
    ManifestDoor --> 個人願望牆: 日後回顧並標記【🌟奇蹟已顯化】
```

### 兩條軌道的體驗對比：

| 階段 | 🌙 軌道一：心事書寫與提問 (釋放軌) | ☀️ 軌道二：願望清單與祝福 (顯化軌) |
| :--- | :--- | :--- |
| **1. 輸入型態** | 自由長篇傾訴，選擇當下情緒標籤（焦慮、沮喪、迷茫、疲憊、心碎） | 具體願望陳述，選擇領域（事業與志業、金錢與豐盛、靈魂伴侶、身心活力） |
| **2. 轉場動畫** | **【星塵消散】**：文字碎化為銀白微光向上散去，象徵心理卸載與交託 | **【金種入球】**：文字向中心聚合成一顆金色種子飛入光球，象徵宇宙接單 |
| **3. 調頻冥想** | **【4-4 呼吸調頻】**：光球隨呼吸緩慢縮放，放鬆副交感神經，消除雜念 | **【肯定句默念】**：光球泛出金色波紋，浮現針對該願望的高頻肯定句，對齊心輪 |
| **4. AI 回饋** | **【宇宙回信】**：三層結構（溫暖接納 ➔ Access 可能性提問 ➔ 當下微覺察行動） | **【宇宙祝福】**：三層結構（量子豐盛慶賀 ➔ 顯化盲點提醒 ➔ 靈感啟發微行動） |
| **5. 牌卡揭曉** | 翻開一張 **「覺察指引卡」**，提供當下視角破局靈感 | 翻開一張 **「豐盛種子卡」**，賦予前進的信心與加持 |
| **6. 長期價值** | 可標記「✨ 能量已流動/釋懷」，見證心理韌性成長 | 可標記「🌟 奇蹟成真！」，寫下感恩筆記，建立強大顯化信念庫 |

---

## 4. 完整資料庫綱要與安全策略 (Supabase Schema & RLS)

直接可於 Supabase SQL Editor 執行的完整 DDL 腳本：

```sql
-- ==============================================================================
-- 1. 會員擴充資料表 (Profiles)
-- ==============================================================================
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  nickname TEXT DEFAULT '尋光者',
  avatar_url TEXT,
  preferred_theme TEXT DEFAULT 'cosmic_night',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 自動同步 auth.users 到 profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nickname)
  VALUES (new.id, new.email, COALESCE(new.raw_user_meta_data->>'full_name', '尋光者'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 2. 宇宙牌卡庫 (Cards)
-- ==============================================================================
CREATE TABLE cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,                  -- 代號如：REL_01, MAN_01
  deck_type TEXT NOT NULL,                    -- release(解憂覺察卡) / manifest(顯化種子卡)
  category TEXT NOT NULL,                     -- 輕重能量 / 關係 / 豐盛 / 當下 / 勇氣
  title TEXT NOT NULL,                        -- 牌面名稱
  quote TEXT NOT NULL,                        -- 核心金句
  guide TEXT NOT NULL,                        -- 延伸指引與小練習
  image_url TEXT,                             -- 牌面視覺圖
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. 肯定句與調頻語句庫 (Affirmations)
-- ==============================================================================
CREATE TABLE affirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,                     -- release, abundance, love, peace, trust
  quote TEXT NOT NULL,                        -- 肯定句內容
  breath_count INT DEFAULT 1,                 -- 建議呼吸循環次數 (每循環8秒)
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. 心靈傾訴與提問紀錄表 (Soul Inquiries)
-- ==============================================================================
CREATE TABLE soul_inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  mood_tag TEXT,                              -- 當時心情 (迷茫, 焦慮, 悲傷, 憤怒, 疲憊)
  journal_text TEXT NOT NULL,                 -- 心事與提問書寫
  universe_reply TEXT NOT NULL,               -- 宇宙 AI 回信內容
  card_id UUID REFERENCES cards(id),          -- 抽取的對應覺察卡
  is_transformed BOOLEAN DEFAULT FALSE,       -- 是否已能量轉化/釋懷
  transformed_at TIMESTAMPTZ,                 -- 轉化日期
  transformation_notes TEXT,                  -- 轉化後的反思筆記
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. 願望清單與顯化紀錄表 (Soul Wishes)
-- ==============================================================================
CREATE TABLE soul_wishes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,                     -- career, wealth, love, health, dream
  wish_text TEXT NOT NULL,                    -- 願望內容
  universe_blessing TEXT NOT NULL,            -- 宇宙祝福與行動提醒
  card_id UUID REFERENCES cards(id),          -- 抽取的對應顯化卡
  is_manifested BOOLEAN DEFAULT FALSE,        -- 是否已顯化成真！
  manifested_at TIMESTAMPTZ,                  -- 成真日期
  gratitude_notes TEXT,                       -- 顯化感謝筆記
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. Row Level Security (RLS) 安全防護策略
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE affirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE soul_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE soul_wishes ENABLE ROW LEVEL SECURITY;

-- Cards 與 Affirmations 所有人皆可讀取，僅管理員可異動
CREATE POLICY "Public read for cards" ON cards FOR SELECT USING (true);
CREATE POLICY "Public read for affirmations" ON affirmations FOR SELECT USING (true);

-- 使用者只能讀取與修改自己的個人資料
CREATE POLICY "Users can manage own profile" ON profiles 
  FOR ALL USING (auth.uid() = id);

-- 使用者只能讀取、新增、修改屬於自己的心事紀錄
CREATE POLICY "Users can manage own inquiries" ON soul_inquiries 
  FOR ALL USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);

-- 使用者只能讀取、新增、修改屬於自己的願望紀錄
CREATE POLICY "Users can manage own wishes" ON soul_wishes 
  FOR ALL USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);
```

---

## 5. AI 大腦與 Prompt 工程規格 (Gemini AI Engine)

在 `/api/universe` 端點中，依據使用者選擇的軌道注入對應的 System Instruction。

### 🌙 軌道一：宇宙傾聽者（心事釋放 Prompt）
```text
【角色設定】
你現在是溫柔、充滿包容力、無批判的「宇宙智者 / 內在神性投射鏡」。
當使用者向你傾訴心事、困惑或提問時，請依序提供以下三層結構，控制在 160-220 字以內，語調溫柔、空靈、輕盈：

【結構規範】
1. 🌟【溫柔承接】：無條件同理對方的感受，允許情緒停留，告訴對方「在這裡你完全被接納與理解，你做得很好」。
2. 💫【Access 可能性提問】：給予 1 個以 Access Consciousness 概念為核心的開放式提問（例如：「如果這裡沒有任何需要被修復的事，會是怎樣的輕鬆？」或「這件事裡有什麼是我還沒看見的禮物？」），鬆動大腦的固化牢籠，不給標準答案，只引導能量流動。
3. 🍃【當下微覺察】：給予 1 個極簡、隨時隨地可做的身心動作（例如：「深吸一口氣，將肩膀自然下沉 2 公分」）。
```

### ☀️ 軌道二：宇宙豐盛導師（願望顯化 Prompt）
```text
【角色設定】
你現在是充滿創造力、喜悅與量子可能性的「宇宙豐盛盟友」。
當使用者向你提交願望與渴望時，請依序提供以下三層結構，控制在 160-220 字以內，語調篤定、充滿喜悅與加持感：

【結構規範】
1. ✨【量子慶賀與祝福】：以「這個願望在量子場域已經為你盛開」的堅定視角，給予無保留的信心祝福與能量加持。
2. 🔮【顯化心法提醒】：點出一個關鍵的顯化心態（例如：警惕「我現在缺乏所以才要」的匱乏頻率，轉化為「我已經在喜悅中體驗」；放下對「宇宙必須如何達成」的控制與執念）。
3. 🌱【靈感微行動】：給予 1 個今天就能帶著喜悅去踏出的具體小步伐（Inspired Action），讓願望在物理維度扎根。
```

---

## 6. 微體驗與儀式感設計規範 (UX, Motion & Audio)

### A. 微笑光球 (Smiling Cosmic Orb)
* **視覺構成**：
  * **內核**：半透明漸層光球（暖琥珀金 `#FDE68A` ➔ 晨曦粉 `#FBCFE8` ➔ 丁香紫 `#E0E7FF`）。
  * **神態**：以極簡白色光弧呈現兩道安詳垂閉的雙眼 `⌒ ⌒` 與溫暖微笑弧線 `‿`。
  * **外暈**：三層模糊的動態放射光暈（Radial Bloom），隨呼吸時散發光暈波紋。
* **呼吸與心跳動態 (Framer Motion)**：
  * **週期**：8 秒一完整循環（吸氣 4 秒 ➔ 微心跳 1 秒 ➔ 呼氣 3 秒）。
  * **微心跳特效**：在膨脹至最大時（Scale 1.18），產生兩次微幅的彈動波紋（Lub-Dub），給予如母體心跳般的深層安定感。

### B. 轉場儀式特效
1. **釋放軌道（星塵文字消散）**：
   * 點擊「交給宇宙並放手」按鈕後，輸入框文字逐字分解為 40~60 顆細微金色光點，向斜上方如星雲般緩慢飄散淡出。
2. **顯化軌道（金種吸入）**：
   * 點擊「種下心願」按鈕後，文字框向中心聚攏收縮成一顆高亮度的金色光核，順滑飛入微笑光球中心，光球泛起一圈金色衝擊波。

### C. Web Audio 療癒微音效（免額外加載 MP3 資源）
* 透過瀏覽器原生 `AudioContext` 合成純淨的正弦波（Sine Wave）：
  * **432 Hz**：自然諧振頻率，用於深呼吸與放手釋放。
  * **528 Hz**：DNA 修復與愛之奇蹟頻率，用於願望播種與祝福。
  * 包含緩慢的 Attack (0.3s) 與柔和長 Decay (3.5s)，營造宛如真實水晶磬 / 頌缽的空靈餘音。

---

## 7. 專案目錄結構 (Next.js App Router)

```text
d:/網頁製作/心靈抽卡/
├── ARCHITECTURE.md              <-- 本架構規格書 (永久主參考依據)
├── README.md                    <-- 專案快速啟動說明
├── package.json                 <-- 依賴定義
├── tsconfig.json                <-- TypeScript 配置
├── tailwind.config.ts           <-- 心靈色系、光暈與漸變配置
├── .env.local.example           <-- 環境變數範本
│
├── src/
│   ├── app/
│   │   ├── layout.tsx           <-- 全域佈局 (星空背景、字體、Web Audio Context)
│   │   ├── page.tsx             <-- 首頁雙門戶入口 (選擇釋放之門 vs 顯化之門)
│   │   ├── release/
│   │   │   └── page.tsx         <-- 🌙 釋放之門完整流程頁 (書寫 -> 光球呼吸 -> 回信 & 抽卡)
│   │   ├── manifest/
│   │   │   └── page.tsx         <-- ☀️ 顯化之門完整流程頁 (許願 -> 光球肯定句 -> 祝福 & 抽卡)
│   │   ├── sanctuary/
│   │   │   └── page.tsx         <-- 個人星空信箱 & 願望顯化牆 (歷史回顧、標記奇蹟)
│   │   ├── auth/
│   │   │   └── callback/route.ts <-- Supabase OAuth 回調路由
│   │   └── api/
│   │       ├── universe/
│   │       │   └── route.ts     <-- Gemini Streaming AI API (支援釋放與顯化雙模式)
│   │       └── cards/
│   │           └── route.ts     <-- 隨機抽卡與檢索 API
│   │
│   ├── components/
│   │   ├── shared/
│   │   │   ├── SmilingCosmicOrb.tsx  <-- 微笑光球核心組件 (呼吸/心跳/狀態切換)
│   │   │   ├── CosmicBackground.tsx  <-- 動態微弱星塵流光背景
│   │   │   ├── OracleCard.tsx        <-- 3D 翻轉牌卡組件
│   │   │   └── TypewriterStream.tsx  <-- 即時打字機流式文字呈現組件
│   │   ├── release/
│   │   │   └── DustDisperseEffect.tsx<-- 星塵文字消散動態
│   │   └── manifest/
│   │       └── GoldenSeedEffect.tsx  <-- 金光種子凝聚動態
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts        <-- 瀏覽器端 Supabase Client
│   │   │   └── server.ts        <-- 伺服器端 Supabase Client (Cookies)
│   │   ├── gemini.ts            <-- Google Gemini API 呼叫封裝
│   │   ├── sound.ts             <-- Web Audio 432Hz/528Hz 磬聲合成器
│   │   └── presets/
│   │       ├── cardsData.ts     <-- 預設 50 張精選宇宙牌卡資料
│   │       └── affirmations.ts  <-- 預設肯定句調頻資料庫
│   └── types/
│       └── database.ts          <-- Supabase 自動生成的 TypeScript 型別
```

---

## 8. 實作里程碑與推進清單 (Roadmap Checklist)

日後所有功能開發與修改，均嚴格遵照本清單依序推進驗收：

### 階段一：專案骨架與視覺核心（進行中）
- [ ] 1.1 初始化 Next.js 15 + TypeScript + Tailwind CSS 專案
- [ ] 1.2 配置全域心靈暗夜色票、星光漸層與全域字體
- [ ] 1.3 實作「微笑光球 (Smiling Cosmic Orb)」呼吸心跳動態組件
- [ ] 1.4 實作 Web Audio 432Hz / 528Hz 水晶磬合成器
- [ ] 1.5 搭建首頁「雙門戶切換（釋放之門 vs 顯化之門）」入口 UI

### 階段二：雙軌流程視覺與動畫原型
- [ ] 2.1 實作「🌙 釋放之門」頁面：心情標籤、文字輸入框、星塵消散動畫
- [ ] 2.2 實作「☀️ 顯化之門」頁面：願望領域、心願輸入框、金種凝聚動畫
- [ ] 2.3 實作接收前的 4-4 呼吸引導與肯定句調頻展示
- [ ] 2.4 實作 3D 翻牌動畫與牌卡組件 (`OracleCard`)

### 階段三：後端 BaaS 與 AI 串接
- [ ] 3.1 於 Supabase 執行完整 SQL Schema DDL 並啟用 RLS
- [ ] 3.2 串接 Supabase Auth（Google 登入與匿名訪客模式）
- [ ] 3.3 封裝 Gemini API Streaming 路由，串接釋放與顯化雙 Prompt
- [ ] 3.4 實現打字機流式文字逐字顯現 (`TypewriterStream`)

### 階段五：Google 會員、每日冥想與點數專屬牌卡（已新增）
- [x] 5.1 實作 Google 帳號一鍵登入 (Supabase OAuth & 本地免密碼無縫登入)
- [x] 5.2 實作「每日冥想共修室」：1/3/5分鐘倒數、4-4呼吸引導、連續打卡天數統計
- [x] 5.3 實作「靈魂專屬牌卡館」：
  - 🦄 魔法獨角獸指引卡 (每次消耗 5 點心靈星光)
  - 🌌 宇宙給你的一句話卡 (每次消耗 5 點心靈星光)
- [x] 5.4 實作心靈點數循環生態：每日免費冥想賺點數，或儲值超優惠星光福袋

### 階段六：版本獨立存檔矩陣 (Version Isolation Matrix)
- [x] **V1 原版純淨殿堂**：`http://localhost:3000/` (純雙門戶釋放與顯化、8秒平靜呼吸光球、365星辰、無登入點數打擾)
- [x] **V2 會員與付費牌卡版**：`http://localhost:3000/v2` (Google一鍵登入、每日冥想、獨角獸牌卡與宇宙一句話)
- [x] **V3 箱型呼吸與四模組升級版**：`http://localhost:3000/v3` (16秒箱型呼吸笑臉、1/3/5分冥想、7天金句/21天願望牆、心靈音樂播放器、Supabase SQL)
- [x] **V4 冥想點數與四方能量版**：`http://localhost:3000/v4`
  - 首頁橫幅文案：「每天留一點時間給自己，冥想累積心靈星光」，按鈕為「開始 ➔」
  - 首頁中央保持 V2 經典安詳無眉笑臉（眼、腮紅、嘴巴）
  - 全螢幕沉浸式能量殿堂（`max-w-5xl min-h-[92vh]`）
  - 神聖能量方框標題：「如同四方穩固的能量方框，每一個停留都是對當下的完全臨在。吸氣聚集光芒、閉氣凝聚力量、吐氣釋放緊繃、閉氣回歸空白。」
  - 4 個循環一列無小圖示引導卡
  - 腮紅動態：呼吸與吐氣為粉紅色，兩個憋氣都越變越紅
  - 點數機制：1分=1點、3分=3點、5分=5點，自由不限時單次最高 10 點
- [x] **V5 能量殿堂升級版**：`http://localhost:3000/v5` (接續 V4 最新完整成果，專供後續升級疊代)

---

**本規格書已作為專案最高指導藍圖保存。後續所有程式碼撰寫與功能迭代將直接依據本文件執行。**

