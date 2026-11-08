import { OracleCardData } from './presets/cardsData';
import { UnicornCardData } from './presets/unicornCards';
import { CosmicOneLinerCard, COSMIC_ONE_LINERS } from './presets/cosmicOneLiners';

export interface SoulUser {
  id: string;
  email: string;
  nickname: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
  isVip: boolean;
}

export interface MeditationLog {
  id: string;
  userId: string;
  durationMinutes: 1 | 3 | 5;
  pointsEarned: number;
  meditationDate: string; // YYYY-MM-DD
  createdAt: string;
}

export type BadgeType = '7_days_quote' | '21_days_wish';

export interface BadgeRecord {
  id: string;
  userId: string;
  badgeType: BadgeType;
  unlockedAt: string;
  rewardCard?: CosmicOneLinerCard;
}

export interface WishWallItem {
  id: string;
  userId: string;
  authorNickname: string;
  wishContent: string;
  isPublic: boolean;
  likesCount: number;
  createdAt: string;
}

export interface MusicTrack {
  id: string;
  title: string;
  description: string;
  durationLabel: string;
  audioUrl: string;
  pricePoints: number; // 0 = 免費
  category: 'meditation' | 'sleep' | 'healing';
}

export interface SoulInquiryRecord {
  id: string;
  createdAt: string;
  moodTag: string;
  journalText: string;
  universeReply: string;
  card: OracleCardData;
  isTransformed: boolean;
  transformedAt?: string;
  transformationNotes?: string;
}

export interface SoulWishRecord {
  id: string;
  createdAt: string;
  category: string;
  wishText: string;
  universeBlessing: string;
  card: OracleCardData;
  isManifested: boolean;
  manifestedAt?: string;
  gratitudeNotes?: string;
}

export interface MeditationStats {
  streakDays: number;
  totalMinutes: number;
  lastMeditationDate: string | null;
  badges: BadgeRecord[];
  canPostWishWall: boolean;
}

// 預設音樂庫清單 (與 Supabase 初始資料完全同步)
export const DEFAULT_MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'track_432',
    title: '432 Hz 晨曦初醒 ‧ 大地冥想',
    description: '自然接地頻率，消除早晨混沌，啟動一整天的清澈與安定。',
    durationLabel: '08:00',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c897f2e1a5.mp3',
    pricePoints: 0,
    category: 'healing',
  },
  {
    id: 'track_528',
    title: '528 Hz 奇蹟之愛 ‧ 心輪調頻',
    description: 'Solfeggio 愛的奇蹟音頻，撫平焦慮與受傷的心靈，吸引美好人事物。',
    durationLabel: '10:00',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
    pricePoints: 0,
    category: 'meditation',
  },
  {
    id: 'track_theta',
    title: '雨夜星塵 ‧ 深度西塔波放鬆',
    description: '柔和天然雨聲融合 6Hz Theta 波，帶你進入深邃的無夢舒眠與靈感狀態。',
    durationLabel: '15:00',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8c8a735dc.mp3',
    pricePoints: 3,
    category: 'sleep',
  },
  {
    id: 'track_bowl',
    title: '古寺頌缽 ‧ 虛空大定',
    description: '尼泊爾七金頌缽長音共鳴，震盪體內水分，排解深層情緒印記。',
    durationLabel: '12:00',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3',
    pricePoints: 5,
    category: 'healing',
  },
  {
    id: 'track_unicorn',
    title: '獨角獸之境 ‧ 天使水晶共振',
    description: '極高頻水晶缽與仙境豎琴音色，對齊頂輪與靈魂星光通道。',
    durationLabel: '20:00',
    audioUrl: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f79ced.mp3',
    pricePoints: 10,
    category: 'meditation',
  },
];

