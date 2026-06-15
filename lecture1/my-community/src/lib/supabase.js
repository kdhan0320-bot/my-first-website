import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://bdduqvlseejvcuboston.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJkZHVxdmxzZWVqdmN1Ym9zdG9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4NTc1MjYsImV4cCI6MjA5NjQzMzUyNn0.IRlvxF95MNtE6lBkatuDMlFcQ_T5lcpYrCFF-o1nxfM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
