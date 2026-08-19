'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AlunoLoginPage() {
  const router = useRouter()
  const [cpf, setCpf] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  // Função para formatar o CPF enquanto o usuário digita
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '') // Tira tudo que não é número
    if (value.length > 11) value = value.slice(0, 11)
    
    // Aplica a máscara 000.000.000-00
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    
    setCpf(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErro('')

    // 🔴 AQUI ENTRARÁ A LÓGICA DO SUPABASE:
    // 1. Procurar o e-mail do aluno usando este CPF
    // 2. Fazer o signIn() no Supabase com o E-mail e a Senha
    // 3. Checar a coluna "primeiro_acesso" do banco

    try {
      // Simulação rápida para visualizarmos o fluxo indo para a próxima tela
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simulando que o sistema detectou que é o 1º acesso:
      router.push('/aluno/primeiro-acesso')
      
    } catch (error) {
      setErro('CPF ou senha inválidos.')
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">
          Área do Aluno
        </h2>
        <p className="text-center text-sm text-slate-500 mt-2">
          Use seu CPF para acessar seus treinos e dados.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Campo CPF */}
          <div>
            <label htmlFor="cpf" className="block text-sm font-medium leading-6 text-slate-900">
              CPF
            </label>
            <div className="mt-2">
              <input
                id="cpf"
                name="cpf"
                type="tel"
                required
                value={cpf}
                onChange={handleCpfChange}
                placeholder="000.000.000-00"
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="senha" className="block text-sm font-medium leading-6 text-slate-900">
                Senha (Data de Nasc.)
              </label>
            </div>
            <div className="mt-2">
              <input
                id="senha"
                name="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Ex: 15/08/1995 ou sua nova senha"
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Mensagem de Erro (caso exista) */}
          {erro && (
            <div className="text-sm text-rose-600 font-medium bg-rose-50 p-3 rounded-lg text-center">
              {erro}
            </div>
          )}

          {/* Botão Entrar */}
          <div>
            <button
              type="submit"
              disabled={loading || cpf.length < 14 || !senha}
              className="flex w-full justify-center rounded-xl bg-blue-600 px-3 py-3.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Autenticando...
                </span>
              ) : (
                'Entrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}