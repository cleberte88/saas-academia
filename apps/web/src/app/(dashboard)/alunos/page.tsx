import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AlunosPage() {
  // 1. Conecta com o Supabase
  const supabase = await createClient()

  // 2. Busca os alunos REAIS no banco de dados, do mais novo pro mais velho
  const { data: alunos } = await supabase
    .from('alunos')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alunos</h1>
          <p className="text-slate-500 mt-1">Gerencie os alunos matriculados na sua academia.</p>
        </div>
        <Link 
          href="/alunos/novo" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors"
        >
          + Novo Aluno
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-sm text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4 font-medium">Nome</th>
                <th className="px-6 py-4 font-medium">E-mail</th>
                <th className="px-6 py-4 font-medium">Plano</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {alunos && alunos.length > 0 ? (
                alunos.map((aluno) => (
                  <tr key={aluno.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{aluno.nome}</td>
                    <td className="px-6 py-4 text-slate-600">{aluno.email}</td>
                    <td className="px-6 py-4 text-slate-600">{aluno.plano}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        aluno.status === 'Ativo' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {aluno.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                        <Link href={`/alunos/${aluno.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                            Editar
                        </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                    Nenhum aluno cadastrado ainda.
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