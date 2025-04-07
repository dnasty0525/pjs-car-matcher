// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://pcrjxttypgymsychslyh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjcmp4dHR5cGd5bXN5Y2hzbHloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQwMzU5MjcsImV4cCI6MjA1OTYxMTkyN30.rjqUmlxmC7ZW6zZFpSoS0AScBmdM2vGPTQ26JLRBJQ8';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);