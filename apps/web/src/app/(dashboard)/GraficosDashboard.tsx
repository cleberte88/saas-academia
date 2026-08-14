'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClient } from '@/lib/supabase/client'

// Mock dos check-ins (mantido até criarmos o módulo de catraca)
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
  const supabase = createClient()
  const [dadosFinanceiros, setDadosFinanceiros] = useState<any[]>([])
  const [totalReceita, setTotalReceita] = useState(0)

  useEffect(() => {
    async function carregarDadosFinanceiros() {
      const hoje = new Date()
      const ano = hoje.getFullYear()
      const mes = hoje.getMonth() // 0 = Jan, 1 = Fev, etc.
      
      // Descobre quantos dias tem o mês atual
      const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate()
      
      // 1. Gera um calendário do 1º ao último dia do mês atual
      const dias = []
      for (let i = 1; i <= ultimoDiaDoMes; i++) {
        // Usa UTC para evitar problemas de fuso horário pulando o dia
        const d = new Date(Date.UTC(ano, mes, i))
        dias.push({
          dataBusca: d.toISOString().split('T')[0],
          dataExibicao: d.toLocaleDateString('pt-BR', { timeZone: 'UTC', day: '2-digit', month: '2-digit' }),
          receita: 0,
          despesa: 0 
        })
      }

      const dataInicial = dias[0].dataBusca
      const dataFinal = dias[dias.length - 1].dataBusca

      // 2. Busca no banco as mensalidades pagas NESTE MÊS
      const { data } = await supabase
        .from('mensalidades')
        .select('valor, data_pagamento')
        .eq('status', 'Pago')
        .gte('data_pagamento', dataInicial)
        .lte('data_pagamento', dataFinal)

      // 3. Distribui os valores recebidos nos dias corretos
      let somaTotal = 0
      if (data) {
        data.forEach(pagamento => {
          const diaIndex = dias.findIndex(d => d.dataBusca === pagamento.data_pagamento)
          if (diaIndex !== -1) {
            dias[diaIndex].receita += Number(pagamento.valor)
            somaTotal += Number(pagamento.valor)
          }
        })
      }

      // 4. (Opcional) Calcula a receita cumulativa para a linha sempre subir ou manter reta
      let valorAcumulado = 0
      const diasCumulativos = dias.map(d => {
        valorAcumulado += d.receita
        return { ...d, receita: valorAcumulado }
      })

      setDadosFinanceiros(diasCumulativos)
      setTotalReceita(somaTotal)
    }

    carregarDadosFinanceiros()
  }, [])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Gráfico 1: Resumo Financeiro */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900">Resumo Financeiro</h2>
          <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-500">
            <option>Este mês</option>
          </select>
        </div>

        {/* Totais: Agora perfeitamente sincronizados com o KPI do topo! */}
        <div className="flex gap-10 mb-8">
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Receita</p>
            <p className="text-xl font-bold text-emerald-600">{formatarMoeda(totalReceita)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Despesas</p>
            <p className="text-xl font-bold text-rose-600">R$ 0,00</p>
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 mb-1">Resultado</p>
            <p className="text-xl font-bold text-blue-600">{formatarMoeda(totalReceita)}</p>
          </div>
        </div>

        {/* O Gráfico */}
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosFinanceiros} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              {/* minTickGap ajuda a não embolar as datas no eixo X, já que agora são até 31 dias */}
              <XAxis dataKey="dataExibicao" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} minTickGap={20} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                formatter={(value: number) => [formatarMoeda(value), '']}
              />
              <Line type="monotone" dataKey="receita" name="Receita Acumulada" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="despesa" name="Despesas" stroke="#f43f5e" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legenda */}
        <div className="flex justify-end gap-4 mt-4 text-sm font-medium text-slate-600">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-emerald-500"></div>Receita</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-rose-500"></div>Despesas</div>
        </div>
      </div>

      {/* Gráfico 2: Check-ins */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-900">Check-ins dos últimos 7 dias</h2>
        </div>

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