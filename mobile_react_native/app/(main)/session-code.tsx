import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SessionCodeScreen() {
  const router = useRouter();
  const { subjectId, subjectName, subjectSub } = useLocalSearchParams<{
    subjectId: string;
    subjectName: string;
    subjectSub: string;
  }>();
  const [code, setCode] = useState('');

  const handleValidate = () => {
    if (code.trim().length < 4) {
      Alert.alert('Code invalide', 'Veuillez entrer un code de séance valide.');
      return;
    }
    // TODO: validate code with backend
    router.push({
      pathname: '/(main)/scan',
      params: { subjectId, subjectName, subjectSub, sessionCode: code.trim() },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.inner}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>‹ Retour</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.label}>MATIÈRE</Text>
          <Text style={styles.subject}>{subjectName}</Text>
          {subjectSub ? <Text style={styles.subjectSub}>{subjectSub}</Text> : null}

          <Text style={styles.sectionTitle}>Code de séance</Text>
          <Text style={styles.hint}>Entrez le code fourni par votre enseignant</Text>

          <TextInput
            style={styles.codeInput}
            placeholder="Ex: A1B2C3"
            placeholderTextColor="#adb5bd"
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            maxLength={10}
            textAlign="center"
          />

          <TouchableOpacity style={styles.button} onPress={handleValidate}>
            <Text style={styles.buttonText}>Valider</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1 },
  back: { padding: 20, paddingBottom: 0 },
  backText: { color: '#3b82f6', fontSize: 16 },
  content: { flex: 1, justifyContent: 'center', padding: 28 },
  label: { fontSize: 11, fontWeight: '700', color: '#475569', letterSpacing: 1 },
  subject: { color: '#1e293b', fontSize: 22, fontWeight: '700', marginTop: 4 },
  subjectSub: { color: '#94a3b8', fontSize: 14, marginTop: 2, marginBottom: 8 },
  sectionTitle: { color: '#1e293b', fontSize: 18, fontWeight: '700', marginTop: 40, marginBottom: 4 },
  hint: { color: '#94a3b8', fontSize: 13, marginBottom: 20 },
  codeInput: {
    backgroundColor: '#f1f5f9',
    color: '#1e293b',
    borderRadius: 14,
    padding: 20,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
