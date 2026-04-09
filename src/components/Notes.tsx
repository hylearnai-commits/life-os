'use client'

import { useState, useTransition } from 'react'
import { saveNote } from '@/lib/actions'

interface Note {
  id: string; content: string; updated_at: string;
}

export default function Notes({ initialNote }: { initialNote: Note | null }) {
  const [content, setContent] = useState(initialNote?.content ?? '')
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)

  function handleSave() {
    if (!content.trim()) return
    startTransition(async () => {
      const { error } = await saveNote(content.trim())
      if (!error) {
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    })
  }

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5 hover:border-slate-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">📝 随手记</h2>
        {saved && <span className="text-xs text-emerald-400 animate-pulse">✓ 已保存</span>}
      </div>
      <textarea
        value={content}
        onChange={e => { setContent(e.target.value); setSaved(false) }}
        placeholder="写点什么，任何想法..."
        className="w-full h-28 bg-slate-900/50 border border-slate-600 rounded-lg p-3 text-slate-300 text-sm resize-none focus:outline-none focus:border-slate-400 transition-colors placeholder:text-slate-600"
      />
      <button
        onClick={handleSave}
        disabled={isPending || !content.trim()}
        className="mt-3 w-full rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm py-2 transition-colors"
      >
        {isPending ? '保存中...' : saved ? '✓ 已保存' : '保存'}
      </button>
    </div>
  )
}