// 本地存儲 Keys
const USER_KEY = 'soul_oracle_user_v2';
const POINTS_KEY = 'soul_oracle_points_v2';
const MEDITATION_LOGS_KEY = 'soul_oracle_med_logs_v2';
const BADGES_KEY = 'soul_oracle_badges_v2';
const WISH_WALL_KEY = 'soul_oracle_wish_wall_v2';
const UNLOCKED_MUSIC_KEY = 'soul_oracle_unlocked_music_v2';
const INQUIRIES_KEY = 'soul_oracle_inquiries_v2';
const WISHES_KEY = 'soul_oracle_wishes_v2';

export const localStore = {
  // 會員管理 (Google 登入支援)
  getUser(): SoulUser {
    if (typeof window === 'undefined') {
      return { id: 'guest', email: '', nickname: '尋光同行者', isLoggedIn: false, isVip: false };
    }
    const data = localStorage.getItem(USER_KEY);
    if (!data) {
      return { id: 'guest', email: '', nickname: '尋光同行者', isLoggedIn: false, isVip: false };
    }
    try {
      return JSON.parse(data);
    } catch {
      return { id: 'guest', email: '', nickname: '尋光同行者', isLoggedIn: false, isVip: false };
    }
  },

  setUser(user: SoulUser): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  loginWithGoogle(email: string, nickname: string, avatarUrl?: string): SoulUser {
    const user: SoulUser = {
      id: 'usr_' + Date.now(),
      email,
      nickname: nickname || email.split('@')[0],
      avatarUrl: avatarUrl || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      isLoggedIn: true,
      isVip: false,
    };
    this.setUser(user);
    return user;
  },

  logout(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  // 心靈點數管理 (累積的冥想鑽取點數，預設 0)
  getPoints(): number {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem(POINTS_KEY);
    if (!saved) {
      localStorage.setItem(POINTS_KEY, '0');
      return 0;
    }
    return parseInt(saved, 10);
  },

  getStarCredits(): number {
    return this.getPoints();
  },

  addPoints(amount: number): number {
    const current = this.getPoints();
    const updated = current + amount;
    if (typeof window !== 'undefined') {
      localStorage.setItem(POINTS_KEY, updated.toString());
    }
    return updated;
  },

  deductPoints(amount: number): boolean {
    const current = this.getPoints();
    if (current < amount) return false;
    const updated = current - amount;
    if (typeof window !== 'undefined') {
      localStorage.setItem(POINTS_KEY, updated.toString());
    }
    return true;
  },

  setPoints(points: number): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(POINTS_KEY, points.toString());
    }
  },

  // 冥想紀錄 (1分=1點、3分=3點、5分=5點)
  getMeditationLogs(): MeditationLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(MEDITATION_LOGS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  // 成就勳章
  getBadges(): BadgeRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(BADGES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  hasBadge(badgeType: BadgeType): boolean {
    const badges = this.getBadges();
    return badges.some((b) => b.badgeType === badgeType);
  },

  awardBadge(badgeType: BadgeType, rewardCard?: CosmicOneLinerCard): BadgeRecord {
    const badges = this.getBadges();
    const existing = badges.find((b) => b.badgeType === badgeType);
    if (existing) return existing;

    const newBadge: BadgeRecord = {
      id: 'badge_' + Date.now(),
      userId: this.getUser().id,
      badgeType,
      unlockedAt: new Date().toISOString(),
      rewardCard,
    };
    badges.push(newBadge);
    if (typeof window !== 'undefined') {
      localStorage.setItem(BADGES_KEY, JSON.stringify(badges));
    }
    return newBadge;
  },

  // 計算連續天數 (Streak)
  calculateStreak(): { streakDays: number; totalMinutes: number; lastDate: string | null } {
    const logs = this.getMeditationLogs();
    if (logs.length === 0) {
      return { streakDays: 0, totalMinutes: 0, lastDate: null };
    }

    const totalMinutes = logs.reduce((sum, l) => sum + l.durationMinutes, 0);

    // 取得所有獨立的打卡日期並排序
    const dates = Array.from(new Set(logs.map((l) => l.meditationDate))).sort().reverse();
    if (dates.length === 0) {
      return { streakDays: 0, totalMinutes: 0, lastDate: null };
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    // 如果最近一次打卡不是今天也不是昨天，則連續中斷
    const latestDate = dates[0];
    if (latestDate !== todayStr && latestDate !== yesterdayStr) {
      return { streakDays: 1, totalMinutes, lastDate: latestDate };
    }

    let streak = 0;
    let expectedDate = new Date(latestDate);

    for (const dStr of dates) {
      const currentDate = new Date(dStr);
      const diffTime = Math.abs(expectedDate.getTime() - currentDate.getTime());
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak++;
        expectedDate = new Date(currentDate);
        expectedDate.setDate(expectedDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { streakDays: streak, totalMinutes, lastDate: latestDate };
  },

  getMeditationStats(): MeditationStats {
    const { streakDays, totalMinutes, lastDate } = this.calculateStreak();
    const badges = this.getBadges();
    const canPostWishWall = streakDays >= 21 || badges.some((b) => b.badgeType === '21_days_wish');

    return {
      streakDays,
      totalMinutes,
      lastMeditationDate: lastDate,
      badges,
      canPostWishWall,
    };
  },

  // 記錄一次冥想：1分=1點、3分=3點、5分=5點
  recordMeditation(durationMinutes: 1 | 3 | 5): {
    pointsEarned: number;
    newPointsTotal: number;
    streakDays: number;
    unlockedBadges: BadgeRecord[];
  } {
    const pointsEarned = durationMinutes; // 1分=1點、3分=3點、5分=5點
    const today = new Date().toISOString().split('T')[0];
    const user = this.getUser();

    const newLog: MeditationLog = {
      id: 'log_' + Date.now(),
      userId: user.id,
      durationMinutes,
      pointsEarned,
      meditationDate: today,
      createdAt: new Date().toISOString(),
    };

    const logs = this.getMeditationLogs();
    logs.unshift(newLog);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MEDITATION_LOGS_KEY, JSON.stringify(logs));
    }

    // 更新點數
    const newPointsTotal = this.addPoints(pointsEarned);

    // 重新計算連續天數並檢查里程碑
    const { streakDays } = this.calculateStreak();
    const unlockedBadges: BadgeRecord[] = [];

    // 里程碑 1：達 7 天 -> 解鎖「宇宙告訴你的一句話（金句卡）」
    if (streakDays >= 7 && !this.hasBadge('7_days_quote')) {
      const rewardCard = COSMIC_ONE_LINERS[0];
      const badge = this.awardBadge('7_days_quote', rewardCard);
      unlockedBadges.push(badge);
    }

    // 里程碑 2：達 21 天 -> 解鎖「宇宙願望牆」許願權限
    if (streakDays >= 21 && !this.hasBadge('21_days_wish')) {
      const badge = this.awardBadge('21_days_wish');
      unlockedBadges.push(badge);
    }

    return {
      pointsEarned,
      newPointsTotal,
      streakDays,
      unlockedBadges,
    };
  },

  // 取得今日已從冥想累積獲得的點數 (每日上限 10 點)
  getTodayMeditationPointsEarned(): number {
    const today = new Date().toISOString().split('T')[0];
    const logs = this.getMeditationLogs();
    return logs
      .filter((l) => l.meditationDate === today)
      .reduce((sum, l) => sum + (l.pointsEarned || 0), 0);
  },

  // V4 專屬冥想紀錄邏輯：
  // 1分=1點、3分=3點、5分=5點、10分=10點，時間不限，每日最多賺取 10 點
  // 超過 10 點後正常計算連續天數 (Streak) 與解鎖徽章，但不再發放額外點數
  recordMeditationV4(durationMinutes: number): {
    pointsEarned: number;
    newPointsTotal: number;
    streakDays: number;
    unlockedBadges: BadgeRecord[];
    todayPointsTotal: number;
    isDailyCapReached: boolean;
  } {
    const today = new Date().toISOString().split('T')[0];
    const user = this.getUser();
    const todayAlreadyEarned = this.getTodayMeditationPointsEarned();
    const dailyCap = 10;
    const remainingAllowance = Math.max(0, dailyCap - todayAlreadyEarned);

    // 單次應得點數 (分鐘數，1~10 點)
    const potentialPoints = Math.min(10, Math.max(1, Math.floor(durationMinutes)));
    // 實際發放點數 (受每日 10 點上限約束)
    const pointsEarned = Math.min(potentialPoints, remainingAllowance);

    const newLog: MeditationLog = {
      id: 'log_v4_' + Date.now(),
      userId: user.id,
      durationMinutes: Math.min(60, Math.max(1, Math.floor(durationMinutes))) as 1 | 3 | 5,
      pointsEarned,
      meditationDate: today,
      createdAt: new Date().toISOString(),
    };

    const logs = this.getMeditationLogs();
    logs.unshift(newLog);
    if (typeof window !== 'undefined') {
      localStorage.setItem(MEDITATION_LOGS_KEY, JSON.stringify(logs));
    }

    // 只有在實際有發放點數時才增加餘額
    const newPointsTotal = pointsEarned > 0 ? this.addPoints(pointsEarned) : this.getPoints();
    const { streakDays } = this.calculateStreak();
    const unlockedBadges: BadgeRecord[] = [];

    // 連續 7 天里程碑：解鎖「宇宙告訴你的一句話（深度金句卡）」
    if (streakDays >= 7 && !this.hasBadge('7_days_quote')) {
      const rewardCard = COSMIC_ONE_LINERS[0];
      const badge = this.awardBadge('7_days_quote', rewardCard);
      unlockedBadges.push(badge);
    }

    // 連續 21 天里程碑：解鎖「宇宙願望牆」
    if (streakDays >= 21 && !this.hasBadge('21_days_wish')) {
      const badge = this.awardBadge('21_days_wish');
      unlockedBadges.push(badge);
    }

    const todayPointsTotal = todayAlreadyEarned + pointsEarned;

    return {
      pointsEarned,
      newPointsTotal,
      streakDays,
      unlockedBadges,
      todayPointsTotal,
      isDailyCapReached: todayPointsTotal >= dailyCap,
    };
  },

  // --------------------------------------------------------------------------
  // 靈魂抽籤 / 每日免費 1 次抽卡邏輯
  // --------------------------------------------------------------------------
  canFreeCardDraw(): boolean {
    if (typeof window === 'undefined') return true;
    const today = new Date().toISOString().split('T')[0];
    const lastDate = localStorage.getItem('soul_oracle_last_card_draw_date');
    return lastDate !== today;
  },

  recordCardDraw(costPoints = 5): { isFree: boolean; success: boolean; newPoints: number; message: string } {
    const isFree = this.canFreeCardDraw();
    const today = new Date().toISOString().split('T')[0];

    if (isFree) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soul_oracle_last_card_draw_date', today);
      }
      return {
        isFree: true,
        success: true,
        newPoints: this.getPoints(),
        message: '今日首次靈魂抽卡免費！願宇宙星光與智慧指引你的當下。',
      };
    }

    // 超額抽卡需扣除指定點數
    const deducted = this.deductPoints(costPoints);
    if (!deducted) {
      return {
        isFree: false,
        success: false,
        newPoints: this.getPoints(),
        message: `心靈星光不足！今日已用過免費次數，超額探索需要 ${costPoints} 點，當前餘額為 ${this.getPoints()} 點。可前往每日冥想賺取點數！`,
      };
    }

    return {
      isFree: false,
      success: true,
      newPoints: this.getPoints(),
      message: `已扣除 ${costPoints} 點心靈星光，展開深度靈魂共振探索！`,
    };
  },

  // --------------------------------------------------------------------------
  // 心事書寫與肯定句互動賺點機制
  // --------------------------------------------------------------------------
  awardInteractionPoints(type: 'release_journal' | 'affirmation_seed'): number {
    const pointsToAdd = type === 'release_journal' ? 3 : 2;
    return this.addPoints(pointsToAdd);
  },

  // --------------------------------------------------------------------------
  // 宇宙願望牆 (21天免費送1次，超額扣除 20 點)
  // --------------------------------------------------------------------------
  hasClaimedFreeWish(): boolean {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('soul_oracle_wish_free_claimed') === 'true';
  },

  canPostWishWall(): { canPost: boolean; isFree: boolean; costPoints: number; reason?: string } {
    const { streakDays } = this.calculateStreak();
    const has21Days = streakDays >= 21 || this.hasBadge('21_days_wish');

    if (!has21Days) {
      return {
        canPost: false,
        isFree: false,
        costPoints: 20,
        reason: '需達成連續 21 天冥想調頻，方可解鎖宇宙願望牆傳達權限。',
      };
    }

    const freeClaimed = this.hasClaimedFreeWish();
    if (!freeClaimed) {
      return {
        canPost: true,
        isFree: true,
        costPoints: 0,
      };
    }

    // 超額願望：需要消耗 20 點
    const currentPoints = this.getPoints();
    const canAfford = currentPoints >= 20;
    return {
      canPost: canAfford,
      isFree: false,
      costPoints: 20,
      reason: canAfford ? undefined : `超額傳達願望需消耗 20 點心靈星光，當前餘額為 ${currentPoints} 點。`,
    };
  },

  // 宇宙願望牆 (連續 21 天解鎖後留下的願望)
  getWishWall(): WishWallItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(WISH_WALL_KEY);
      if (!data) {
        // 初始預設願望
        const initialWishes: WishWallItem[] = [
          {
            id: 'wish_init_1',
            userId: 'user_star_seed',
            authorNickname: '星光旅人 ‧ 艾爾',
            wishContent: '完成了 21 天的每日呼吸冥想，願所有走到這裡的靈魂，都能找到回家的平靜與安穩。',
            isPublic: true,
            likesCount: 28,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          },
          {
            id: 'wish_init_2',
            userId: 'user_light_worker',
            authorNickname: '心靈守護者',
            wishContent: '願金錢與愛像陽光般毫無阻礙地流動到每一個需要的人身邊，我們都是值得被愛的。',
            isPublic: true,
            likesCount: 42,
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          },
        ];
        localStorage.setItem(WISH_WALL_KEY, JSON.stringify(initialWishes));
        return initialWishes;
      }
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  postWishWall(
    wishContent: string,
    isPublic = true
  ): { success: boolean; item?: WishWallItem; message: string; newPoints: number } {
    const check = this.canPostWishWall();
    if (!check.canPost) {
      return {
        success: false,
        message: check.reason || '尚無法發布願望',
        newPoints: this.getPoints(),
      };
    }

    if (check.isFree) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soul_oracle_wish_free_claimed', 'true');
      }
    } else {
      // 扣除 20 點
      const deducted = this.deductPoints(20);
      if (!deducted) {
        return {
          success: false,
          message: `心靈點數不足！超額發布願望需要 20 點，當前餘額為 ${this.getPoints()} 點。`,
          newPoints: this.getPoints(),
        };
      }
    }

    const list = this.getWishWall();
    const user = this.getUser();
    const newItem: WishWallItem = {
      id: 'wish_wall_' + Date.now(),
      userId: user.id,
      authorNickname: user.nickname || '星光旅人',
      wishContent,
      isPublic,
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };
    list.unshift(newItem);
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISH_WALL_KEY, JSON.stringify(list));
    }

    return {
      success: true,
      item: newItem,
      message: check.isFree
        ? '已成功享有 21 天免費名額，願望已送入宇宙共振場域！'
        : '已消耗 20 點心靈星光，願望已送入宇宙共振場域！',
      newPoints: this.getPoints(),
    };
  },

  likeWishWallItem(id: string): void {
    const list = this.getWishWall();
    const item = list.find((w) => w.id === id);
    if (item) {
      item.likesCount += 1;
      if (typeof window !== 'undefined') {
        localStorage.setItem(WISH_WALL_KEY, JSON.stringify(list));
      }
    }
  },

  // 心靈音樂播放器與點數解鎖
  getMusicTracks(): MusicTrack[] {
    return DEFAULT_MUSIC_TRACKS;
  },

  getUnlockedMusicTrackIds(): string[] {
    if (typeof window === 'undefined') return ['track_432', 'track_528'];
    try {
      const data = localStorage.getItem(UNLOCKED_MUSIC_KEY);
      if (!data) {
        // 預設已解鎖免費音樂
        const init = ['track_432', 'track_528'];
        localStorage.setItem(UNLOCKED_MUSIC_KEY, JSON.stringify(init));
        return init;
      }
      return JSON.parse(data);
    } catch {
      return ['track_432', 'track_528'];
    }
  },

  isMusicTrackUnlocked(trackId: string): boolean {
    const unlocked = this.getUnlockedMusicTrackIds();
    return unlocked.includes(trackId);
  },

  unlockMusicTrack(track: MusicTrack): { success: boolean; message: string; newPoints: number } {
    if (this.isMusicTrackUnlocked(track.id)) {
      return { success: true, message: '音樂已解鎖', newPoints: this.getPoints() };
    }

    if (track.pricePoints > 0) {
      const deducted = this.deductPoints(track.pricePoints);
      if (!deducted) {
        return {
          success: false,
          message: `心靈點數不足！解鎖需要 ${track.pricePoints} 點，當前餘額為 ${this.getPoints()} 點。`,
          newPoints: this.getPoints(),
        };
      }
    }

    const unlocked = this.getUnlockedMusicTrackIds();
    unlocked.push(track.id);
    if (typeof window !== 'undefined') {
      localStorage.setItem(UNLOCKED_MUSIC_KEY, JSON.stringify(unlocked));
    }

    return {
      success: true,
      message: `成功消耗 ${track.pricePoints} 點解鎖「${track.title}」！`,
      newPoints: this.getPoints(),
    };
  },

  // 心事提問紀錄
  getInquiries(): SoulInquiryRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(INQUIRIES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveInquiry(inquiry: Omit<SoulInquiryRecord, 'id' | 'createdAt' | 'isTransformed'>): SoulInquiryRecord {
    const list = this.getInquiries();
    const newRecord: SoulInquiryRecord = {
      ...inquiry,
      id: 'inq_' + Date.now(),
      createdAt: new Date().toISOString(),
      isTransformed: false,
    };
    list.unshift(newRecord);
    if (typeof window !== 'undefined') {
      localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
    }
    return newRecord;
  },

  markTransformed(id: string, notes?: string): void {
    const list = this.getInquiries();
    const item = list.find((i) => i.id === id);
    if (item) {
      item.isTransformed = true;
      item.transformedAt = new Date().toISOString();
      if (notes) item.transformationNotes = notes;
      if (typeof window !== 'undefined') {
        localStorage.setItem(INQUIRIES_KEY, JSON.stringify(list));
      }
    }
  },

  // 願望紀錄
  getWishes(): SoulWishRecord[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(WISHES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveWish(wish: Omit<SoulWishRecord, 'id' | 'createdAt' | 'isManifested'>): SoulWishRecord {
    const list = this.getWishes();
    const newRecord: SoulWishRecord = {
      ...wish,
      id: 'wish_' + Date.now(),
      createdAt: new Date().toISOString(),
      isManifested: false,
    };
    list.unshift(newRecord);
    if (typeof window !== 'undefined') {
      localStorage.setItem(WISHES_KEY, JSON.stringify(list));
    }
    return newRecord;
  },

  markManifested(id: string, gratitudeNotes?: string): void {
    const list = this.getWishes();
    const item = list.find((w) => w.id === id);
    if (item) {
      item.isManifested = true;
      item.manifestedAt = new Date().toISOString();
      if (gratitudeNotes) item.gratitudeNotes = gratitudeNotes;
      if (typeof window !== 'undefined') {
        localStorage.setItem(WISHES_KEY, JSON.stringify(list));
      }
    }
  },
};
