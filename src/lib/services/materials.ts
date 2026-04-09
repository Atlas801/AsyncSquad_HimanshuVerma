import { supabase } from '../supabase';
import { Material } from '@/types';

export async function getMaterials(): Promise<Material[]> {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('name', { ascending: true });
  
  if (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
  return data as Material[];
}

export async function upsertMaterial(material: Partial<Material>): Promise<Material> {
  const { data, error } = await supabase
    .from('materials')
    .upsert(material)
    .select()
    .single();

  if (error) {
    console.error('Error upserting material:', error);
    throw error;
  }
  return data as Material;
}

export async function deleteMaterial(id: string): Promise<void> {
  const { error } = await supabase
    .from('materials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting material:', error);
    throw error;
  }
}
