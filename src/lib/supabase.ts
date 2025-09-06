// Re-export do cliente único do Supabase
import { supabase } from './supabaseClient';
export {
  supabase,
  type UserProfile,
  type Database
} from './supabaseClient';

export default supabase;
