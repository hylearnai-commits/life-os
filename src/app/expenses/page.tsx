import Expenses from '@/components/Expenses'
import { createClient } from '@/lib/supabase/server'

export default async function ExpensesPage() {
  const supabase = await createClient()
  const { data: expenses } = await supabase.from('expenses').select('*').order('expense_date', { ascending: false })
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">💰 支出追踪</h1>
        <p className="text-slate-400 text-sm mt-0.5">记录每一笔开销</p>
      </div>
      <Expenses initialExpenses={(expenses ?? []) as any[]} />
    </div>
  )
}
