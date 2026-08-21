'use server'

import { createClient } from '@supabase/supabase-js'

export async function criarContaAlunoAuth(email: string, senhaInicial: string) {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      }
    )

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: senhaInicial,
      email_confirm: true,
    })

    if (error) {
      console.error('ERRO DETALHADO DO SUPABASE ADMIN:', error.message)
      throw new Error(`Erro Auth: ${error.message}`)
    }

    return data.user
  } catch (err: any) {
    console.error('EXCEÇÃO EM criarContaAlunoAuth:', err)
    throw err
  }
}