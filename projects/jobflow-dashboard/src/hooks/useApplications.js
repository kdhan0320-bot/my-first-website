import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { DEMO_APPLICATIONS } from '../constants';

const normalizeApplicationPayload = (payload) => {
  const normalized = { ...payload };
  if ('applied_date' in payload) normalized.applied_date = payload.applied_date || null;
  if ('deadline' in payload) normalized.deadline = payload.deadline || null;
  return normalized;
};

const useApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user, isGuest } = useAuth();

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    if (isGuest) {
      setApplications(DEMO_APPLICATIONS);
      setLoading(false);
      return;
    }
    if (!user) {
      setApplications([]);
      setLoading(false);
      return;
    }
    const { data, error: err } = await supabase
      .from('applications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setApplications(data ?? []);
    setLoading(false);
  }, [user, isGuest]);

  useEffect(() => { fetch(); }, [fetch]);

  const add = async (payload) => {
    if (isGuest) return;
    const normalizedPayload = normalizeApplicationPayload(payload);
    const { data, error: err } = await supabase
      .from('applications')
      .insert([{ ...normalizedPayload, user_id: user.id }])
      .select()
      .single();
    if (err) throw err;
    setApplications((prev) => [data, ...prev]);
    return data;
  };

  const update = async (id, payload) => {
    if (isGuest) return;
    const normalizedPayload = normalizeApplicationPayload(payload);
    const { data, error: err } = await supabase
      .from('applications')
      .update({ ...normalizedPayload, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    if (err) throw err;
    setApplications((prev) => prev.map((a) => (a.id === id ? data : a)));
    return data;
  };

  const remove = async (id) => {
    if (isGuest) return;
    const { error: err } = await supabase.from('applications').delete().eq('id', id);
    if (err) throw err;
    setApplications((prev) => prev.filter((a) => a.id !== id));
  };

  return { applications, loading, error, refresh: fetch, add, update, remove };
};

export default useApplications;
