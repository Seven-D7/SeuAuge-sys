// Re-export do cliente único do Supabase
import { supabase, withTimeout } from './supabaseClient';
export {
  supabase,
  withTimeout,
  type UserProfile,
  type Database
} from './supabaseClient';

export default supabase;
