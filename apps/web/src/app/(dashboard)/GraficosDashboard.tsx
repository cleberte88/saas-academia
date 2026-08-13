'use client'

import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts'

// Dados falsos (mock) para o visual, depois ligaremos isso ao banco de dados real
const dadosFinanceiros = [
  { data: '01/06', receita: 0, despesa: 0 },
  { data: '04/06', receita: 200, despesa: 0 },
  { data: '07/06', receita: 400, despesa: 0 },
  { data: '10/06', receita: 420, despesa: 0 },
  { data: '13/06', receita: 420, despesa: 0 },
  { data: '16/06', receita: 420, despesa: 0 },
  { data: '19/06', receita: 420, despesa: 0 },
  { data: '22/06', receita: 420, despesa: 0 },
]

const dadosCheckins = [
  { dia: 'Sex', checkins: 2 },
  { dia: 'Sáb', checkins: 2 },
  { dia: 'Dom', checkins: 1 },
  { dia: 'Seg', checkins: 4 },
  { dia: 'Ter', checkins: 7 },
  { dia: 'Qua', checkins: 3 },
  { dia: 'Qui', checkins: 2 },
]

export default function GraficosDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Gráfico 1: Resumo Financeiro (Ocupa 2 colunas) */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Resumo Financeiro</h2>
          <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Este mês</option>
            <option>Mês passado</option>
          </select>
        </div>

        {/* Totais do Gráfico */}
        <div className="flex gap-10 mb-8">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Receita</p>
            <p className="text-xl font-bold text-emerald-600">R$ 420,00</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Despesas</p>
            <p className="text-xl font-bold text-rose-600">R$ 0,00</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Resultado</p>
            <p className="text-xl font-bold text-blue-600">R$ 420,00</p>
          </div>
        </div>

        {/* O Gráfico de Linha em si */}
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosFinanceiros} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="data" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
              />
              <Line type="monotone" dataKey="receita" name="Receita" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="despesa" name="Despesas" stroke="#f43f5e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legenda */}
        <div className="flex justify-end gap-4 mt-4 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Receita</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div>Despesas</div>
        </div>
      </div>

      {/* Gráfico 2: Check-ins (Ocupa 1 coluna) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900">Check-ins dos últimos 7 dias</h2>
        </div>

        {/* O Gráfico de Barras em si */}
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosCheckins} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="dia" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="checkins" name="Check-ins" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  )
}