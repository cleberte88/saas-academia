import Link from 'next/link'

export default async function AlunoInicioPage() {
  // No futuro, buscaremos o nome do aluno logado via Supabase aqui.
  // Por enquanto, vamos deixar a interface pronta!

  return (
    <div className="p-6 pt-10 space-y-8">
      
      {/* Cabeçalho do Aluno */}
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Olá, Aluno!</h1>
          <p className="text-sm text-slate-500 mt-1">Pronto para o treino de hoje?</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg border-2 border-white shadow-sm shrink-0">
          A
        </div>
      </header>

      {/* Cartão de Acesso (QR Code Fictício por enquanto) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center relative overflow-hidden">
        {/* Efeito visual de fundo */}
        <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-blue-50 to-white"></div>
        
        <div className="relative z-10 w-full flex flex-col items-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Matrícula Ativa
          </span>

          {/* Placeholder do QR Code */}
          <div className="w-48 h-48 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center mb-6 p-4">
            <svg className="w-16 h-16 text-slate-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <span className="text-xs text-slate-400 font-medium">Seu QR Code<br/>aparecerá aqui</span>
          </div>

          <h2 className="text-lg font-bold text-slate-900">Passe de Entrada</h2>
          <p className="text-sm text-slate-500 mt-1">Aproxime o celular da catraca.</p>
        </div>
      </div>

      {/* Atalho Rápido para o Treino */}
      <Link href="/aluno/treinos" className="block">
        <div className="bg-slate-900 rounded-3xl p-6 shadow-md text-white flex items-center justify-between hover:bg-slate-800 transition-colors">
          <div>
            <p className="text-slate-400 text-sm font-medium mb-1">Treino do Dia</p>
            <h3 className="text-xl font-bold">Ficha A - Peito e Tríceps</h3>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>

    </div>
  )
}