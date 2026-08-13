'use client'
import { useState, useEffect, type FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function EditarAlunoPage() {
  const router = useRouter()
  const params = useParams()
  const alunoId = params.id as string
  const supabase = createClient()
  
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [plano, setPlano] = useState('')
  const [status, setStatus] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  
  const [loadingDados, setLoadingDados] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function carregarAluno() {
      const { data, error } = await supabase
        .from('alunos')
        .select('*')
        .eq('id', alunoId)
        .single()

      if (data) {
        setNome(data.nome)
        setEmail(data.email)
        setPlano(data.plano)
        setStatus(data.status)
        setCpf(data.cpf || '')
        setTelefone(data.telefone || '')
        setDataNascimento(data.data_nascimento || '')
      }
      setLoadingDados(false)
    }
    carregarAluno()
  }, [alunoId, supabase])

  async function handleAtualizarAluno(e: FormEvent) {
    e.preventDefault()
    setSalvando(true)
    setError(null)

    try {
      const { error: updateError } = await supabase
        .from('alunos')
        .update({ 
          nome, 
          email, 
          plano, 
          status,
          cpf,
          telefone,
          data_nascimento: dataNascimento || null
        })
        .eq('id', alunoId)

      if (updateError) throw updateError

      router.push('/alunos')
      router.refresh()
      
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao atualizar o aluno.')
    } finally {
      setSalvando(false)
    }
  }

  if (loadingDados) {
    return <div className="p-8 text-center text-slate-500 animate-pulse">Carregando dados do aluno...</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Editar Aluno</h1>
          <p className="text-slate-500 mt-1">Atualize as informações cadastradas.</p>
        </div>
        <Link href="/alunos" className="text-sm font-medium text-slate-500 hover:text-slate-900">
          Voltar
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <form onSubmit={handleAtualizarAluno} className="space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
              <input 
                id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
              <input 
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="cpf" className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
              <input 
                id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="block text-sm font-medium text-slate-700 mb-1">WhatsApp / Telefone</label>
              <input 
                id="telefone" type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label htmlFor="dataNascimento" className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
              <input 
                id="dataNascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} 
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
              />
            </div>

            <div>
              <label htmlFor="plano" className="block text-sm font-medium text-slate-700 mb-1">Plano *</label>
              <select 
                id="plano" value={plano} onChange={(e) => setPlano(e.target.value)} required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option value="Mensal">Mensal</option>
                <option value="Trimestral">Trimestral</option>
                <option value="Semestral">Semestral</option>
                <option value="Anual">Anual</option>
              </select>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
              <select 
                id="status" value={status} onChange={(e) => setStatus(e.target.value)} required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
              >
                <option value="Ativo">Ativo</option>
                <option value="Inativo">Inativo</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-slate-100 gap-3">
            <Link 
              href="/alunos"
              className="px-6 py-3 rounded-lg text-slate-700 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={salvando} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}