import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import { readOptionalEnv } from '../env';

export function hasSupabaseRagConfig(): boolean {
  return Boolean(readOptionalEnv('SUPABASE_URL') && readOptionalEnv('SUPABASE_SERVICE_ROLE_KEY'));
}

export function createSupabaseServiceClient(): SupabaseClient {
  const supabaseUrl = readOptionalEnv('SUPABASE_URL');
  const serviceRoleKey = readOptionalEnv('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required for Supabase RAG.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
