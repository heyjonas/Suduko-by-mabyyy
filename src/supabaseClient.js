import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qttiukgcakhoygxgsfvf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF0dGl1a2djYWtob3lneGdzZnZmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MzQyMzksImV4cCI6MjA3NTQxMDIzOX0.icXsEo4j3rfIWu77WwiJuocZfi6WWUDGnMgIZdY5iMw'

export const supabase = createClient(supabaseUrl, supabaseKey)