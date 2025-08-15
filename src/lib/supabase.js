import { createClient } from '@supabase/supabase-js'

// Substitua pelas suas credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configurações do banco
export const TABLES = {
  PROFILES: 'profiles',
  TASKS: 'tasks',
  STATUS: 'task_statuses'
}

// Enums para garantir consistência
export const TASK_TYPES = ['Story', 'Task', 'Bug', 'Epic']
export const TASK_PRIORITIES = ['Baixa', 'Média', 'Alta', 'Crítica']
export const TASK_STATUSES = ['To Do', 'In Progress', 'Done']
