import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

/* env 변수가 없으면 클라이언트를 만들지 않고 null을 내보낸다.
 * 호출부는 반드시 null 체크 후 fallback 데이터를 사용해야 한다(실제 키 값은 로그에 남기지 않는다). */
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (!supabase && import.meta.env.DEV) {
  console.warn('[supabase] VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY가 설정되지 않아 fallback 데이터만 사용합니다.');
}
