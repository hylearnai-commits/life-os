import Todos from '@/components/Todos'
import { createClient } from '@/lib/supabase/server'

export default async function TodosPage() {
  const supabase = await createClient()
  const { data: todos } = await supabase.from('todos').select('*').order('created_at', { ascending: false })
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">📋 待办事项</h1>
        <p className="text-slate-400 text-sm mt-0.5">管理你的待办任务</p>
      </div>
      <Todos initialTodos={(todos ?? []) as any[]} />
    </div>
  )
}
