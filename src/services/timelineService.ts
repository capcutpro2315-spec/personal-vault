import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TimelineEntry } from '../types';

export const timelineService = {
  async fetchTimelineEntries(): Promise<TimelineEntry[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('timeline_entries')
      .select('*')
      .order('entry_date', { ascending: false });

    if (error) return [];

    return (data || []).map((row: any) => {
      const entryDate = new Date(row.entry_date || row.created_at);
      return {
        id: row.id,
        userId: row.user_id,
        year: entryDate.getFullYear(),
        month: entryDate.toLocaleString('en-US', { month: 'long' }) + ' ' + entryDate.getFullYear(),
        date: row.entry_date ? row.entry_date.split('T')[0] : new Date().toISOString().split('T')[0],
        title: row.title,
        category: row.category,
        location: row.location,
        description: row.description,
        imageUrl: row.image_path,
        tags: row.tags || [],
      };
    });
  },

  async addTimelineEntry(entry: Partial<TimelineEntry>): Promise<TimelineEntry | null> {
    if (!isSupabaseConfigured) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('User authentication required.');

    const payload = {
      user_id: userData.user.id,
      title: entry.title || 'Milestone',
      description: entry.description || '',
      category: entry.category || 'Memory',
      location: entry.location || null,
      entry_date: new Date().toISOString(),
      image_path: entry.imageUrl || null,
      tags: entry.tags || [],
    };

    const { data, error } = await supabase
      .from('timeline_entries')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const entryDate = new Date(data.entry_date);
    return {
      id: data.id,
      userId: data.user_id,
      year: entryDate.getFullYear(),
      month: entryDate.toLocaleString('en-US', { month: 'long' }) + ' ' + entryDate.getFullYear(),
      date: data.entry_date.split('T')[0],
      title: data.title,
      category: data.category,
      location: data.location,
      description: data.description,
      imageUrl: data.image_path,
      tags: data.tags || [],
    };
  },

  async deleteTimelineEntry(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.from('timeline_entries').delete().eq('id', id);
    }
  },
};
