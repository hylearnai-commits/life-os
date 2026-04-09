'use client'

import { useState, useEffect } from 'react'

export default function Clock() {
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const hour = time.getHours()
  const greeting = hour < 6 ? '🌙 夜深了，早点休息' :
                   hour < 9 ? '🌅 早上好，开启新一天' :
                   hour < 12 ? '☀️ 上午好，保持专注' :
                   hour < 14 ? '🍜 午饭时间到了' :
                   hour < 18 ? '🌤️ 下午好，继续加油' :
                   hour < 22 ? '🌆 晚上好，充实的一天' :
                   '🌙 夜深了，早点睡'

  const timeStr = time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
  const dateStr = time.toLocaleDateString('zh-CN', { weekday: 'short', month: 'short', day: 'numeric' })

  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-900/60 to-slate-800/60 border border-slate-600 p-5 hover:border-indigo-500/50 transition-colors">
      <p className="text-slate-400 text-xs mb-1">{dateStr}</p>
      <p className="text-4xl font-mono font-bold text-white tracking-widest">{timeStr}</p>
      <p className="text-indigo-300 text-xs mt-2 truncate">{greeting}</p>
    </div>
  )
}
