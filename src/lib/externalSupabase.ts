import { createClient } from '@supabase/supabase-js';

const EXTERNAL_SUPABASE_URL = 'https://lxavzqxfvuzepmndekvx.supabase.co';
const EXTERNAL_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4YXZ6cXhmdnV6ZXBtbmRla3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNDUzMDgsImV4cCI6MjA3OTkyMTMwOH0.6R5K_noC35nXReLOo9w7IZBIKs1THibOkWpwvOpTg1s';

export const externalSupabase = createClient(EXTERNAL_SUPABASE_URL, EXTERNAL_SUPABASE_ANON_KEY);
