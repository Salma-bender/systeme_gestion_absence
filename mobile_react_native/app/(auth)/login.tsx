import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import { Colors } from '../../constants/theme';
import { login } from '../../services/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Champs requis', 'Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace('/(main)/subjects');
    } catch (e: any) {
      Alert.alert('Connexion échouée', e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Présence</Text>
        <Text style={styles.subtitle}>FST Marrakech</Text>
        <Text style={styles.desc}>Connectez-vous à votre compte professeur</Text>

        <Text style={styles.label}>EMAIL</Text>
        <TextInput
          style={styles.input}
          placeholder="prof@univ.dz"
          placeholderTextColor={Colors.textLight}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>MOT DE PASSE</Text>
        <TextInput
          style={styles.input}
          placeholder="••••••"
          placeholderTextColor={Colors.textLight}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          {loading
            ? <ActivityIndicator color={Colors.white} />
            : <Text style={styles.buttonText}>Se connecter</Text>
          }
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.cream },
  inner: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.brownDark, textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 16, fontWeight: '700', color: Colors.gold, textAlign: 'center', marginBottom: 6 },
  desc: { fontSize: 13, color: Colors.textLight, textAlign: 'center', marginBottom: 32 },
  label: {
    fontSize: 11, fontWeight: '700', color: Colors.brown,
    letterSpacing: 1, marginBottom: 6, marginTop: 14, textTransform: 'uppercase',
  },
  input: {
    backgroundColor: Colors.white,
    color: Colors.text,
    borderRadius: 8,
    padding: 14,
    fontSize: 15,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  button: {
    backgroundColor: Colors.brown,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 28,
  },
  buttonText: { color: Colors.white, fontWeight: '700', fontSize: 16 },
});
