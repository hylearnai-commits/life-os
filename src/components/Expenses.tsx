'use client'

import { useState, useTransition } from 'react'
import { addExpense } from '@/lib/actions'

interface Expense {
  id: string; amount: number; category: string; note: string | null; expense_date: string;
}

const CATEGORIES = [
  { label: '🍜 餐饮', value: '餐饮' },
  { label: '🚌 交通', value: '交通' },
  { label: '🛒 购物', value: '购物' },
  { label: '🎮 娱乐', value: '娱乐' },
  { label: '💊 医疗', value: '医疗' },
  { label: '📱 通讯', value: '通讯' },
  { label: '🏠 住房', value: '住房' },
  { label: '📚 教育', value: '教育' },
  { label: '☕ 其他', value: '其他' },
]

interface WeeklyData { label: string; total: number }

export default function Expenses({ initialExpenses, weeklyData, maxWeekly }: { initialExpenses: Expense[]; weeklyData?: WeeklyData[]; maxWeekly?: number }) {
  const [expenses, setExpenses] = useState(initialExpenses)
  const [isPending, startTransition] = useTransition()
  const [showAdd, setShowAdd] = useState(false)
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('餐饮')
  const [note, setNote] = useState('')

  const monthExpenses = expenses.filter(e => {
    const m = new Date().toISOString().slice(0, 7)
    return e.expense_date.startsWith(m)
  })
  const total = monthExpenses.reduce((s, e) => s + Number(e.amount), 0)
  const monthName = new Date().toLocaleDateString('zh-CN', { month: 'long' })

  // 最近7天
  const today = new Date()
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
  const byDay = last7.map(date => ({
    date,
    label: new Date(date).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' }),
    amount: monthExpenses.filter(e => e.expense_date === date).reduce((s, e) => s + Number(e.amount), 0),
  }))
  const maxAmt = Math.max(...byDay.map(d => d.amount), 1)

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return
    startTransition(async () => {
      const { data, error } = await addExpense(Number(amount), category, note || undefined)
      if (!error && data) {
        setExpenses(prev => [data, ...prev])
        setAmount('')
        setNote('')
        setShowAdd(false)
      }
    })
  }

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5 hover:border-slate-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">💰 {monthName}支出</h2>
        <span className="text-xs text-rose-400">¥{total.toFixed(2)}</span>
      </div>

      {/* 柱状图 */}
      <div className="h-20 flex items-end justify-around gap-1">
        {byDay.map((d, i) => (
          <div key={i} className="flex flex-col items-center gap-1 flex-1">
            {d.amount > 0 && <span className="text-[9px] text-rose-400/70">¥{d.amount.toFixed(0)}</span>}
            <div
              className="w-full bg-gradient-to-t from-rose-500/70 to-rose-400/50 rounded-t-sm transition-all hover:from-rose-400/80 hover:to-rose-300/60"
              style={{ height: `${Math.max((d.amount / maxAmt) * 64, d.amount > 0 ? 6 : 0)}px` }}
              title={`${d.label}: ¥${d.amount.toFixed(2)}`}
            />
            <span className="text-slate-500 text-[10px]">{d.label}</span>
          </div>
        ))}
      </div>

      {/* 本月分类 */}
      {monthExpenses.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {Object.entries(
            monthExpenses.reduce((acc, e) => { acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount); return acc }, {} as Record<string, number>)
          ).map(([cat, amt]) => {
            const catLabel = CATEGORIES.find(c => c.value === cat)?.label ?? cat
            return (
              <span key={cat} className="text-[10px] bg-slate-700/60 text-slate-300 px-1.5 py-0.5 rounded">
                {catLabel} ¥{amt.toFixed(0)}
              </span>
            )
          })}
        </div>
      )}

      {/* 添加 */}
      {showAdd ? (
        <form onSubmit={handleAdd} className="mt-3 space-y-2">
          <div className="flex gap-2">
            <input
              autoFocus
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              placeholder="金额"
              className="w-28 bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-400"
            />
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="flex-1 bg-slate-900/60 border border-slate-600 rounded-lg px-2 py-2 text-sm text-slate-300 focus:outline-none"
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="备注（可选）"
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-400"
          />
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="flex-1 bg-rose-500 hover:bg-rose-400 disabled:opacity-50 text-white text-xs py-1.5 rounded-lg transition-colors">
              {isPending ? '记录中...' : '记录支出'}
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300 text-xs px-2">取消</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mt-4 w-full rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2 transition-colors">
          + 记一笔
        </button>
      )}
    </div>
  )
}
