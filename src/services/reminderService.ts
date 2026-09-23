import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ReminderItem } from '../types';

export const reminderService = {
  async fetchReminders(): Promise<ReminderItem[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .order('reminder_date', { ascending: true });

    if (error) return [];

    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      title: row.title,
      dueDate: row.reminder_date,
      category: 'Meeting',
      status: row.completed ? 'Completed' : 'Pending',
      priority: 'Medium',
    }));
  },

  async toggleReminder(id: string, currentStatus: boolean): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase
        .from('reminders')
        .update({ completed: !currentStatus, updated_at: new Date().toISOString() })
        .eq('id', id);
    }
  },

  async addReminder(title: string, date: string): Promise<ReminderItem | null> {
    if (!isSupabaseConfigured) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('User authentication required.');

    const payload = {
      user_id: userData.user.id,
      title,
      reminder_date: date || new Date().toISOString(),
      completed: false,
    };

    const { data, error } = await supabase
      .from('reminders')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.user_id,
      title: data.title,
      dueDate: data.reminder_date,
      category: 'Personal',
      status: 'Pending',
      priority: 'Medium',
    };
  },
};
