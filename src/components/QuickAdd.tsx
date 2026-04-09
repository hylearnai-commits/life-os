'use client'

import { useState, useTransition } from 'react'
import { addTodo } from '@/lib/actions'
import { addExpense } from '@/lib/actions'

type Tab = 'todo' | 'expense'

export default function QuickAdd() {
  const [tab, setTab] = useState<Tab>('todo')
  const [isPending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  // Todo
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState('medium')

  // Expense
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('餐饮')
  const [note, setNote] = useState('')

  const CATEGORIES = ['餐饮', '交通', '购物', '娱乐', '医疗', '通讯', '住房', '教育', '其他']

  function handleAddTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    startTransition(async () => {
      await addTodo(title.trim(), priority)
      setTitle('')
      setDone(true)
      setTimeout(() => setDone(false), 1500)
    })
  }

  function handleAddExpense(e: React.FormEvent) {
    e.preventDefault()
    if (!amount || isNaN(Number(amount))) return
    startTransition(async () => {
      await addExpense(Number(amount), category, note || undefined)
      setAmount('')
      setNote('')
      setDone(true)
      setTimeout(() => setDone(false), 1500)
    })
  }

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5 hover:border-slate-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">⚡ 快速添加</h2>
        {done && <span className="text-xs text-emerald-400 animate-pulse">✓ 已添加</span>}
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-1 mb-3">
        {(['todo', 'expense'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === t ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            {t === 'todo' ? '📋 待办' : '💰 支出'}
          </button>
        ))}
      </div>

      {/* 待办表单 */}
      {tab === 'todo' && (
        <form onSubmit={handleAddTodo} className="space-y-2">
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="今天要做什么？"
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
          />
          <div className="flex gap-2">
            {[['low', '🟢'], ['medium', '🟡'], ['high', '🔴']].map(([p, label]) => (
              <button
                key={p}
                type="button"
                onClick={() => setPriority(p)}
                className={`flex-1 py-1.5 rounded-lg text-xs transition-colors ${priority === p ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
              >
                {label} {p === 'low' ? '低' : p === 'medium' ? '中' : '高'}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={isPending || !title.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs py-2 rounded-lg transition-colors"
          >
            {isPending ? '添加中...' : '添加'}
          </button>
        </form>
      )}

      {/* 支出表单 */}
      {tab === 'expense' && (
        <form onSubmit={handleAddExpense} className="space-y-2">
          <input
            autoFocus
            type="number"
            step="0.01"
            min="0"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="金额"
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
          />
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-indigo-400 transition-colors"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="备注（可选）"
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400 transition-colors"
          />
          <button
            type="submit"
            disabled={isPending || !amount}
            className="w-full bg-rose-500 hover:bg-rose-400 disabled:opacity-40 text-white text-xs py-2 rounded-lg transition-colors"
          >
            {isPending ? '记录中...' : '记一笔'}
          </button>
        </form>
      )}
    </div>
  )
}
