import { supabase } from './supabase';

export interface Package {
  id: string;
  badge: string;
  name: string;
  price: number;
  day_cost: number;
  features: string[];
  image_url?: string;
}

export interface BurialLocation {
  id: string;
  name: string;
  address: string;
  tag: string;
}

export interface Addition {
  id: string;
  name: string;
  price: number;
}

export async function getPackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error('Gagal memuat paket: ' + error.message);
  return data as Package[];
}

export async function getLocations(): Promise<BurialLocation[]> {
  const { data, error } = await supabase
    .from('burial_locations')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error('Gagal memuat lokasi: ' + error.message);
  return data as BurialLocation[];
}

export async function getAdditions(): Promise<Addition[]> {
  const { data, error } = await supabase
    .from('additions')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) throw new Error('Gagal memuat layanan tambahan: ' + error.message);
  return data as Addition[];
}

export async function insertOrder(orderData: {
  deceased_name: string | null;
  deceased_age: string | null;
  death_date: string | null;
  pic_name: string | null;
  pic_phone: string | null;
  package_id: string;
  package_name: string;
  package_price: number;
  days_at_mourning_house: number;
  day_cost: number;
  burial_type: string;
  burial_location_id: string | null;
  burial_location_name: string;
  burial_location_address: string | null;
  additional_services: { id: string; name: string; price: number }[];
  additional_cost: number;
  special_notes: string | null;
  total_price: number;
}): Promise<{ ref_code: string }> {
  const { data, error } = await supabase
    .from('orders')
    .insert({
      deceased_name: orderData.deceased_name,
      deceased_age: orderData.deceased_age,
      death_date: orderData.death_date,
      pic_name: orderData.pic_name,
      pic_phone: orderData.pic_phone,
      package_id: orderData.package_id,
      package_name: orderData.package_name,
      package_price: orderData.package_price,
      days_at_mourning_house: orderData.days_at_mourning_house,
      day_cost: orderData.day_cost,
      burial_type: orderData.burial_type,
      burial_location_id: orderData.burial_location_id,
      burial_location_name: orderData.burial_location_name,
      burial_location_address: orderData.burial_location_address,
      additional_services: orderData.additional_services,
      additional_cost: orderData.additional_cost,
      special_notes: orderData.special_notes,
      total_price: orderData.total_price,
      // ref_code otomatis oleh trigger — tidak perlu dikirim
    })
    .select('ref_code')
    .single();

  if (error) throw new Error('Gagal menyimpan: ' + error.message);
  return data as { ref_code: string };
}