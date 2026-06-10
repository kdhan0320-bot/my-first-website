import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ucuwhxsyvagdzersyqrf.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVjdXdoeHN5dmFnZHplcnN5cXJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA4Nzk4MDcsImV4cCI6MjA5NjQ1NTgwN30.EWutL4VdOOUNdSTLeHyCJz0CEKPRyhpxWP69NyT6cJk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
