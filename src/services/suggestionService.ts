import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { AiSuggestionItem } from '../types';

export const suggestionService = {
  async fetchSuggestions(): Promise<AiSuggestionItem[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('ai_suggestions')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (error) return [];

    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      icon: 'Sparkles',
      type: row.type || 'photo_detected',
      description: row.description || row.title,
      timestamp: 'Recently',
      actionText: 'Add to Vault',
    }));
  },

  async updateSuggestionStatus(id: string, status: 'accepted' | 'dismissed'): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase
        .from('ai_suggestions')
        .update({ status })
        .eq('id', id);
    }
  },
};
