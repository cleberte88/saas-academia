import { View, Text, StyleSheet } from 'react-native'

export default function TreinoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meu Treino</Text>
      {/* TODO: listar o treino do aluno */}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24 },
  title: { fontSize: 24, fontWeight: '700' },
})