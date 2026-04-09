import Notes from '@/components/Notes'
import { createClient } from '@/lib/supabase/server'

export default async function NotesPage() {
  const supabase = await createClient()
  const { data: notes } = await supabase.from('notes').select('*').order('updated_at', { ascending: false }).limit(1)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">📝 随手记</h1>
        <p className="text-slate-400 text-sm mt-0.5">记录每一个想法</p>
      </div>
      <Notes initialNote={(notes ?? [])[0] ?? null} />
    </div>
  )
}
