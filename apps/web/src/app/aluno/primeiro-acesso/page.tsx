'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PrimeiroAcessoPage() {
  const router = useRouter()
  const [senha, setSenha] = useState('')
  const [confirmaSenha, setConfirmaSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErro('')

    // Valida se as senhas coincidem
    if (senha !== confirmaSenha) {
      setErro('As senhas não coincidem. Digite novamente.')
      return
    }

    // Valida tamanho mínimo da senha
    if (senha.length < 6) {
      setErro('A senha precisa ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      // 🔴 AQUI ENTRARÁ A LÓGICA DO SUPABASE:
      // 1. Atualizar a senha do usuário logado via supabase.auth.updateUser()
      // 2. Atualizar a coluna "primeiro_acesso" para false na tabela alunos

      // Simulando o salvamento com sucesso
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redireciona para a Home do Aluno
      router.push('/aluno')
      
    } catch (error: any) {
      setErro('Erro ao atualizar a senha. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="flex-1 flex flex-col justify-center px-6 py-12">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
          🔒
        </div>
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-slate-900">
          Defina sua nova senha
        </h2>
        <p className="text-center text-sm text-slate-500 mt-2">
          Este é o seu primeiro acesso. Por segurança, crie uma senha pessoal para os próximos logins.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          
          {/* Nova Senha */}
          <div>
            <label htmlFor="senha" className="block text-sm font-medium leading-6 text-slate-900">
              Nova Senha
            </label>
            <div className="mt-2">
              <input
                id="senha"
                name="senha"
                type="password"
                required
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Mínimo de 6 caracteres"
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Confirmar Nova Senha */}
          <div>
            <label htmlFor="confirmaSenha" className="block text-sm font-medium leading-6 text-slate-900">
              Confirme a Nova Senha
            </label>
            <div className="mt-2">
              <input
                id="confirmaSenha"
                name="confirmaSenha"
                type="password"
                required
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
                placeholder="Digite a senha novamente"
                className="block w-full rounded-xl border-0 py-3 px-4 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {/* Mensagem de Erro */}
          {erro && (
            <div className="text-sm text-rose-600 font-medium bg-rose-50 p-3 rounded-lg text-center">
              {erro}
            </div>
          )}

          {/* Botão Salvar e Entrar */}
          <div>
            <button
              type="submit"
              disabled={loading || !senha || !confirmaSenha}
              className="flex w-full justify-center rounded-xl bg-blue-600 px-3 py-3.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando senha...
                </span>
              ) : (
                'Salvar senha e entrar'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}