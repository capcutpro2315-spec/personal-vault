import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { UserProfile } from '../types';

export const authService = {
  /**
   * Signs up a new user with email and password
   */
  async signUp(fullName: string, email: string, pass: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) {
      return {
        id: 'user-demo',
        email,
        fullName,
        createdAt: new Date().toISOString(),
        isBiometricEnabled: true,
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        throw new Error('An account with this email address already exists. Please log in instead.');
      }
      throw new Error(error.message || 'Failed to create vault account.');
    }

    if (data.user) {
      return {
        id: data.user.id,
        email: data.user.email || email,
        fullName,
        createdAt: data.user.created_at,
        isBiometricEnabled: true,
      };
    }

    return null;
  },

  /**
   * Logs in an existing user
   */
  async signIn(email: string, pass: string): Promise<UserProfile> {
    if (!isSupabaseConfigured) {
      return {
        id: 'user-demo',
        email,
        fullName: email.split('@')[0] || 'Vishnu Sharma',
        createdAt: new Date().toISOString(),
        isBiometricEnabled: true,
      };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });

    if (error) {
      throw new Error('Invalid email or password. Please check your credentials.');
    }

    // Fetch user profile
    const profile = await this.getProfile(data.user.id);
    return profile || {
      id: data.user.id,
      email: data.user.email || email,
      fullName: data.user.user_metadata?.full_name || 'Vault User',
      createdAt: data.user.created_at,
      isBiometricEnabled: true,
    };
  },

  /**
   * Logs out current user
   */
  async signOut(): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
  },

  /**
   * Triggers password reset email
   */
  async resetPassword(email: string): Promise<void> {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw new Error(error.message);
    }
  },

  /**
   * Fetches user profile from profiles table
   */
  async getProfile(userId: string): Promise<UserProfile | null> {
    if (!isSupabaseConfigured) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      email: data.email,
      fullName: data.full_name,
      avatarUrl: data.avatar_url,
      createdAt: data.created_at,
      isBiometricEnabled: data.is_biometric_enabled ?? true,
    };
  },

  /**
   * Updates user profile info
   */
  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<void> {
    if (isSupabaseConfigured) {
      const payload: any = {};
      if (updates.fullName) payload.full_name = updates.fullName;
      if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
      if (updates.isBiometricEnabled !== undefined) payload.is_biometric_enabled = updates.isBiometricEnabled;
      payload.updated_at = new Date().toISOString();

      await supabase.from('profiles').update(payload).eq('id', userId);
    }
  },
};
