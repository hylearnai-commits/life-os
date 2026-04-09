'use client'

import { useState, useTransition } from 'react'
import { addTodo, toggleTodo, deleteTodo } from '@/lib/actions'

interface Todo {
  id: string; title: string; completed: boolean; priority: string; due_date: string | null;
}

export default function Todos({ initialTodos }: { initialTodos: Todo[] }) {
  const [todos, setTodos] = useState(initialTodos)
  const [isPending, startTransition] = useTransition()
  const [newTitle, setNewTitle] = useState('')
  const [newPriority, setNewPriority] = useState('medium')
  const [showAdd, setShowAdd] = useState(false)

  const completedCount = todos.filter(t => t.completed).length

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newTitle.trim()) return
    startTransition(async () => {
      const { data, error } = await addTodo(newTitle.trim(), newPriority)
      if (!error && data) {
        setTodos(prev => [data, ...prev])
        setNewTitle('')
        setShowAdd(false)
      }
    })
  }

  function handleToggle(id: string, completed: boolean) {
    startTransition(async () => {
      await toggleTodo(id, !completed)
      setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t))
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteTodo(id)
      setTodos(prev => prev.filter(t => t.id !== id))
    })
  }

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5 hover:border-slate-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">📋 待办事项</h2>
        <span className="text-xs text-slate-400">{completedCount} / {todos.length}</span>
      </div>

      {/* 列表 */}
      <div className="space-y-1 min-h-[80px]">
        {todos.length === 0 ? (
          <p className="text-slate-500 text-sm italic py-4 text-center">还没有待办，添加一个吧 🐈</p>
        ) : (
          todos.map(todo => (
            <div key={todo.id} className="group flex items-center gap-2 py-1">
              <button
                onClick={() => handleToggle(todo.id, todo.completed)}
                className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${todo.completed ? 'bg-emerald-400 border-emerald-400' : 'border-slate-500 hover:border-emerald-400'}`}
              >
                {todo.completed && <span className="text-xs">✓</span>}
              </button>
              <span className={`text-sm flex-1 truncate ${todo.completed ? 'line-through text-slate-500' : 'text-slate-200'}`}>{todo.title}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                todo.priority === 'high' ? 'bg-rose-500/20 text-rose-400' :
                todo.priority === 'medium' ? 'bg-amber-500/20 text-amber-400' :
                'bg-slate-600/50 text-slate-400'
              }`}>{todo.priority === 'high' ? '高' : todo.priority === 'medium' ? '中' : '低'}</span>
              <button
                onClick={() => handleDelete(todo.id)}
                className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 text-xs transition-all"
              >✕</button>
            </div>
          ))
        )}
      </div>

      {/* 添加表单 */}
      {showAdd ? (
        <form onSubmit={handleAdd} className="mt-3 space-y-2">
          <input
            autoFocus
            value={newTitle}
            onChange={e => setNewTitle(e.target.value)}
            placeholder="输入待办内容..."
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-slate-400"
          />
          <div className="flex gap-2">
            <select
              value={newPriority}
              onChange={e => setNewPriority(e.target.value)}
              className="bg-slate-900/60 border border-slate-600 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
            >
              <option value="low">🟢 低</option>
              <option value="medium">🟡 中</option>
              <option value="high">🔴 高</option>
            </select>
            <button type="submit" disabled={isPending} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs py-1 rounded-lg transition-colors">
              {isPending ? '添加中...' : '添加'}
            </button>
            <button type="button" onClick={() => setShowAdd(false)} className="text-slate-500 hover:text-slate-300 text-xs px-2">取消</button>
          </div>
        </form>
      ) : (
        <button onClick={() => setShowAdd(true)} className="mt-4 w-full rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2 transition-colors">
          + 添加待办
        </button>
      )}
    </div>
  )
}
