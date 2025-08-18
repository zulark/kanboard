import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const TABLES = {
  PROFILES: 'profiles',
  TASKS: 'tasks',
  STATUS: 'task_statuses'
}

export const TASK_TYPES = ['Story', 'Task', 'Bug', 'Epic']
export const TASK_PRIORITIES = ['Baixa', 'Média', 'Alta', 'Crítica']
export const TASK_STATUSES = ['To Do', 'In Progress', 'Done']
