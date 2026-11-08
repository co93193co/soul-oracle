import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';
import { DEFAULT_MUSIC_TRACKS } from '@/lib/storage';

export async function GET(req: NextRequest) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .eq('is_active', true)
        .order('price_points', { ascending: true });

      if (!error && data && data.length > 0) {
        return NextResponse.json({ tracks: data });
      }
    }
    // 優雅降級返回預設音樂清單
    return NextResponse.json({ tracks: DEFAULT_MUSIC_TRACKS });
  } catch {
    return NextResponse.json({ tracks: DEFAULT_MUSIC_TRACKS });
  }
}
