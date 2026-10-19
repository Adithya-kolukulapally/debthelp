import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = url && key ? createClient(url, key) : null

export async function submitAssessment(payload) {
  if (!supabase) throw new Error('Assessment delivery is not configured yet. Please call us for help.')
  const { data, error } = await supabase.functions.invoke('submit-assessment', { body: payload })
  if (error) throw new Error(error.message || 'We could not send your assessment. Please try again.')
  return data
}
