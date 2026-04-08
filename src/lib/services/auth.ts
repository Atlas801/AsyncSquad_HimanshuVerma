import { supabase } from '../supabase';

export const getCurrentUser = async () => {
  if (!supabase) return null;

  const { data: { session }, error } = await supabase.auth.getSession();
  if (error || !session) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return profile;
};

export const signOut = async () => {
  if (!supabase) return;
  await supabase.auth.signOut();
};
