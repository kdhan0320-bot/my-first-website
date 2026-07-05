import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[JobFlow] Supabase 환경변수가 설정되지 않았습니다. .env 파일을 확인해주세요. (게스트 모드는 계속 사용할 수 있습니다)');
}

// 환경변수가 없어도 앱이 크래시하지 않도록 더미 값으로 폴백합니다.
// 실제 데이터 조회는 실패하지만 게스트 모드(샘플 데이터)는 정상 동작합니다.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);
