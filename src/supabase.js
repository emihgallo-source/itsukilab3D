import { createClient } from '@supabase/supabase-js'

const URL = 'https://zguropcyctiljixtzydq.supabase.co'
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpndXJvcGN5Y3RpbGppeHR6eWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3OTUzNTcsImV4cCI6MjA5NDM3MTM1N30.q8xSF_lPlU7tzAOk2X67I-vEwAlEuRNy7Q-6aHqm5zU'

export const supabase = createClient(URL, KEY)
