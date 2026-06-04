import { useRouter } from 'expo-router';
import {
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { Colors } from '../../constants/theme';

const SUBJECTS = [
  { id: '1', name: 'Langue et Communication', sub: 'Français' },
  { id: '2', name: 'Cloud et Virtualisation', sub: '' },
  { id: '3', name: 'DevOps et Programmation Logiciel', sub: '' },
  { id: '4', name: 'Business Intelligence', sub: 'Data Warehouse' },
  { id: '5', name: 'Programmation Concurrentielle', sub: '' },
  { id: '6', name: 'Java et Sécurité', sub: '' },
  { id: '7', name: 'Management de Projet', sub: '' },
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
      <View style={styles.headerBar}>
        <Text style={styles.header}>Mes Matières</Text>
        <Text style={styles.hint}>Sélectionnez une matière pour marquer la présence</Text>
      </View>
      <FlatList
        data={SUBJECTS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
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
  container: { flex: 1, backgroundColor: Colors.cream },
  headerBar: {
    backgroundColor: Colors.brownDark,
    padding: 24,
    paddingBottom: 20,
    borderBottomWidth: 3,
    borderBottomColor: Colors.gold,
  },
  header: { fontSize: 24, fontWeight: '800', color: Colors.white },
  hint: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  list: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 24 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 18,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderLeftWidth: 4,
    borderLeftColor: Colors.gold,
  },
  cardText: { flex: 1 },
  cardTitle: { color: Colors.text, fontSize: 15, fontWeight: '600' },
  cardSub: { color: Colors.textLight, fontSize: 12, marginTop: 2 },
  arrow: { color: Colors.brown, fontSize: 22 },
});
