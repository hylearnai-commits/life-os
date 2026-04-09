import { createClient } from '@/lib/supabase/server'
import Todos from '@/components/Todos'
import Habits from '@/components/Habits'
import Expenses from '@/components/Expenses'
import Notes from '@/components/Notes'
import Weather from '@/components/Weather'
import FocusTimer from '@/components/FocusTimer'
import ThemeToggle from '@/components/ThemeToggle'
import Clock from '@/components/Clock'
import QuickAdd from '@/components/QuickAdd'
import Quote from '@/components/Quote'
import Bookmarks from '@/components/Bookmarks'
import Goals from '@/components/Goals'

export default async function Home() {
  const supabase = await createClient()

  const [
    { data: todos }, { data: habits }, { data: habitLogs }, { data: expenses },
    { data: bookmarks }, { data: notes }, { data: goals },
  ] = await Promise.all([
    supabase.from('todos').select('*').order('created_at', { ascending: false }),
    supabase.from('habits').select('*').limit(20),
    supabase.from('habit_logs').select('habit_id, logged_date'),
    supabase.from('expenses').select('*').order('expense_date', { ascending: false }),
    supabase.from('bookmarks').select('*').order('sort_order'),
    supabase.from('notes').select('*').order('updated_at', { ascending: false }).limit(1),
    supabase.from('goals').select('*'),
  ])

  const t = (todos ?? []) as any[]
  const h = (habits ?? []) as any[]
  const hl = (habitLogs ?? []) as any[]
  const e = (expenses ?? []) as any[]
  const b = (bookmarks ?? []) as any[]
  const n = (notes ?? []) as any[]
  const g = (goals ?? []) as any[]

  const completedCount = t.filter(x => x.completed).length
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
  const weekStart = new Date(now.getTime() - 6 * 86400000).toISOString().split('T')[0]
  const yearStart = new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]

  const monthExpenses = e.filter(x => x.expense_date >= monthStart)
  const monthTotal = monthExpenses.reduce((s: number, x: any) => s + Number(x.amount), 0)
  const yearTotal = e.filter((x: any) => x.expense_date >= yearStart).reduce((s: number, x: any) => s + Number(x.amount), 0)
  const monthLogCount = hl.filter(l => new Date(l.logged_date) >= new Date(now.getTime() - 30 * 86400000)).length
  const weekLogs = hl.filter(l => l.logged_date >= weekStart)
  const weekTotal = e.filter(x => x.expense_date >= weekStart).reduce((s: number, x: any) => s + Number(x.amount), 0)

  const catMap: Record<string, number> = {}
  monthExpenses.forEach((x: any) => { catMap[x.category] = (catMap[x.category] ?? 0) + Number(x.amount) })

  const weeklyData = Array.from({ length: 5 }, (_, i) => {
    const weekEnd = new Date(now.getTime() - i * 7 * 86400000)
    const weekStartD = new Date(weekEnd.getTime() - 6 * 86400000)
    const total = e.filter((x: any) => {
      const d = new Date(x.expense_date)
      return d >= weekStartD && d <= weekEnd
    }).reduce((s: number, x: any) => s + Number(x.amount), 0)
    return { label: `第${6 - i}周`, total }
  }).reverse()
  const maxWeekly = Math.max(...weeklyData.map(w => w.total), 1)

  const achievedGoals = g.filter((goal: any) => goal.current >= goal.target).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 font-sans">
      {/* Header */}
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">🐱 Life-OS</h1>
          <p className="text-slate-400 mt-0.5 text-sm">
            {now.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-white font-medium text-sm">{completedCount}/{t.length} 待办</p>
            <p className="text-slate-400 text-xs">本月 ¥{monthTotal.toFixed(0)} · 目标 {g.length}个</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm">
            {achievedGoals > 0 ? `🎉` : completedCount}
          </div>
        </div>
      </header>

      {/* 状态栏 */}
      <div className="mb-6 rounded-xl bg-slate-800/50 border border-slate-700 p-3">
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400">Supabase</span>
          </div>
          <div className="h-3 w-px bg-slate-600 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-slate-300 hidden sm:flex"><span>📋</span><span>待办 {t.length}</span></div>
          <div className="h-3 w-px bg-slate-600 hidden sm:block" />
          <div className="flex items-center gap-1.5 text-slate-300"><span>🎯</span><span>习惯 {h.length}</span></div>
          <div className="h-3 w-px bg-slate-600" />
          <div className="flex items-center gap-1.5 text-slate-300"><span>📊</span><span>本周 {weekLogs.length} 次打卡</span></div>
          <div className="h-3 w-px bg-slate-600" />
          <div className="flex items-center gap-1.5 text-slate-300"><span>💰</span><span>本周 ¥{weekTotal.toFixed(0)}</span></div>
          <div className="h-3 w-px bg-slate-600" />
          <div className="flex items-center gap-1.5 text-slate-300"><span>🎯</span><span>目标 {achievedGoals}/{g.length} 达成</span></div>
        </div>
      </div>

      {/* 主网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* 🕐 时钟 */}
        <Clock />

        {/* 🌤️ 天气 */}
        <Weather />

        {/* ⏱️ 专注 */}
        <FocusTimer />

        {/* 🎯 目标 */}
        <Goals initialGoals={g} />

        {/* ⚡ 快速添加 */}
        <QuickAdd />

        {/* 📋 待办 */}
        <div className="md:col-span-2 xl:col-span-1">
          <Todos initialTodos={t} />
        </div>

        {/* 🎯 习惯 */}
        <div className="md:col-span-2 xl:col-span-1">
          <Habits initialHabits={h} initialLogs={hl} />
        </div>

        {/* 💰 支出 */}
        <div className="md:col-span-2 xl:col-span-1">
          <Expenses initialExpenses={e} weeklyData={weeklyData} maxWeekly={maxWeekly} />
        </div>

        {/* ⚡ 书签 */}
        <Bookmarks initialBookmarks={b} />

        {/* 📝 随手记 */}
        <Notes initialNote={n[0] ?? null} />

        {/* 🎨 主题 */}
        <ThemeToggle />

      </div>

      {/* 底部统计 + 语录 */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
          <h3 className="text-slate-300 text-xs font-medium mb-2">📊 本月支出分类</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(catMap).slice(0, 8).map(([cat, amt]) => (
              <span key={cat} className="bg-slate-700/60 text-slate-300 px-2 py-1 rounded text-xs">
                {cat} <span className="text-rose-400 font-medium">¥{amt.toFixed(0)}</span>
              </span>
            ))}
            {Object.keys(catMap).length === 0 && <span className="text-slate-500 text-xs italic">暂无数据</span>}
          </div>
        </div>
        <Quote />
      </div>

      {/* 近5周趋势 */}
      {weeklyData.length > 0 && (
        <div className="mt-4 rounded-xl bg-slate-800/40 border border-slate-700/50 p-4">
          <h3 className="text-slate-300 text-xs font-medium mb-3">📈 近5周支出趋势</h3>
          <div className="flex items-end gap-2 h-16">
            {weeklyData.map((w, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-rose-400 text-[10px] font-medium">¥{w.total.toFixed(0)}</span>
                <div className="w-full bg-gradient-to-t from-rose-500/60 to-rose-400/40 rounded-t-sm transition-all hover:from-rose-400/80 hover:to-rose-300/60"
                  style={{ height: `${Math.max((w.total / maxWeekly) * 48, w.total > 0 ? 4 : 0)}px` }} />
                <span className="text-slate-500 text-[10px]">{w.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <footer className="mt-6 text-center text-slate-600 text-xs">
        Supabase Local · Next.js 16 · Tailwind CSS · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
