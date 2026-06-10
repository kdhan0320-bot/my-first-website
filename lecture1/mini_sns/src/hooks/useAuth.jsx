import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../utils/supabase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
    setLoading(false);
  };

  const signUp = async (username, nickname, password) => {
    const email = `${username}@gamestagram.app`;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    if (data.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        username,
        nickname,
        profile_image_url: getRandomGameAvatar(),
      });
      if (profileError) throw profileError;
    }
    return data;
  };

  const signIn = async (username, password) => {
    const email = `${username}@gamestagram.app`;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

const GAME_AVATARS = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=mario',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=link',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=samus',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=kirby',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=pikachu',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=sonic',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=cloud',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=kratos',
];

export const getRandomGameAvatar = () =>
  GAME_AVATARS[Math.floor(Math.random() * GAME_AVATARS.length)];

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export default AuthContext;
