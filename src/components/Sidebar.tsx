'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'

const MENU = [
  { id: 'home', label: '首页', icon: '🏠', href: '/' },
  { id: 'news', label: '资讯', icon: '📡', href: '/news' },
  { id: 'todos', label: '待办', icon: '📋', href: '/todos' },
  { id: 'habits', label: '习惯', icon: '🎯', href: '/habits' },
  { id: 'expenses', label: '支出', icon: '💰', href: '/expenses' },
  { id: 'notes', label: '笔记', icon: '📝', href: '/notes' },
  { id: 'goals', label: '目标', icon: '🏆', href: '/goals' },
  { id: 'bookmarks', label: '书签', icon: '⚡', href: '/bookmarks' },
  { id: 'settings', label: '设置', icon: '⚙️', href: '/settings' },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`flex flex-col bg-slate-900/80 border-r border-slate-700/50 h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-48'} flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-700/50">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          🐱
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <h1 className="text-white font-semibold text-sm whitespace-nowrap">Life-OS</h1>
            <p className="text-slate-500 text-[10px]">个人控制台</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {MENU.map(item => {
          const isActive = pathname === item.href
          return (
            <a
              key={item.id}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <span className="text-base flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="whitespace-nowrap truncate">{item.label}</span>}
            </a>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="px-2 py-4 border-t border-slate-700/50">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all text-xs"
        >
          <span className="text-sm flex-shrink-0">{collapsed ? '→' : '←'}</span>
          {!collapsed && <span>收起菜单</span>}
        </button>
      </div>
    </aside>
  )
}
