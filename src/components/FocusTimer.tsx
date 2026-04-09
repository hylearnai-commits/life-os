'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

const PRESETS = [
  { label: '25min', minutes: 25 },
  { label: '15min', minutes: 15 },
  { label: '5min', minutes: 5 },
  { label: '45min', minutes: 45 },
]

const SOUND_URL = 'https://www.soundjay.com/buttons/beep-01a.mp3'

export default function FocusTimer() {
  const [mode, setMode] = useState<'idle' | 'focus' | 'break'>('idle')
  const [preset, setPreset] = useState(25)
  const [remaining, setRemaining] = useState(25 * 60)
  const [sessions, setSessions] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const playBeep = useCallback(() => {
    try {
      const a = new Audio(SOUND_URL)
      a.volume = 0.5
      a.play().catch(() => {})
    } catch {}
  }, [])

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = null
  }, [])

  const startTimer = useCallback((minutes: number, type: 'focus' | 'break') => {
    stopTimer()
    setRemaining(minutes * 60)
    setMode(type)
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          playBeep()
          stopTimer()
          if (type === 'focus') {
            setSessions(s => s + 1)
            setMode('idle')
          } else {
            setMode('idle')
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [stopTimer, playBeep])

  const cancel = () => { stopTimer(); setMode('idle'); setRemaining(preset * 60) }

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current) }, [])

  const mm = String(Math.floor(remaining / 60)).padStart(2, '0')
  const ss = String(remaining % 60).padStart(2, '0')
  const progress = mode === 'idle' ? 0 : (1 - remaining / (mode === 'focus' ? (sessions > 0 && !intervalRef.current ? preset : 25) * 60 : 5 * 60)) * 100

  return (
    <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5 hover:border-slate-500 transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-white font-semibold">⏱️ 专注计时</h2>
        <span className="text-xs text-slate-400">已专注 {sessions} 次</span>
      </div>

      {/* 显示 */}
      <div className="flex flex-col items-center py-2">
        {mode !== 'idle' && (
          <span className={`text-xs px-2 py-0.5 rounded mb-2 ${mode === 'focus' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {mode === 'focus' ? '🔴 专注中' : '🟢 休息中'}
          </span>
        )}
        <span className="text-5xl font-mono font-bold text-white tracking-widest">{mm}:{ss}</span>
      </div>

      {/* 进度条 */}
      {mode !== 'idle' && (
        <div className="h-1.5 bg-slate-700 rounded-full mt-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${mode === 'focus' ? 'bg-rose-400' : 'bg-emerald-400'}`}
            style={{ width: `${progress}%`, transition: 'width 1s linear' }}
          />
        </div>
      )}

      {/* 控制按钮 */}
      <div className="mt-4 space-y-2">
        {mode === 'idle' ? (
          <>
            <div className="flex gap-1">
              {PRESETS.map(p => (
                <button
                  key={p.label}
                  onClick={() => { setPreset(p.minutes); setRemaining(p.minutes * 60) }}
                  className={`flex-1 text-xs py-1.5 rounded-lg transition-colors ${preset === p.minutes ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-400 hover:bg-slate-600'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            <button
              onClick={() => startTimer(preset, 'focus')}
              className="w-full bg-rose-500 hover:bg-rose-400 text-white text-sm py-2 rounded-lg transition-colors"
            >
              开始专注 🔴
            </button>
          </>
        ) : (
          <button
            onClick={cancel}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 text-sm py-2 rounded-lg transition-colors"
          >
            停止
          </button>
        )}
      </div>
    </div>
  )
}
