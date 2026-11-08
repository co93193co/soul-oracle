import { OracleCardData, PRESET_CARDS } from './presets/cardsData';
import { MusicTrack, DEFAULT_MUSIC_TRACKS } from './storage';

/**
 * Google 試算表 (Google Sheets as Headless CMS) 整合模組
 *
 * 使用方式：
 * 1. 在 Google Drive 建立一張 Google 試算表，分成兩個工作表 (Sheet Tabs)：
 *    - 工作表 1 名稱：「Cards」
 *    - 工作表 2 名稱：「Music」
 * 2. 在試算表中點選「檔案」➔「共用」➔「發布到網絡」➔ 選擇「逗號分隔值 (.csv)」或直接發布
 * 3. 將試算表網址中的 SHEET_ID 填入環境變數 GOOGLE_SHEET_ID
 *
 * 本模組特色：
 * - 當未設定 SHEET_ID 或網路異常時，自動 100% 平滑降級回本地精選預設庫 (PRESET_CARDS / DEFAULT_MUSIC_TRACKS)
 * - 支援 60 秒 ISR 快取，在試算表編輯後數十秒內自動反映於全站
 */

export interface GoogleSheetsConfig {
  sheetId?: string;
  cardsGid?: string; // 預設 0
  musicGid?: string;
}

// 簡易純前端/Node 相容 CSV 解析器 (處理引號與換行)
function parseCSV(csvText: string): string[][] {
  const lines: string[][] = [];
  let row: string[] = [];
  let inQuotes = false;
  let currentToken = '';

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentToken += '"';
        i++; // 跳過轉義引號
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(currentToken.trim());
      currentToken = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(currentToken.trim());
      if (row.length > 0 && row.some((col) => col.length > 0)) {
        lines.push(row);
      }
      row = [];
      currentToken = '';
    } else {
      currentToken += char;
    }
  }

  if (currentToken.length > 0 || row.length > 0) {
    row.push(currentToken.trim());
    if (row.some((col) => col.length > 0)) {
      lines.push(row);
    }
  }

  return lines;
}

export const googleSheetsService = {
  /**
   * 從 Google 試算表動態取得牌卡清單 (若無設定或讀取失敗則回傳本地預設牌卡)
   */
  async getCards(sheetId?: string, gid = '0'): Promise<OracleCardData[]> {
    const targetSheetId = sheetId || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
    if (!targetSheetId) {
      return PRESET_CARDS;
    }

    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${targetSheetId}/export?format=csv&gid=${gid}`;
      const res = await fetch(csvUrl, { next: { revalidate: 60 } });
      if (!res.ok) {
        console.warn(`[GoogleSheets] 無法讀取試算表牌卡 (狀態碼 ${res.status})，降級使用本地預設牌卡。`);
        return PRESET_CARDS;
      }

      const csvText = await res.text();
      const rows = parseCSV(csvText);
      if (rows.length <= 1) return PRESET_CARDS;

      // 預期欄位：代號 | 類型(release/manifest) | 分類 | 標題 | 金句 | 指引練習 | 漸變色彩代碼
      const dataRows = rows.slice(1);
      const parsedCards: OracleCardData[] = dataRows
        .filter((r) => r.length >= 5 && r[0])
        .map((r, idx) => ({
          id: `sheet_card_${idx + 1}`,
          code: r[0] || `CARD_${idx + 1}`,
          deckType: (r[1]?.toLowerCase() === 'manifest' ? 'manifest' : 'release') as 'release' | 'manifest',
          category: r[2] || '靈魂覺察',
          title: r[3] || '宇宙的輕語',
          quote: r[4] || '',
          guide: r[5] || '帶著微笑做一次完整的箱型呼吸，感受當下的安定。',
          colorGradient: r[6] || 'from-indigo-900/80 via-purple-900/70 to-slate-900/90',
        }));

      return parsedCards.length > 0 ? parsedCards : PRESET_CARDS;
    } catch (err) {
      console.error('[GoogleSheets] 解析牌卡異常，已自動切換回預設牌卡：', err);
      return PRESET_CARDS;
    }
  },

  /**
   * 從 Google 試算表動態取得音樂庫清單
   */
  async getMusicTracks(sheetId?: string, gid = '1'): Promise<MusicTrack[]> {
    const targetSheetId = sheetId || process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID;
    if (!targetSheetId) {
      return DEFAULT_MUSIC_TRACKS;
    }

    try {
      const csvUrl = `https://docs.google.com/spreadsheets/d/${targetSheetId}/export?format=csv&gid=${gid}`;
      const res = await fetch(csvUrl, { next: { revalidate: 60 } });
      if (!res.ok) {
        return DEFAULT_MUSIC_TRACKS;
      }

      const csvText = await res.text();
      const rows = parseCSV(csvText);
      if (rows.length <= 1) return DEFAULT_MUSIC_TRACKS;

      // 欄位：編號 | 標題 | 簡介 | 時長 | 音樂網址MP3 | 解鎖點數(0=免費) | 分類
      const dataRows = rows.slice(1);
      const parsedTracks: MusicTrack[] = dataRows
        .filter((r) => r.length >= 5 && r[1])
        .map((r, idx) => ({
          id: r[0] || `track_sheet_${idx + 1}`,
          title: r[1] || '靈魂音頻',
          description: r[2] || '純淨調頻音頻，陪伴每一刻專注。',
          durationLabel: r[3] || '10:00',
          audioUrl: r[4] || 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c897f2e1a5.mp3',
          pricePoints: parseInt(r[5] || '0', 10) || 0,
          category: (r[6] || 'meditation') as 'meditation' | 'sleep' | 'healing',
        }));

      return parsedTracks.length > 0 ? parsedTracks : DEFAULT_MUSIC_TRACKS;
    } catch (err) {
      console.error('[GoogleSheets] 解析音樂庫異常，已切換回預設音樂庫：', err);
      return DEFAULT_MUSIC_TRACKS;
    }
  },
};
