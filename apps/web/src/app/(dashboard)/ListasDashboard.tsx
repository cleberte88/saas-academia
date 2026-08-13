import Link from 'next/link'

export default function ListasDashboard() {
  const contratos = [
    { id: 1, nome: 'João Silva', inicial: 'J', cor: 'bg-blue-600', plano: 'Mensal', vencimento: '15/06/2025', dias: '3 dias', statusCor: 'bg-rose-100 text-rose-700' },
    { id: 2, nome: 'Maria Santos', inicial: 'M', cor: 'bg-purple-600', plano: 'Trimestral', vencimento: '18/06/2025', dias: '6 dias', statusCor: 'bg-amber-100 text-amber-700' },
    { id: 3, nome: 'Carlos Oliveira', inicial: 'C', cor: 'bg-emerald-600', plano: 'Mensal', vencimento: '22/06/2025', dias: '10 dias', statusCor: 'bg-amber-100 text-amber-700' },
  ]

  const atividades = [
    { id: 1, titulo: 'Novo aluno cadastrado', subtitulo: 'João Silva', tempo: 'Hoje, 09:15', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>, corBg: 'bg-emerald-50', corIcone: 'text-emerald-600' },
    { id: 2, titulo: 'Check-in realizado', subtitulo: 'Maria Santos', tempo: 'Hoje, 08:45', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, corBg: 'bg-blue-50', corIcone: 'text-blue-600' },
    { id: 3, titulo: 'Pagamento recebido', subtitulo: 'R$ 150,00 - Maria Santos', tempo: 'Ontem, 18:30', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, corBg: 'bg-purple-50', corIcone: 'text-purple-600' },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
      
      {/* Coluna da Esquerda: Contratos a Vencer (Ocupa 2 espaços) */}
      <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Contratos próximos do vencimento</h2>
        
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
                <th className="pb-3 font-medium">Aluno</th>
                <th className="pb-3 font-medium">Plano</th>
                <th className="pb-3 font-medium">Vencimento</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-sm">
              {contratos.map((contrato) => (
                <tr key={contrato.id}>
                  <td className="py-4 flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs ${contrato.cor}`}>
                      {contrato.inicial}
                    </div>
                    <span className="font-medium text-slate-900">{contrato.nome}</span>
                  </td>
                  <td className="py-4 text-slate-600 font-medium">{contrato.plano}</td>
                  <td className="py-4 text-rose-600 font-medium">{contrato.vencimento}</td>
                  <td className="py-4">
                    <span className={`px-2.5 py-1 rounded text-xs font-semibold ${contrato.statusCor}`}>
                      {contrato.dias}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pt-4 mt-2">
          <Link href="/alunos" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
            Ver todos os contratos <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Coluna da Direita: Atividades Recentes (Ocupa 1 espaço) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col hover:shadow-md transition-shadow">
        <h2 className="text-lg font-bold text-slate-900 mb-6">Atividades recentes</h2>
        
        <div className="flex-1 space-y-6">
          {atividades.map((atividade) => (
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
          ))}
        </div>

        <div className="pt-4 mt-6 border-t border-slate-100">
          <Link href="/" className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-1">
            Ver todas as atividades <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

    </div>
  )
}