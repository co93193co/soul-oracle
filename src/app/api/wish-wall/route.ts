import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase/client';

export async function GET(req: NextRequest) {
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('wish_wall')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data) {
        return NextResponse.json({ wishes: data });
      }
    }
    return NextResponse.json({ wishes: [] });
  } catch {
    return NextResponse.json({ wishes: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, wishContent, isPublic, authorNickname } = await req.json();

    if (!wishContent || !wishContent.trim()) {
      return NextResponse.json({ error: '請輸入願望內容' }, { status: 400 });
    }

    if (supabase && userId) {
      const { data, error } = await supabase
        .from('wish_wall')
        .insert([
          {
            user_id: userId,
            wish_content: wishContent,
            is_public: isPublic ?? true,
            author_nickname: authorNickname || '星光旅人',
          },
        ])
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ wish: data });
      }
    }

    return NextResponse.json({
      wish: {
        id: 'wish_wall_' + Date.now(),
        userId: userId || 'local_user',
        authorNickname: authorNickname || '星光旅人',
        wishContent,
        isPublic: isPublic ?? true,
        likesCount: 0,
        createdAt: new Date().toISOString(),
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
