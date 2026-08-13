import { createClient } from '@/lib/supabase/server'
import BotaoPagar from './BotaoPagar' // Importando o nosso botão real!

export default async function FinanceiroPage() {
  const supabase = await createClient()

  const { data: mensalidades } = await supabase
    .from('mensalidades')
    .select(`
      *,
      alunos ( nome )
    `)
    .order('data_vencimento', { ascending: false })

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor)
  }

  const formatarData = (dataString: string) => {
    const data = new Date(dataString)
    return new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(data)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Financeiro</h1>
          <p className="text-slate-500 mt-1">Controle de mensalidades e recebimentos.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Aluno</th>
                <th className="px-6 py-4 font-medium">Valor</th>
                <th className="px-6 py-4 font-medium">Vencimento</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {mensalidades && mensalidades.length > 0 ? (
                mensalidades.map((mensalidade) => (
                  <tr key={mensalidade.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{mensalidade.alunos?.nome}</td>
                    <td className="px-6 py-4 text-slate-600 font-medium">{formatarMoeda(mensalidade.valor)}</td>
                    <td className="px-6 py-4 text-slate-600">{formatarData(mensalidade.data_vencimento)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        mensalidade.status === 'Pago' 
                          ? 'bg-emerald-50 text-emerald-600' 
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {mensalidade.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Substituímos o botão falso pelo componente real */}
                      {mensalidade.status === 'Pendente' && (
                        <BotaoPagar id={mensalidade.id} />
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Nenhuma cobrança gerada ainda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}