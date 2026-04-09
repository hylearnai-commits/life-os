'use client'

export default function ComingSoon({ name, icon }: { name: string; icon: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">{icon}</div>
        <h1 className="text-2xl font-bold text-white mb-2">{name}</h1>
        <p className="text-slate-400 text-sm">功能开发中，稍后上线 🐈</p>
      </div>
    </div>
  )
}
