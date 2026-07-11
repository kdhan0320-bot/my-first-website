import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { DEMO_CHECKLISTS } from '../constants';

const useChecklist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isGuest } = useAuth();

  const fetch = useCallback(async () => {
    setLoading(true);
    if (isGuest) {
      setItems(DEMO_CHECKLISTS);
      setLoading(false);
      return;
    }
    if (!user) { setItems([]); setLoading(false); return; }
    const { data } = await supabase
      .from('portfolio_checklists')
      .select('*')
      .eq('user_id', user.id)
      .order('sort_order');
    setItems(data ?? []);
    setLoading(false);
  }, [user, isGuest]);

  useEffect(() => { fetch(); }, [fetch]);

  const toggle = async (id, isDone) => {
    if (isGuest) {
      setItems((prev) => prev.map((item) => item.id === id ? { ...item, is_done: isDone } : item));
      return;
    }
    await supabase.from('portfolio_checklists').update({ is_done: isDone, updated_at: new Date().toISOString() }).eq('id', id);
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, is_done: isDone } : item));
  };

  const add = async (title, category) => {
    if (isGuest) return;
    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) + 1 : 1;
    const { data } = await supabase
      .from('portfolio_checklists')
      .insert([{ title, category, is_done: false, sort_order: maxOrder, user_id: user.id }])
      .select()
      .single();
    if (data) setItems((prev) => [...prev, data]);
  };

  const remove = async (id) => {
    if (isGuest) return;
    await supabase.from('portfolio_checklists').delete().eq('id', id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, loading, toggle, add, remove };
};

export default useChecklist;
