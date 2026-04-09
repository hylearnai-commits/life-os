'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Goal {
  id: string; title: string; target: number; current: number; unit: string;
}

export default function Goals({ initialGoals }: { initialGoals: Goal[] }) {
  const [goals, setGoals] = useState(initialGoals)
  const [isPending, startTransition] = useTransition()
  const [showAdd, setShowAdd] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [newUnit, setNewUnit] = useState('次')

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim() || !newTarget) return
    startTransition(async () => {
      const supabase = createClient()
      const { data } = await supabase.from('goals').insert({
        title: newTitle.trim(),
        target: Number(newTarget),
        current: 0,
        unit: newUnit,
      }).select().single()
      if (data) setGoals(prev => [...prev, data])
      setNewTitle(''); setNewTarget(''); setNewUnit('次')
      setShowAdd(false)
    })
  }

  function handleUpdate(id: string, current: number) {
    startTransition(async () => {
      const supabase = createClient()
      await supabase.from('goals').update({ current }).eq('id', id)
      setGoals(prev => prev.map(g => g.id === id ? { ...g, current } : g))
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const supabase = createClient()
      await supabase.from('goals').delete().eq('id', id)
      setGoals(prev => prev.filter(g => g.id !== id))
    })
  }

  const UNITS = ['次', '本', '小时', '天', '个', '公里', '元', '斤']

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5 hover:border-slate-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">🎯 年度目标</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="text-xs text-indigo-400 hover:text-indigo-300">
          {showAdd ? '取消' : '+ 添加'}
        </button>
      </div>

      <div className="space-y-3">
        {goals.length === 0 && !showAdd && (
          <p className="text-slate-500 text-sm italic text-center py-4">还没有目标 🐈</p>
        )}

        {goals.map(goal => {
          const pct = Math.min((goal.current / goal.target) * 100, 100)
          const remaining = Math.max(goal.target - goal.current, 0)
          return (
            <div key={goal.id} className="group">
              <div className="flex items-center justify-between mb-1">
                <span className="text-slate-200 text-sm truncate flex-1 mr-2">{goal.title}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => handleUpdate(goal.id, Math.max(0, goal.current - 1))}
                    className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs flex items-center justify-center">-</button>
                  <span className="text-xs text-slate-400 w-16 text-center">
                    {goal.current} / {goal.target} {goal.unit}
                  </span>
                  <button onClick={() => handleUpdate(goal.id, goal.current + 1)}
                    className="w-5 h-5 rounded bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs flex items-center justify-center">+</button>
                  <button onClick={() => handleDelete(goal.id)}
                    className="w-5 h-5 rounded text-slate-600 hover:text-rose-400 text-xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">✕</button>
                </div>
              </div>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    background: pct >= 100 ? 'linear-gradient(90deg, #10b981, #34d399)' :
                      pct >= 50 ? 'linear-gradient(90deg, #6366f1, #818cf8)' :
                      'linear-gradient(90deg, #f59e0b, #fbbf24)'
                  }}
                />
              </div>
              {pct < 100 && (
                <p className="text-slate-500 text-[10px] mt-0.5">还差 {remaining} {goal.unit}</p>
              )}
              {pct >= 100 && (
                <p className="text-emerald-400 text-[10px] mt-0.5">🎉 已达成！</p>
              )}
            </div>
          )
        })}
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="mt-3 space-y-2">
          <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)}
            placeholder="目标名称（如：读完20本书）"
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400" />
          <div className="flex gap-2">
            <input type="number" value={newTarget} onChange={e => setNewTarget(e.target.value)}
              placeholder="目标值"
              className="w-24 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400" />
            <select value={newUnit} onChange={e => setNewUnit(e.target.value)}
              className="flex-1 bg-slate-900/60 border border-slate-600 rounded-lg px-2 py-1.5 text-sm text-slate-300 focus:outline-none">
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <button type="submit" disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs py-1.5 rounded-lg transition-colors">
            {isPending ? '添加中...' : '添加目标'}
          </button>
        </form>
      )}
    </div>
  )
}
