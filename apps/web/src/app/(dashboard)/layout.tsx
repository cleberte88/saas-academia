import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SidebarNav from './SidebarNav'
import MobileMenu from './MobileMenu' // 1. IMPORTAMOS O MENU MOBILE AQUI!

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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* SIDEBAR (Barra Lateral Esquerda) */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex z-20">
        
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-slate-100 shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <strong className="text-xl font-bold text-slate-900 tracking-tight">SaaS Academias</strong>
        </div>

        {/* Sidebar Nav */}
        <SidebarNav />

        {/* Widget de Ajuda */}
        <div className="p-4 m-4 bg-slate-50 rounded-xl border border-slate-100 shrink-0">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mb-3">?</div>
          <p className="text-sm font-semibold text-slate-900">Precisa de ajuda?</p>
          <p className="text-xs text-slate-500 mt-1 mb-3">Acesse nossa central de ajuda</p>
          <button className="w-full text-blue-600 text-sm font-medium py-2 px-4 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            Abrir ajuda
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL DO SISTEMA */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Cabeçalho do Topo */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shrink-0 z-10">
          
          {/* 2. AQUI ESTAVA O BOTÃO ESTÁTICO. SUBSTITUÍMOS PELO COMPONENTE REAL: */}
          <MobileMenu />

          <div className="flex-1"></div>

          {/* Perfil e Ícones */}
          <div className="flex items-center gap-5 sm:gap-6">
            <button className="text-slate-400 hover:text-slate-600 transition-colors relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 border-2 border-white rounded-full"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l border-slate-200 pl-5 sm:pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-slate-900">{user.email}</p>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{profile?.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200">
                {user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Onde as telas são carregadas */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto pb-12">
            {children}
          </div>
        </main>
        
      </div>
    </div>
  )
}