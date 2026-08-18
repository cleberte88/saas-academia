'use client'

import { useEffect, useState } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { createClient } from '@/lib/supabase/client'

const dadosCheckins = [
  { dia: 'Sex', checkins: 2 },
  { dia: 'Sáb', checkins: 2 },
  { dia: 'Dom', checkins: 1 },
  { dia: 'Seg', checkins: 4 },
  { dia: 'Ter', checkins: 7 },
  { dia: 'Qua', checkins: 3 },
  { dia: 'Qui', checkins: 2 },
]

interface DiaFinanceiro {
  dataBusca: string
  dataExibicao: string
  receita: number
  despesa: number
}

export default function GraficosDashboard() {
  const supabase = createClient()
  const [dadosFinanceiros, setDadosFinanceiros] = useState<DiaFinanceiro[]>([])
  const [totalReceita, setTotalReceita] = useState(0)

  useEffect(() => {
    async function carregarDadosFinanceiros() {
      const hoje = new Date()
      const ano = hoje.getFullYear()
      const mes = hoje.getMonth()
      
      const ultimoDiaDoMes = new Date(ano, mes + 1, 0).getDate()
      
      const dias: DiaFinanceiro[] = []
      for (let i = 1; i <= ultimoDiaDoMes; i++) {
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

      const { data } = await supabase
        .from('mensalidades')
        .select('valor, data_pagamento')
        .eq('status', 'Pago')
        .gte('data_pagamento', dataInicial)
        .lte('data_pagamento', dataFinal)

      let somaTotal = 0
      if (data) {
        data.forEach((pagamento: any) => {
          const diaIndex = dias.findIndex(d => d.dataBusca === pagamento.data_pagamento)
          if (diaIndex !== -1) {
            dias[diaIndex].receita += Number(pagamento.valor)
            somaTotal += Number(pagamento.valor)
          }
        })
      }

      let valorAcumulado = 0
      const diasCumulativos = dias.map(d => {
        valorAcumulado += d.receita
        return { ...d, receita: valorAcumulado }
      })

      setDadosFinanceiros(diasCumulativos)
      setTotalReceita(somaTotal)
    }

    carregarDadosFinanceiros()
  }, [supabase])

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

        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosFinanceiros} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="dataExibicao" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} minTickGap={20} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#0f172a', marginBottom: '4px' }}
                formatter={(value: any) => [formatarMoeda(Number(value) || 0), '']}
              />
              <Line type="monotone" dataKey="receita" name="Receita Acumulada" stroke="#10b981" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="despesa" name="Despesas" stroke="#f43f5e" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
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