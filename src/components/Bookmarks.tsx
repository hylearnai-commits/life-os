'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Bookmark {
  id: string; name: string; url: string; icon: string;
}

export default function Bookmarks({ initialBookmarks }: { initialBookmarks: Bookmark[] }) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks)
  const [isPending, startTransition] = useTransition()
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [newIcon, setNewIcon] = useState('🔗')

  const ICONS = ['📧', '📝', '📅', '🐙', '📮', '🐦', '💼', '🎨', '📚', '💻', '🔗', '☁️', '🎵', '🎬', '🛒', '💰']

  function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !newUrl.trim()) return
    const url = newUrl.startsWith('http') ? newUrl : `https://${newUrl}`
    startTransition(async () => {
      const supabase = createClient()
      const { data } = await supabase.from('bookmarks').insert({ name: newName.trim(), url, icon: newIcon }).select().single()
      if (data) setBookmarks(prev => [...prev, data])
      setNewName(''); setNewUrl(''); setNewIcon('🔗')
      setShowAdd(false)
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const supabase = createClient()
      await supabase.from('bookmarks').delete().eq('id', id)
      setBookmarks(prev => prev.filter(b => b.id !== id))
    })
  }

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5 hover:border-slate-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">⚡ 快捷入口</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="text-xs text-indigo-400 hover:text-indigo-300">
          {showAdd ? '取消' : '+ 添加'}
        </button>
      </div>

      {/* 网格 */}
      <div className="grid grid-cols-3 gap-2">
        {bookmarks.map(b => (
          <div key={b.id} className="group relative">
            <a
              href={b.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-1 p-3 rounded-lg bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white transition-all text-center"
            >
              <span className="text-xl">{b.icon}</span>
              <span className="text-[10px] truncate w-full">{b.name}</span>
            </a>
            <button
              onClick={() => handleDelete(b.id)}
              className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full text-white text-[8px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >✕</button>
          </div>
        ))}
      </div>

      {/* 添加表单 */}
      {showAdd && (
        <form onSubmit={handleAdd} className="mt-3 space-y-2">
          <input
            autoFocus value={newName} onChange={e => setNewName(e.target.value)}
            placeholder="名称"
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
          />
          <input
            value={newUrl} onChange={e => setNewUrl(e.target.value)}
            placeholder="网址"
            className="w-full bg-slate-900/60 border border-slate-600 rounded-lg px-3 py-1.5 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-400"
          />
          <div className="flex flex-wrap gap-1">
            {ICONS.map(icon => (
              <button key={icon} type="button" onClick={() => setNewIcon(icon)}
                className={`w-7 h-7 rounded text-sm ${newIcon === icon ? 'bg-indigo-600 ring-1 ring-indigo-400' : 'bg-slate-700 hover:bg-slate-600'}`}>
                {icon}
              </button>
            ))}
          </div>
          <button type="submit" disabled={isPending}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs py-1.5 rounded-lg transition-colors">
            {isPending ? '添加中...' : '添加书签'}
          </button>
        </form>
      )}
    </div>
  )
}
