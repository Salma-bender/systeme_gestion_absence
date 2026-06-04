import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
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
import { Colors } from '../../constants/theme';
import { validateSessionCode } from '../../services/api';

export default function SessionCodeScreen() {
  const router = useRouter();
  const { subjectId, subjectName, subjectSub } = useLocalSearchParams<{
    subjectId: string;
    subjectName: string;
    subjectSub: string;
  }>();
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const handleValidate = async () => {
    if (code.trim().length < 4) {
      Alert.alert('Code invalide', 'Veuillez entrer un code de séance valide.');
      return;
    }
    setLoading(true);
    try {
      const session = await validateSessionCode(code.trim().toUpperCase());
      router.push({
        pathname: '/(main)/scan',
        params: {
          subjectId,
          subjectName: session.subject || subjectName,
          subjectSub,
          sessionCode: session.code,
          sessionId: String(session.id),
        },
      });
    } catch (e: any) {
      Alert.alert('Code invalide', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={styles.inner} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <TouchableOpacity style={styles.back} onPress={() => router.back()}>
          <Text style={styles.backText}>‹ Retour</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.label}>MATIÈRE</Text>
          <Text style={styles.subject}>{subjectName}</Text>
          {subjectSub ? <Text style={styles.subjectSub}>{subjectSub}</Text> : null}

          {/* Code box style web */}
          <View style={styles.codeBox}>
            <Text style={styles.codeBoxLabel}>CODE DE SÉANCE</Text>
          </View>

          <TextInput
            style={styles.codeInput}
            placeholder="Ex: A1B2C3"
            placeholderTextColor={Colors.textLight}
            value={code}
            onChangeText={setCode}
            autoCapitalize="characters"
            maxLength={10}
            textAlign="center"
          />

          <TouchableOpacity style={styles.button} onPress={handleValidate} disabled={loading}>
            {loading
              ? <ActivityIndicator color={Colors.white} />
              : <Text style={styles.buttonText}>Valider</Text>
            }
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  inner: { flex: 1 },
  back: { padding: 20, paddingBottom: 0 },
  backText: { color: Colors.brown, fontSize: 16, fontWeight: '600' },
  content: { flex: 1, justifyContent: 'center', padding: 28 },
  label: { fontSize: 11, fontWeight: '700', color: Colors.brown, letterSpacing: 1, textTransform: 'uppercase' },
  subject: { color: Colors.brownDark, fontSize: 22, fontWeight: '700', marginTop: 4 },
  subjectSub: { color: Colors.textLight, fontSize: 14, marginTop: 2, marginBottom: 8 },
  codeBox: {
    backgroundColor: Colors.brownDark,
    borderRadius: 10,
    padding: 20,
    marginTop: 32,
    marginBottom: 8,
  },
  codeBoxLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 4 },
  hint: { color: 'rgba(255,255,255,0.9)', fontSize: 13 },
  codeInput: {
    backgroundColor: Colors.white,
    color: Colors.text,
    borderRadius: 8,
    padding: 20,
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: 24,
    marginTop: 12,
  },
  button: {
    backgroundColor: Colors.brown,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
