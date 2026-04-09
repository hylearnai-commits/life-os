export default function News() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      {/* 顶部 */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">📡 资讯中心</h1>
          <p className="text-slate-400 text-sm mt-0.5">TrendRadar 热点聚合</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <a
            href="http://localhost:8080"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
          >
            🌐 新窗口打开
          </a>
        </div>
      </div>

      {/* 状态提示 */}
      <div className="mb-4 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-2.5 text-amber-300 text-xs">
        💡 如果页面无法加载，请确保 TrendRadar 容器正在运行（docker ps | grep trendradar）
      </div>

      {/* iFrame 嵌入 TrendRadar */}
      <div className="rounded-xl overflow-hidden border border-slate-700" style={{ height: 'calc(100vh - 180px)' }}>
        <iframe
          src="http://localhost:8080"
          className="w-full h-full bg-white"
          title="TrendRadar"
          allow="fullscreen"
          sandbox="allow-scripts allow-same-origin allow-popups"
        />
      </div>
    </div>
  )
}
