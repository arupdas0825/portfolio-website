import { createClient } from '@supabase/supabase-js';

// Get clean URL (remove rest/v1/ suffix if present)
const rawUrl = process.env.REACT_APP_SUPABASE_URL || 'https://mafcxsgnmgyajigjeftf.supabase.co';
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, '');
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'sb_publishable_SGsiRgr3PUP1Ac93d8guoA_jCXo4FwR';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
