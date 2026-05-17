import { useRouter } from 'expo-router';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const SUBJECTS = [
  { id: '1', name: 'Langue et Communication', sub: 'Français', icon: '📖' },
  { id: '2', name: 'Cloud et Virtualisation', sub: '', icon: '☁️' },
  { id: '3', name: 'DevOps et Programmation Logiciel', sub: '', icon: '⚙️' },
  { id: '4', name: 'Business Intelligence', sub: 'Data Warehouse', icon: '📊' },
  { id: '5', name: 'Programmation Concurrentielle', sub: '', icon: '🔀' },
  { id: '6', name: 'Java et Sécurité', sub: '', icon: '🔐' },
  { id: '7', name: 'Management de Projet', sub: '', icon: '📋' },
];

export default function SubjectsScreen() {
  const router = useRouter();

  const handleSelect = (subject: (typeof SUBJECTS)[0]) => {
    router.push({
      pathname: '/(main)/session-code',
      params: { subjectId: subject.id, subjectName: subject.name, subjectSub: subject.sub },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Mes Matières</Text>
      <Text style={styles.hint}>Sélectionnez une matière pour marquer votre présence</Text>
      <FlatList
        data={SUBJECTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
            <Text style={styles.icon}>{item.icon}</Text>
            <View style={styles.cardText}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.sub ? <Text style={styles.cardSub}>{item.sub}</Text> : null}
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: '800', color: '#1e293b', padding: 24, paddingBottom: 4 },
  hint: { fontSize: 13, color: '#94a3b8', paddingHorizontal: 24, marginBottom: 16 },
  list: { paddingHorizontal: 16, paddingBottom: 24 },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 14,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  icon: { fontSize: 28, marginRight: 14 },
  cardText: { flex: 1 },
  cardTitle: { color: '#1e293b', fontSize: 15, fontWeight: '600' },
  cardSub: { color: '#94a3b8', fontSize: 12, marginTop: 2 },
  arrow: { color: '#3b82f6', fontSize: 22, fontWeight: '300' },
});
