import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function ListasDashboard() {
  const supabase = await createClient()

  // 1. Busca as mensalidades Pendentes ordenadas pela data (mais antigas/próximas primeiro)
  const { data: mensalidades } = await supabase
    .from('mensalidades')
    .select(`id, data_vencimento, alunos(nome, plano)`)
    .eq('status', 'Pendente')
    .order('data_vencimento', { ascending: true })
    .limit(4)

  // Lógica para calcular os dias de vencimento e as cores
  const contratos = mensalidades?.map(m => {
    const dataVenc = new Date(m.data_vencimento)
    const hoje = new Date()
    
    // Zera as horas para comparar apenas os dias exatos
    dataVenc.setUTCHours(0,0,0,0)
    hoje.setUTCHours(0,0,0,0)
    
    const diffTime = dataVenc.getTime() - hoje.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    let status = ''
    let corStatus = ''
    
    if (diffDays < 0) {
      status = `Atrasado ${Math.abs(diffDays)} dias`
      corStatus = 'bg-rose-100 text-rose-700'
    } else if (diffDays === 0) {
      status = 'Vence hoje'
      corStatus = 'bg-amber-100 text-amber-700'
    } else {
      status = `Vence em ${diffDays} dias`
      corStatus = 'bg-blue-100 text-blue-700'
    }

    return {
      id: m.id,
      nome: m.alunos?.nome || 'Sem Nome',
      inicial: m.alunos?.nome?.charAt(0) || '-',
      cor: 'bg-slate-800',
      plano: m.alunos?.plano || 'Mensal',
      vencimento: new Intl.DateTimeFormat('pt-BR', { timeZone: 'UTC' }).format(new Date(m.data_vencimento)),
      status,
      corStatus
    }
  }) || []

  // 2. Busca os últimos alunos cadastrados para a lista de Atividades
  const { data: ultimosAlunos } = await supabase
    .from('alunos')
    .select('id, nome, created_at')
    .order('created_at', { ascending: false })
    .limit(4)

  const atividades = ultimosAlunos?.map(aluno => {
    return {
      id: aluno.id,
      titulo: 'Novo aluno cadastrado',
      subtitulo: aluno.nome,
      tempo: new Date(aluno.created_at).toLocaleDateString('pt-BR'),
      icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, 
      corBg: 'bg-emerald-50', 
      corIcone: 'text-emerald-600'
    }
  }) || []

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* Coluna da Esquerda: Contratos em Atenção Detalhados */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow overflow-hidden">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Contratos em Atenção Detalhados</h2>
        
        {/* Container com scroll horizontal garantido */}
        <div className="overflow-x-auto flex-1 -mx-6 px-6 sm:mx-0 sm:px-0">
          <table className="w-full text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                <th className="pb-3 font-medium whitespace-nowrap pr-4">Aluno</th>
                <th className="pb-3 font-medium whitespace-nowrap pr-4">Plano</th>
                <th className="pb-3 font-medium whitespace-nowrap pr-4">Vencimento</th>
                <th className="pb-3 font-medium whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {contratos.length > 0 ? contratos.map((contrato) => (
                <tr key={contrato.id}>
                  <td className="py-4 pr-4 whitespace-nowrap flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${contrato.cor}`}>
                      {contrato.inicial}
                    </div>
                    <span className="font-medium text-slate-900">{contrato.nome}</span>
                  </td>
                  <td className="py-4 pr-4 whitespace-nowrap text-slate-600 font-medium">{contrato.plano}</td>
                  <td className="py-4 pr-4 whitespace-nowrap text-slate-900 font-medium">{contrato.vencimento}</td>
                  <td className="py-4 whitespace-nowrap">
                    {/* A classe whitespace-nowrap aqui garante que o selo nunca vai quebrar! */}
                    <span className={`inline-block px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap ${contrato.corStatus}`}>
                      {contrato.status}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-500">Nenhuma cobrança pendente. Tudo em dia! 🎉</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pt-4 mt-2 border-t border-slate-50">
          <Link href="/financeiro" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 w-max">
            Ver painel financeiro <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Coluna da Direita: Atividades Recentes */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Atividades recentes</h2>
        
        <div className="flex-1 space-y-6">
          {atividades.length > 0 ? atividades.map((atividade) => (
            <div key={atividade.id} className="flex gap-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${atividade.corBg} ${atividade.corIcone}`}>
                {atividade.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{atividade.titulo}</p>
                <p className="text-sm text-slate-500 truncate">{atividade.subtitulo}</p>
              </div>
              <div className="text-xs text-slate-400 whitespace-nowrap pt-0.5">
                {atividade.tempo}
              </div>
            </div>
          )) : (
            <p className="text-sm text-slate-500 text-center py-4">Nenhuma atividade recente.</p>
          )}
        </div>

        <div className="pt-4 mt-6 border-t border-slate-50">
          <Link href="/alunos" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1 w-max">
            Ver todos os alunos <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

    </div>
  )
}