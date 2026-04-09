import Bookmarks from '@/components/Bookmarks'
import { createClient } from '@/lib/supabase/server'

export default async function BookmarksPage() {
  const supabase = await createClient()
  const { data: bookmarks } = await supabase.from('bookmarks').select('*').order('sort_order')
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">⚡ 快捷书签</h1>
        <p className="text-slate-400 text-sm mt-0.5">管理你的常用链接</p>
      </div>
      <Bookmarks initialBookmarks={(bookmarks ?? []) as any[]} />
    </div>
  )
}
