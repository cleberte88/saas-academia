export default function DashboardPage() {
  const kpis = [
    { label: 'Alunos Ativos', value: '142', trend: '+12% este mês', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Check-ins Hoje', value: '89', trend: 'Faltam 14 para a meta', color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Receita do Mês', value: 'R$ 14.500', trend: '+5% em relação ao mês passado', color: 'text-violet-600', bg: 'bg-violet-50' },
    { label: 'Contratos a Vencer', value: '12', trend: 'Nos próximos 7 dias', color: 'text-rose-600', bg: 'bg-rose-50' },
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