import { createContext, useContext, useEffect, useState, type PropsWithChildren } from 'react'
import { SplashScreen, Stack } from 'expo-router'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

type Role = 'admin' | 'colaborador' | 'aluno'
type Profile = { id: string; academia_id: string; nome: string; role: Role }

type AuthContextType = {
  session: Session | null
  profile: Profile | null
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('useAuth deve ser usado dentro de <AuthProvider />')
  return value
}

function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadProfile(userId: string) {
      const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
      setProfile(data as Profile | null)
    }

    supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session)
      if (data.session) await loadProfile(data.session.user.id)
      setIsLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      setSession(newSession)
      if (newSession) {
        await loadProfile(newSession.user.id)
      } else {
        setProfile(null)
      }
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <AuthContext.Provider value={{ session, profile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

SplashScreen.preventAutoHideAsync()

function SplashScreenController() {
  const { isLoading } = useAuth()
  if (!isLoading) SplashScreen.hide()
  return null
}

function RootNavigator() {
  const { session, profile } = useAuth()
  const isAluno = !!session && profile?.role === 'aluno'

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={isAluno}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>

      <Stack.Protected guard={!isAluno}>
        <Stack.Screen name="(auth)/login" />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <SplashScreenController />
      <RootNavigator />
    </AuthProvider>
  )
}