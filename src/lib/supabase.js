import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://iozfllxuojslynduxmcc.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlvemZsbHh1b2pzbHluZHV4bWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzOTQwMzUsImV4cCI6MjA4ODk3MDAzNX0.51z_cxifdgZK57cRQ5MgePLkuZgKWAyszoDexZB4XSo";

export const supabase = createClient(supabaseUrl, supabaseKey);