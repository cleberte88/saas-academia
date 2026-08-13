'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BotaoExcluir({ id, nome }: { id: string, nome: string }) {
  const [excluindo, setExcluindo] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleDelete() {
    // Pede confirmação antes de apagar
    if (!window.confirm(`Tem certeza que deseja excluir o aluno ${nome}? Essa ação não pode ser desfeita.`)) {
      return
    }

    setExcluindo(true)
    
    // Deleta o aluno no Supabase
    const { error } = await supabase.from('alunos').delete().eq('id', id)
    
    if (error) {
      alert('Erro ao excluir aluno.')
      setExcluindo(false)
    } else {
      // Atualiza a página automaticamente para o aluno sumir da lista
      router.refresh()
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={excluindo}
      className="text-rose-600 hover:text-rose-800 font-medium ml-4 disabled:opacity-50"
    >
      {excluindo ? 'Excluindo...' : 'Excluir'}
    </button>
  )
}