export default function DashboardPage() {
  const kpis = [
    { label: 'Alunos Ativos', value: '--' },
    { label: 'Check-ins Hoje', value: '--' },
    { label: 'Receita do Mês', value: '--' },
    { label: 'Contratos a Vencer', value: '--' },
  ]

  return (
    <div>
      <h1>Visão Geral</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
            <p style={{ margin: 0, fontSize: 14, color: '#666' }}>{kpi.label}</p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 700 }}>{kpi.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}