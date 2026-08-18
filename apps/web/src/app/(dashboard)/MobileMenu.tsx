'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import SidebarNav from './SidebarNav'

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Fecha o menu automaticamente ao trocar de página
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <div className="md:hidden flex items-center">
      {/* Botão Hambúrguer Padrão */}
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
        aria-label="Abrir Menu"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay Escuro de Fundo */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer / Menu Lateral */}
      <div className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Cabeçalho do Menu */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100 shrink-0">
          <span className="font-bold text-slate-900 text-lg">Menu</span>
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-600 rounded-lg"
            aria-label="Fechar Menu"
          >
            ✕
          </button>
        </div>

        {/* Links de navegação */}
        <div className="flex-1 overflow-y-auto p-4">
          <SidebarNav />
        </div>

      </div>
    </div>
  )
}