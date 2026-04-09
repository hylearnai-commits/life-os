'use client'

import { useState, useTransition } from 'react'
import { addHabit, logHabit, deleteHabit } from '@/lib/actions'

interface Habit {
  id: string; name: string; icon: string; color: string;
}
interface HabitLog {
  habit_id: string; logged_date: string;
}

const HABIT_COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16']

export default function Habits({ initialHabits, initialLogs }: { initialHabits: Habit[]; initialLogs: HabitLog[] }) {
  const [habits, setHabits] = useState(initialHabits)
  const [habitLogs, setHabitLogs] = useState(initialLogs)
  const [isPending, startTransition] = useTransition()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newIcon, setNewIcon] = useState('✅')
  const [newColor, setNewColor] = useState(HABIT_COLORS[0])

  const today = new Date().toISOString().split('T')[0]

  function handleLog(habitId: string) {
    startTransition(async () => {
      await logHabit(habitId)
      setHabitLogs(prev => {
        const exists = prev.some(l => l.habit_id === habitId && l.logged_date === today)
        if (exists) return prev.filter(l => !(l.habit_id === habitId && l.logged_date === today))
        return [...prev, { habit_id: habitId, logged_date: today }]
      })
    })
  }

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    startTransition(async () => {
      const { data, error } = await addHabit(newName.trim(), newIcon, newColor)
      if (!error && data) {
        setHabits(prev => [...prev, data])
        setNewName('')
        setShowAdd(false)
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteHabit(id)
      setHabits(prev => prev.filter(h => h.id !== id))
      setHabitLogs(prev => prev.filter(l => l.habit_id !== id))
    })
  }

  // 28天格子
  const days: { date: string; habitId: string | null }[] = []
  for (let i = 27; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({ date: d.toISOString().split('T')[0], habitId: null })
  }

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5 hover:border-slate-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">🎯 习惯打卡</h2>
        <span className="text-xs text-emerald-400">{habits.length} 个习惯</span>
      </div>

      {/* 习惯列表 */}
      <div className="space-y-2 mb-3">
        {habits.length === 0 ? (
          <p className="text-slate-500 text-sm italic text-center py-2">还没有习惯 🐈</p>
        ) : (
          habits.map(habit => {
            const logged = habitLogs.some(l => l.habit_id === habit.id && l.logged_date === today)
            const streak = habitLogs.filter(l => l.habit_id === habit.id).length
            return (
              <div key={habit.id} className="group flex items-center gap-2">
                <button
                  onClick={() => handleLog(habit.id)}
                  className="w-7 h-7 rounded-md flex items-center justify-center text-sm flex-shrink-0 transition-all"
                  style={{ backgroundColor: logged ? habit.color + '30' : '#334155', border: `1px solid ${logged ? habit.color : '#475569'}` }}
                  title={logged ? '取消打卡' : '打卡'}
                >
                  {logged ? '✓' : habit.icon}
                </button>
                <span className="text-sm text-slate-200 flex-1 truncate">{habit.name}</span>
                <span className="text-[10px] text-slate-500">{streak}次</span>
                <button
                  onClick={() => handleDelete(habit.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 text-xs transition-all"
                >✕</button>
              </div>
            )
          })
        )}
      </div>

      {/* 28天热力格子 */}
      {habits.length > 0 && (
        <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${Math.min(habits.length * 4, 28)}, 1fr)` }}>
          {days.flatMap((day, di) =>
            habits.map(habit => {
              const logged = habitLogs.some(l => l.habit_id === habit.id && l.logged_date === day.date)
              return (
                <div
                  key={`${habit.id}-${di}`}
                  className="h-5 rounded-[3px] transition-colors"
                  style={{
                    backgroundColor: logged ? habit.color + '60' : '#1e293b',
                    border: `0.5px solid ${logged ? habit.color + '80' : '#334155'}`,
                  }}
                  title={`${habit.name} · ${day.date}${logged ? ' ✅' : ''}`}
                />
              )
            })
          )}
        </div>
      )}

      {/* 添加习惯 */}
      {showAdd ? (
        <form onSubmit={handleAdd} className="mt-3 space-y-2">
          <input
            autoFocus
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="习惯名称..."
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-400"
          />
          <div className="flex gap-2 items-center">
            <span className="text-xs text-slate-400">图标</span>
            {['✅', '🏃', '📚', '💧', '🧘', '🎨', '💪', '🌙'].map(icon => (
              <button key={icon} type="button" onClick={() => setNewIcon(icon)}
                className={`w-7 h-7 rounded text-sm ${newIcon === icon ? 'bg-slate-600 ring-1 ring-slate-400' : 'bg-slate-700'}`}>{icon}</button>
            ))}
          </div>
          <div className="flex gap-1 items-center">
            <span className="text-xs text-slate-400 mr-1">颜色</span>
            {HABIT_COLORS.map(c => (
              <button key={c} type="button" onClick={() => setNewColor(c)}
                className={`w-5 h-5 rounded-full ${newColor === c ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-800' : ''}`}
                style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs py-1.5 rounded-lg transition-colors">
              {isPending ? '添加中...' : '添加习惯'}
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300 text-xs px-2">取消</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mt-3 w-full rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2 transition-colors">
          + 添加习惯
        </button>
      )}
    </div>
  )
}
