// Server Actions - 所有写操作
'use server'

import { createClient } from '@/lib/supabase/server'

// ─── 待办 ────────────────────────────────────────────
export async function addTodo(title: string, priority: string = 'medium', dueDate?: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('todos').insert({ title, priority, due_date: dueDate ?? null }).select().single()
  return { data, error }
}

export async function toggleTodo(id: string, completed: boolean) {
  const supabase = await createClient()
  const { error } = await supabase.from('todos').update({ completed, updated_at: new Date().toISOString() }).eq('id', id)
  return { error }
}

export async function deleteTodo(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('todos').delete().eq('id', id)
  return { error }
}

// ─── 习惯 ────────────────────────────────────────────
export async function addHabit(name: string, icon: string = '✅', color: string = '#10b981') {
  const supabase = await createClient()
  const { data, error } = await supabase.from('habits').insert({ name, icon, color }).select().single()
  return { data, error }
}

export async function logHabit(habitId: string, date?: string) {
  const supabase = await createClient()
  const logDate = date ?? new Date().toISOString().split('T')[0]
  const { data, error } = await supabase.from('habit_logs').upsert(
    { habit_id: habitId, logged_date: logDate },
    { onConflict: 'habit_id,logged_date' }
  ).select().single()
  return { data, error }
}

export async function deleteHabit(id: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('habits').delete().eq('id', id)
  return { error }
}

// ─── 支出 ────────────────────────────────────────────
export async function addExpense(amount: number, category: string, note?: string, date?: string) {
  const supabase = await createClient()
  const { data, error } = await supabase.from('expenses').insert({
    amount,
    category,
    note: note ?? null,
    expense_date: date ?? new Date().toISOString().split('T')[0],
  }).select().single()
  return { data, error }
}

// ─── 随手记 ────────────────────────────────────────────
export async function saveNote(content: string) {
  const supabase = await createClient()
  const { data: existing } = await supabase.from('notes').select('id').order('updated_at', { ascending: false }).limit(1).single()
  if (existing) {
    const { data, error } = await supabase.from('notes').update({ content, updated_at: new Date().toISOString() }).eq('id', existing.id).select().single()
    return { data, error }
  } else {
    const { data, error } = await supabase.from('notes').insert({ content }).select().single()
    return { data, error }
  }
}
