import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) { redirect('/login') }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isStaff = profile?.role === 'admin' || profile?.role === 'colaborador'

  if (!isStaff) { redirect('/login') }

  return (
    <div>
      <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
        <strong>Dashboard</strong>
      </header>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  )
}