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
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [dataNascimento, setDataNascimento] = useState('')
  
  // Novos estados para o Financeiro
  const [plano, setPlano] = useState('Mensal')
  const [valorMensalidade, setValorMensalidade] = useState('120')
  // Já deixa a data de hoje pré-selecionada no formato correto
  const [dataVencimento, setDataVencimento] = useState(new Date().toISOString().split('T')[0])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Função inteligente que muda o valor sugerido quando o plano muda
  function handlePlanoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const novoPlano = e.target.value
    setPlano(novoPlano)
    
    if (novoPlano === 'Mensal') setValorMensalidade('120')
    if (novoPlano === 'Trimestral') setValorMensalidade('300')
    if (novoPlano === 'Semestral') setValorMensalidade('540')
    if (novoPlano === 'Anual') setValorMensalidade('960')
  }

  async function handleSalvarAluno(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não autenticado')

      const { data: profile } = await supabase
        .from('profiles')
        .select('academia_id')
        .eq('id', user.id)
        .single()

      if (!profile?.academia_id) throw new Error('Academia não encontrada')

      // 1. Salva o Aluno
      const { data: novoAluno, error: insertError } = await supabase
        .from('alunos')
        .insert([{
          nome,
          email,
          plano,
          status: 'Ativo',
          cpf,
          telefone,
          data_nascimento: dataNascimento || null,
          academia_id: profile.academia_id
        }])
        .select()
        .single()

      if (insertError) throw insertError

      // 2. Salva a Mensalidade com os dados customizados da tela
      const { error: financeiroError } = await supabase
        .from('mensalidades')
        .insert([{
          aluno_id: novoAluno.id,
          academia_id: profile.academia_id,
          valor: Number(valorMensalidade), // Usa o valor digitado na tela
          data_vencimento: dataVencimento, // Usa a data escolhida na tela
          status: 'Pendente'
        }])

      if (financeiroError) {
        console.error('Erro ao gerar mensalidade:', financeiroError)
        throw new Error('Aluno salvo, mas ocorreu um erro ao gerar a cobrança.')
      }

      router.push('/alunos')
      router.refresh()
      
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o aluno.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Novo Aluno</h1>
          <p className="text-slate-500 mt-1">Preencha os dados completos para matricular o aluno.</p>
        </div>
        <Link href="/alunos" className="text-sm font-medium text-slate-500 hover:text-slate-900">
          Voltar
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sm:p-8">
        <form onSubmit={handleSalvarAluno} className="space-y-8">
          
          {/* SESSÃO 1: DADOS PESSOAIS */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Dados Pessoais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="nome" className="block text-sm font-medium text-slate-700 mb-1">Nome Completo *</label>
                <input 
                  id="nome" type="text" value={nome} onChange={(e) => setNome(e.target.value)} required 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Ex: João da Silva"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">E-mail *</label>
                <input 
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="joao@email.com"
                />
              </div>

              <div>
                <label htmlFor="cpf" className="block text-sm font-medium text-slate-700 mb-1">CPF</label>
                <input 
                  id="cpf" type="text" value={cpf} onChange={(e) => setCpf(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="000.000.000-00"
                />
              </div>

              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-slate-700 mb-1">WhatsApp / Telefone</label>
                <input 
                  id="telefone" type="text" value={telefone} onChange={(e) => setTelefone(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label htmlFor="dataNascimento" className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                <input 
                  id="dataNascimento" type="date" value={dataNascimento} onChange={(e) => setDataNascimento(e.target.value)} 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
                />
              </div>
            </div>
          </div>

          {/* SESSÃO 2: PLANO E FINANCEIRO */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-100">Plano e Financeiro</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              <div>
                <label htmlFor="plano" className="block text-sm font-medium text-slate-700 mb-1">Plano Escolhido *</label>
                <select 
                  id="plano" value={plano} onChange={handlePlanoChange} required
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white"
                >
                  <option value="Mensal">Mensal</option>
                  <option value="Trimestral">Trimestral</option>
                  <option value="Semestral">Semestral</option>
                  <option value="Anual">Anual</option>
                </select>
              </div>

              <div>
                <label htmlFor="valorMensalidade" className="block text-sm font-medium text-slate-700 mb-1">Valor do Plano (R$) *</label>
                <input 
                  id="valorMensalidade" type="number" step="0.01" value={valorMensalidade} onChange={(e) => setValorMensalidade(e.target.value)} required 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>

              <div>
                <label htmlFor="dataVencimento" className="block text-sm font-medium text-slate-700 mb-1">Data do 1º Pagamento *</label>
                <input 
                  id="dataVencimento" type="date" value={dataVencimento} onChange={(e) => setDataVencimento(e.target.value)} required 
                  className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-slate-700"
                />
              </div>

            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-slate-100">
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Processando...' : 'Finalizar Matrícula'}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}