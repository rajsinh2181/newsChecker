import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://detihkeiptqrffkvpajh.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRldGloa2VpcHRxcmZma3ZwYWpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDg0MjcxNDAsImV4cCI6MjAyNDAwMzE0MH0.Edzt0H-TG0qqLQmrYfMKDCvvvJONq_iTnyzvw5c-Zes";
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
