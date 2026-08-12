'use client'
import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function NovoAlunoPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [plano, setPlano] = useState('Mensal')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSalvarAluno(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1. Descobrir qual é a academia do usuário logado
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data: profile } = await supabase
        .from('profiles')
        .select('academia_id')
        .eq('id', user.id)
        .single()

      if (!profile?.academia_id) throw new Error('Academia não encontrada')

      // 2. Salvar o novo aluno atrelando-o à academia correta
      // Nota: Assumindo que a tabela se chama 'alunos' no seu banco de dados
      const { error: insertError } = await supabase
        .from('alunos')
        .insert([
          {
            nome,
            email,
            plano,
            status: 'Ativo',
            academia_id: profile.academia_id
          }
        ])

      if (insertError) throw insertError

      // 3. Voltar para a lista se der tudo certo
      router.push('/alunos')
      router.refresh()
      
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o aluno.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novo Aluno</h1>
          <p className="text-slate-500 mt-1">Preencha os dados para matricular um novo aluno.</p>
        </div>
        <Link href="/alunos" className="text-sm font-medium text-slate-500 hover:text-slate-900">
          Voltar
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <form onSubmit={handleSalvarAluno} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
              <input 
                id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="Ex: João da Silva"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
              <input 
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                placeholder="joao@email.com"
              />
            </div>

            <div>
              <label htmlFor="plano" className="block text-sm font-medium text-slate-700 mb-1">Plano</label>
              <select 
                id="plano" value={plano} onChange={(e) => setPlano(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : 'Salvar Aluno'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}