import { Tabs } from 'expo-router'

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="treino" options={{ title: 'Treino' }} />
    </Tabs>
  )
}