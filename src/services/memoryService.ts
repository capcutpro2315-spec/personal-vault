import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { MemoryItem } from '../types';

export const memoryService = {
  async fetchMemories(): Promise<MemoryItem[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .order('memory_date', { ascending: false });

    if (error) return [];

    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      location: row.location,
      date: row.memory_date,
      imageUrl: row.image_path || 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=800',
      description: row.description,
      category: 'Memory',
      tags: row.tags || [],
    }));
  },

  async addMemory(memory: Partial<MemoryItem>, imageFile?: File): Promise<MemoryItem | null> {
    if (!isSupabaseConfigured) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('User authentication required.');

    let imagePath = memory.imageUrl || '';

    if (imageFile) {
      const sanitized = `${Date.now()}_${imageFile.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
      const path = `${userData.user.id}/${sanitized}`;
      await supabase.storage.from('memories').upload(path, imageFile, { upsert: true });
      const { data: urlData } = supabase.storage.from('memories').getPublicUrl(path);
      imagePath = urlData.publicUrl;
    }

    const payload = {
      user_id: userData.user.id,
      title: memory.title || 'Untitled Memory',
      description: memory.description || '',
      location: memory.location || null,
      image_path: imagePath,
      memory_date: memory.date || new Date().toISOString().split('T')[0],
      tags: memory.tags || [],
    };

    const { data, error } = await supabase
      .from('memories')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      location: data.location,
      date: data.memory_date,
      imageUrl: data.image_path,
      description: data.description,
      category: 'Memory',
      tags: data.tags || [],
    };
  },

  async deleteMemory(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.from('memories').delete().eq('id', id);
    }
  },
};
