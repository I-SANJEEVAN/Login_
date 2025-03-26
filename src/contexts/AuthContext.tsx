import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, User } from '../types';
import { supabase } from '../supabase';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setState({ user: session.user as User, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setState({ user: session?.user as User || null, loading: false });
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;
      toast.success('Successfully signed up! Please check your email.');
      navigate('/newsletter');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Successfully signed in!');
      navigate('/newsletter');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Successfully signed out!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', state.user?.id);
      
      if (error) throw error;
      setState(prev => ({
        ...prev,
        user: { ...prev.user!, ...data }
      }));
      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, signUp, signIn, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};