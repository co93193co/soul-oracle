import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// 若有填寫 Supabase 則建立連線，否則保持 null 以啟用優雅降級
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Google 一鍵登入
export async function signInWithGoogleOAuth() {
  if (supabase) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : undefined,
      },
    });
    return { data, error };
  } else {
    // 尚未綁定 Supabase 時，傳回提示
    return { data: null, error: new Error('SUPABASE_NOT_CONFIGURED') };
  }
}
