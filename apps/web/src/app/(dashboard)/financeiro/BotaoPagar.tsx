'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function BotaoPagar({ id }: { id: string }) {
  const [carregando, setCarregando] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handlePagar() {
    if (!window.confirm('Confirmar o recebimento desta mensalidade?')) return

    setCarregando(true)
    
    // Pega a data de hoje para registrar quando foi pago
    const dataHoje = new Date().toISOString().split('T')[0]

    const { error } = await supabase
      .from('mensalidades')
      .update({ 
        status: 'Pago',
        data_pagamento: dataHoje
      })
      .eq('id', id)
    
    if (error) {
      alert('Erro ao registrar pagamento.')
      setCarregando(false)
    } else {
      // Atualiza a página para o status mudar para verde instantaneamente
      router.refresh()
    }
  }

  return (
    <button 
      onClick={handlePagar} 
      disabled={carregando}
      className="text-blue-600 hover:text-blue-800 font-medium disabled:opacity-50"
    >
      {carregando ? 'Processando...' : 'Marcar como Pago'}
    </button>
  )
}