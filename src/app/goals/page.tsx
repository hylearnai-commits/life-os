import Goals from '@/components/Goals'
import { createClient } from '@/lib/supabase/server'

export default async function GoalsPage() {
  const supabase = await createClient()
  const { data: goals } = await supabase.from('goals').select('*')
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">🏆 年度目标</h1>
        <p className="text-slate-400 text-sm mt-0.5">追踪你的目标进度</p>
      </div>
      <Goals initialGoals={(goals ?? []) as any[]} />
    </div>
  )
}
