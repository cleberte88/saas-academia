import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  // 1. Busca total de alunos ativos (que já tínhamos feito)
  const { count: totalAlunos } = await supabase
    .from('alunos')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'Ativo')

  // 2. Lógica Financeira: Descobre o primeiro dia do mês atual
  const hoje = new Date()
  const primeiroDiaDoMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1).toISOString().split('T')[0]

  // 3. Busca todas as mensalidades pagas neste mês
  const { data: mensalidadesPagas } = await supabase
    .from('mensalidades')
    .select('valor')
    .eq('status', 'Pago')
    .gte('data_pagamento', primeiroDiaDoMes) // gte = Greater Than or Equal (Maior ou igual ao 1º dia do mês)

  // 4. Soma todos os valores encontrados
  const receitaTotal = mensalidadesPagas?.reduce((soma, item) => soma + Number(item.valor), 0) || 0

  // 5. Formata o valor para Reais (R$)
  const receitaFormatada = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(receitaTotal)

  // Atualizamos a nossa lista de KPIs
  const kpis = [
    { label: 'Alunos Ativos', value: totalAlunos || 0, trend: 'Atualizado agora', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Check-ins Hoje', value: '0', trend: 'Em breve', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Receita do Mês', value: receitaFormatada, trend: 'Atualizado agora', color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Contratos a Vencer', value: '0', trend: 'Em breve', color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500 mt-1">Acompanhe os principais indicadores da sua academia hoje.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">{kpi.label}</p>
            <p className="text-4xl font-bold text-slate-900 mb-2">{kpi.value}</p>
            <div className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium mt-2 ${kpi.color} ${kpi.bg}`}>
              {kpi.trend}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}