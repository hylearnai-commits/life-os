import Habits from '@/components/Habits'
import { createClient } from '@/lib/supabase/server'

export default async function HabitsPage() {
  const supabase = await createClient()
  const [{ data: habits }, { data: habitLogs }] = await Promise.all([
    supabase.from('habits').select('*').limit(20),
    supabase.from('habit_logs').select('habit_id, logged_date'),
  ])
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">🎯 习惯打卡</h1>
        <p className="text-slate-400 text-sm mt-0.5">记录每一天的习惯</p>
      </div>
      <Habits initialHabits={(habits ?? []) as any[]} initialLogs={(habitLogs ?? []) as any[]} />
    </div>
  )
}
