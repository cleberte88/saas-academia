'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AlunoLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Esconde a barra inferior se estiver na tela de login ou primeiro acesso
  const isAuthScreen = pathname === '/aluno/login' || pathname === '/aluno/primeiro-acesso'

  if (isAuthScreen) {
    return <div className="min-h-screen bg-slate-50 flex flex-col">{children}</div>
  }

  // Nossas 5 abas principais do App do Aluno
  const navItems = [
    { 
      name: 'Início', 
      href: '/aluno', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> 
    },
    { 
      name: 'Treinos', 
      href: '/aluno/treinos', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg> 
    },
    { 
      name: 'Financeiro', 
      href: '/aluno/financeiro', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> 
    },
    { 
      name: 'Evolução', 
      href: '/aluno/evolucao', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg> 
    },
    { 
      name: 'Perfil', 
      href: '/aluno/perfil', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> 
    },
  ]

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      
      {/* Área Principal onde as telas serão renderizadas (com padding no final para a barra não cobrir o conteúdo) */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-md mx-auto h-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation Bar (Fixo no rodapé) */}
      <nav className="fixed bottom-0 w-full bg-white border-t border-slate-200 px-2 sm:px-6 pb-safe pt-2 z-50">
        <div className="max-w-md mx-auto flex justify-between items-center">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl transition-colors ${
                  isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <div className={`${isActive ? 'scale-110 mb-1' : 'mb-1'} transition-transform duration-200`}>
                  {item.icon}
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>
                  {item.name}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
      
    </div>
  )
}