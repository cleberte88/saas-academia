import { createClient } from '@/lib/supabase/server'
import GraficosDashboard from './GraficosDashboard'
import ListasDashboard from './ListasDashboard'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Busca total de alunos ativos
  const { count: totalAlunos } = await supabase
    .from('alunos')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Ativo')

  // 2. Lógica Financeira (Receita do Mês)
  const hoje = new Date()
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0]

  const { data: mensalidadesPagas } = await supabase
    .from('mensalidades')
    .select('valor')
    .eq('status', 'Pago')
    .gte('data_pagamento', primeiroDiaDoMes)

  const receitaTotal = mensalidadesPagas?.reduce((soma, item) => soma + Number(item.valor), 0) || 0
  const receitaFormatada = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaTotal)

  // 3. Busca total de Contratos Pendentes
  const { count: contratosAVencer } = await supabase
    .from('mensalidades')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Pendente')

  // 4. KPIs
  const kpis = [
    { 
      label: 'Alunos Ativos', 
      value: totalAlunos || 0, 
      footerText: 'Atualizado agora', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
      iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600',
      trendBg: 'bg-emerald-50', trendColor: 'text-emerald-700', trendIcon: '↗', trendText: '12% vs mês'
    },
    { 
      label: 'Check-ins', 
      value: '0', 
      footerText: 'Em breve', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
      iconBg: 'bg-blue-100', iconColor: 'text-blue-600',
      trendBg: 'bg-blue-50', trendColor: 'text-blue-700', trendIcon: '→', trendText: '0% vs ontem'
    },
    { 
      label: 'Receita', 
      value: receitaFormatada, 
      footerText: 'Atualizado agora', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
      iconBg: 'bg-purple-100', iconColor: 'text-purple-600',
      trendBg: 'bg-purple-50', trendColor: 'text-purple-700', trendIcon: '↗', trendText: '8% vs mês'
    },
    { 
      label: 'Pendentes', 
      value: contratosAVencer || 0, 
      footerText: 'Cobranças', 
      icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
      iconBg: 'bg-rose-100', iconColor: 'text-rose-600',
      trendBg: 'bg-rose-50', trendColor: 'text-rose-700', trendIcon: '!', trendText: 'Atenção'
    },
  ]

  return (
    <div className="space-y-6 pb-20">
      
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Visão Geral</h1>
          <p className="text-sm text-slate-500 mt-0.5">Indicadores do dia.</p>
        </div>
        
        <a href="/alunos/novo" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-2 px-4 rounded-lg shadow-sm flex items-center gap-2 shrink-0">
          <span className="text-lg">+</span> 
          <span className="hidden sm:inline">Novo aluno</span>
        </a>
      </div>

      {/* Grid de KPIs - 2 colunas no mobile, 4 no desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
            <div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${kpi.iconBg} ${kpi.iconColor}`}>
                {kpi.icon}
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{kpi.label}</p>
              <p className="text-xl sm:text-3xl font-bold text-slate-900 mt-1 truncate">{kpi.value}</p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-50">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold ${kpi.trendBg} ${kpi.trendColor}`}>
                {kpi.trendIcon} {kpi.trendText}
              </span>
            </div>
          </div>
        ))}
      </div>

      <GraficosDashboard />
      <ListasDashboard />

    </div>
  )
}