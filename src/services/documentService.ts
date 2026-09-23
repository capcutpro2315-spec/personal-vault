import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DocumentItem } from '../types';

export const documentService = {
  /**
   * Fetches user documents from Supabase documents table
   */
  async fetchDocuments(): Promise<DocumentItem[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Failed to fetch documents from Supabase:', error);
      return [];
    }

    return (data || []).map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      title: row.name,
      fileName: row.file_name,
      fileSize: row.file_size,
      fileType: row.file_type,
      category: row.category,
      uploadDate: row.created_at ? row.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
      expiryDate: row.expiry_date,
      securityStatus: row.category === 'Identity Documents' ? 'AES-256 Encrypted' : 'Protected',
      tags: row.tags || [],
    }));
  },

  /**
   * Uploads file to Supabase storage documents bucket and saves row in documents table
   */
  async uploadDocument(file: File, metadata: Partial<DocumentItem>): Promise<DocumentItem | null> {
    // Validate file size (max 25MB)
    const MAX_SIZE = 25 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      throw new Error('File size exceeds the maximum limit of 25MB.');
    }

    if (!isSupabaseConfigured) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) throw new Error('User authentication required.');

    const userId = userData.user.id;
    const sanitizedFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const storagePath = `${userId}/${sanitizedFileName}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(storagePath, file, { upsert: true });

    if (uploadError) {
      console.warn('Storage upload warning:', uploadError);
    }

    // Get public / signed URL
    const { data: urlData } = supabase.storage.from('documents').getPublicUrl(storagePath);

    // Save database record
    const payload = {
      user_id: userId,
      name: metadata.title || file.name,
      category: metadata.category || 'Personal',
      file_name: file.name,
      file_path: storagePath,
      file_type: file.type || 'Document File',
      file_size: `${(file.size / 1024).toFixed(1)} KB`,
      expiry_date: metadata.expiryDate || null,
      tags: metadata.tags || ['Vault'],
    };

    const { data: dbData, error: dbError } = await supabase
      .from('documents')
      .insert(payload)
      .select()
      .single();

    if (dbError) throw new Error(dbError.message);

    return {
      id: dbData.id,
      userId: dbData.user_id,
      title: dbData.name,
      fileName: dbData.file_name,
      fileSize: dbData.file_size,
      fileType: dbData.file_type,
      category: dbData.category,
      uploadDate: dbData.created_at.split('T')[0],
      expiryDate: dbData.expiry_date,
      securityStatus: dbData.category === 'Identity Documents' ? 'AES-256 Encrypted' : 'Protected',
      tags: dbData.tags || [],
    };
  },

  /**
   * Deletes document database record and associated storage file
   */
  async deleteDocument(id: string, filePath?: string): Promise<void> {
    if (!isSupabaseConfigured) return;

    if (filePath) {
      await supabase.storage.from('documents').remove([filePath]);
    }

    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
