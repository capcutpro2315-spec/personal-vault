import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { TripItem } from '../types';

export const tripService = {
  async fetchTrips(): Promise<TripItem[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) return [];

    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      destination: row.destination || row.name,
      dates: row.start_date ? `${row.start_date} – ${row.end_date}` : 'Multiple visits',
      memoryCount: 24,
      coverImage: row.cover_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
      photos: [row.cover_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800'],
      notes: row.description || '',
      placesVisited: ['City Center', 'Scenic Landmark'],
      expenses: [{ item: 'Travel Stay', cost: '₹12,000' }],
      coordinates: { lat: 15.2993, lng: 74.1240 },
    }));
  },

  async addTrip(trip: Partial<TripItem>): Promise<TripItem | null> {
    if (!isSupabaseConfigured) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('User authentication required.');

    const payload = {
      user_id: userData.user.id,
      name: trip.destination || 'Trip Destination',
      destination: trip.destination || 'Travel Location',
      description: trip.notes || '',
      cover_image: trip.coverImage || null,
    };

    const { data, error } = await supabase
      .from('trips')
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return {
      id: data.id,
      userId: data.user_id,
      destination: data.destination,
      dates: 'Recently logged',
      memoryCount: 1,
      coverImage: data.cover_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
      photos: [data.cover_image || 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800'],
      notes: data.description || '',
      placesVisited: [data.destination],
      expenses: [],
      coordinates: { lat: 15.2993, lng: 74.1240 },
    };
  },

  async deleteTrip(id: string): Promise<void> {
    if (isSupabaseConfigured) {
      await supabase.from('trips').delete().eq('id', id);
    }
  },
};
