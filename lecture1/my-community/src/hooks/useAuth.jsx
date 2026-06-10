import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    setProfile(data);
  };

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) fetchProfile(session.user.id);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async ({ username, password, phone }) => {
    const email = `${username}@gamehub.com`;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;

    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      username,
      phone: phone || null,
    });
    if (profileError) throw profileError;
    await fetchProfile(data.user.id);
    return data;
  };

  const signIn = async ({ username, password }) => {
    const email = `${username}@gamehub.com`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const checkUsernameAvailable = async (username) => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('username', username)
      .single();
    return !data;
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, checkUsernameAvailable }}>
      {children}
    </AuthContext.Provider>
  );
};
