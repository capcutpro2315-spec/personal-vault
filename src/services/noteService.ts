import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NoteItem } from '../types';

export const noteService = {
  async fetchNotes(): Promise<NoteItem[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) return [];

    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      content: row.content,
      category: row.category || 'General',
      updatedAt: row.updated_at ? row.updated_at.split('T')[0] : new Date().toISOString().split('T')[0],
      tags: row.tags || [],
    }));
  },

  async addNote(note: Partial<NoteItem>): Promise<NoteItem | null> {
    if (!isSupabaseConfigured) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('User authentication required.');

    const payload = {
      user_id: userData.user.id,
      title: note.title || 'Untitled Note',
      content: note.content || '',
      category: note.category || 'General',
      tags: note.tags || [],
    };

    const { data, error } = await supabase
      .from('notes')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      content: data.content,
      category: data.category,
      updatedAt: data.updated_at.split('T')[0],
      tags: data.tags || [],
    };
  },

  async deleteNote(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.from('notes').delete().eq('id', id);
    }
  },
};
