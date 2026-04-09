'use client'

import { useState, useEffect } from 'react'

type Theme = 'dark' | 'light' | 'midnight'

const THEMES: { id: Theme; label: string; bg: string; accent: string }[] = [
  { id: 'dark', label: '🌙 暗', bg: 'from-slate-900 via-slate-800 to-slate-900', accent: 'indigo' },
  { id: 'light', label: '☀️ 亮', bg: 'from-amber-50 via-orange-50 to-stone-100', accent: 'amber' },
  { id: 'midnight', label: '🌌 午夜', bg: 'from-slate-950 via-indigo-950 to-slate-900', accent: 'indigo' },
]

const ACCENT_COLORS: Record<string, string> = {
  indigo: 'indigo', amber: 'amber', rose: 'rose', emerald: 'emerald', violet: 'violet',
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('lifeos-theme') as Theme | null
    if (saved) setTheme(saved)
  }, [])

  function applyTheme(t: Theme) {
    const root = document.documentElement
    if (t === 'light') {
      root.classList.add('light')
      root.classList.remove('dark', 'midnight')
    } else if (t === 'midnight') {
      root.classList.add('midnight')
      root.classList.remove('dark', 'light')
    } else {
      root.classList.add('dark')
      root.classList.remove('light', 'midnight')
    }
    localStorage.setItem('lifeos-theme', t)
    setTheme(t)
  }

  if (!mounted) return <div className="h-[88px]" />

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5 hover:border-slate-500 transition-colors">
      <h2 className="text-white font-semibold mb-3">🎨 主题</h2>
      <div className="flex gap-2">
        {THEMES.map(t => (
          <button
            key={t.id}
            onClick={() => applyTheme(t.id)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${theme === t.id ? 'ring-2 ring-offset-1 ring-offset-slate-800 ' + (t.accent === 'indigo' ? 'ring-indigo-400' : 'ring-amber-400') + ' bg-slate-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
