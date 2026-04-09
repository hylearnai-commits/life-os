'use client'
import ThemeToggle from '@/components/ThemeToggle'

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">⚙️ 设置</h1>
        <p className="text-slate-400 text-sm mt-0.5">个性化配置</p>
      </div>
      <div className="max-w-md space-y-4">
        <ThemeToggle />
        <div className="rounded-xl bg-slate-800/60 border border-slate-700 p-5">
          <h2 className="text-white font-semibold mb-3">ℹ️ 系统信息</h2>
          <div className="space-y-2 text-xs text-slate-400">
            <div className="flex justify-between">
              <span>版本</span><span className="text-white">v1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Next.js</span><span className="text-white">16.2.3</span>
            </div>
            <div className="flex justify-between">
              <span>数据库</span><span className="text-white">Supabase Local</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
