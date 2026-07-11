import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { DEMO_INTERVIEW_NOTES } from '../constants';

const useInterviewNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isGuest } = useAuth();

  const fetch = useCallback(async () => {
    setLoading(true);
    if (isGuest) { setNotes(DEMO_INTERVIEW_NOTES); setLoading(false); return; }
    if (!user) { setNotes([]); setLoading(false); return; }
    const { data } = await supabase
      .from('interview_notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setNotes(data ?? []);
    setLoading(false);
  }, [user, isGuest]);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (payload) => {
    if (isGuest) return;
    const { data } = await supabase
      .from('interview_notes')
      .insert([{ ...payload, user_id: user.id }])
      .select()
      .single();
    if (data) setNotes((prev) => [data, ...prev]);
  };

  const toggleReview = async (id, val) => {
    if (isGuest) {
      setNotes((prev) => prev.map((n) => n.id === id ? { ...n, is_reviewed: val } : n));
      return;
    }
    await supabase.from('interview_notes').update({ is_reviewed: val }).eq('id', id);
    setNotes((prev) => prev.map((n) => n.id === id ? { ...n, is_reviewed: val } : n));
  };

  const remove = async (id) => {
    if (isGuest) return;
    await supabase.from('interview_notes').delete().eq('id', id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return { notes, loading, add, toggleReview, remove };
};

export default useInterviewNotes;
