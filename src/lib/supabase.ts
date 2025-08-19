// Re-export do cliente único do Supabase
import { supabase } from './supabaseClient';
export {
  supabase,
  authOperations,
  withTimeout,
  type UserProfile,
  type Database
} from './supabaseClient';

export default supabase;
