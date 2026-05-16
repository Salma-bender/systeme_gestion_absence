import { CameraView, useCameraPermissions } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { detectStudents } from '../services/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAM_SIZE = SCREEN_WIDTH - 32;

export default function CameraScreen() {
  const router = useRouter();
  const { subjectName, subjectSub, sessionCode } = useLocalSearchParams<{
    subjectName: string;
    subjectSub: string;
    sessionCode: string;
  }>();

  const [permission, requestPermission] = useCameraPermissions();
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [log, setLog] = useState<string[]>([]);
  const [result, setResult] = useState<any[] | null>(null);

  const cameraRef = useRef<CameraView>(null);

  // Ajouter une ligne dans le log visuel
  const addLog = (msg: string) => {
    console.log('[DEBUG]', msg);
    setLog(prev => [`${new Date().toLocaleTimeString()} — ${msg}`, ...prev]);
  };

  useEffect(() => {
    if (!permission?.granted) requestPermission();
  }, []);

  const handleCapture = async () => {
    if (!cameraRef.current || loading) return;
    setLoading(true);
    setCapturedUri(null);
    setResult(null);
    setLog([]);

    try {
      // ── ÉTAPE 1 : Capture ──
      addLog('Capture en cours...');
     const photo = await cameraRef.current.takePictureAsync({
  quality: 0.8,
});

      addLog(`URI : ${photo.uri}`);
      addLog(`Dimensions : ${photo.width} x ${photo.height}`);
      setCapturedUri(photo.uri);

      // ── ÉTAPE 2 : Envoi vers Spring Boot /detect ──
      addLog('Envoi vers Spring Boot /attendance/detect ...');
      const students = await detectStudents(photo.uri);

      addLog(`Réponse reçue : ${JSON.stringify(students)}`);
      setResult(students);

      if (students.length === 0) {
        addLog('⚠️ Aucun étudiant détecté — vérifier logs Spring Boot et AI API');
      } else {
        addLog(`✅ ${students.length} étudiant(s) détecté(s)`);
      }

    } catch (e: any) {
      addLog(`❌ ERREUR : ${e.message}`);
      Alert.alert('Erreur', e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionBox}>
          <Text style={styles.permissionText}>
            Accès caméra requis.
          </Text>
          <TouchableOpacity style={styles.btn} onPress={requestPermission}>
            <Text style={styles.btnText}>Autoriser la caméra</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ── Header ── */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>‹ Retour</Text>
          </TouchableOpacity>
          <Text style={styles.title}>🔬 Mode Debug Capture</Text>
        </View>

        {/* ── Caméra arrière ── */}
        <View style={styles.cameraBox}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            pictureSize="1920x1080"
          />
        </View>

        {/* ── Bouton capture ── */}
        <TouchableOpacity
          style={[styles.captureBtn, loading && styles.btnDisabled]}
          onPress={handleCapture}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.captureBtnText}>📸  Tester Capture</Text>
          }
        </TouchableOpacity>

        {/* ── Aperçu image capturée ── */}
        {capturedUri && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Image capturée</Text>
            <Image
              source={{ uri: capturedUri }}
              style={styles.preview}
              resizeMode="contain"
            />
            <Text style={styles.uriText} selectable>{capturedUri}</Text>
          </View>
        )}

        {/* ── Résultat détection ── */}
        {result !== null && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Résultat détection ({result.length} étudiant(s))
            </Text>
            {result.length === 0
              ? <Text style={styles.noResult}>Aucun étudiant reconnu</Text>
              : result.map((s: any) => (
                  <View key={s.id} style={styles.studentRow}>
                    <Text style={styles.check}>✓</Text>
                    <Text style={styles.studentName}>{s.firstName} {s.lastName}</Text>
                  </View>
                ))
            }
          </View>
        )}

        {/* ── Log visuel ── */}
        {log.length > 0 && (
          <View style={styles.logBox}>
            <Text style={styles.sectionTitle}>Logs</Text>
            {log.map((line, i) => (
              <Text key={i} style={styles.logLine}>{line}</Text>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scroll: { padding: 16, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  back: { color: '#3b82f6', fontSize: 16 },
  title: { color: '#f1f5f9', fontSize: 15, fontWeight: '700' },

  cameraBox: {
    width: CAM_SIZE,
    height: CAM_SIZE,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3b82f6',
    alignSelf: 'center',
  },
  camera: { flex: 1 },

  captureBtn: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  btnDisabled: { opacity: 0.5 },
  captureBtnText: { color: '#fff', fontWeight: '700', fontSize: 16 },

  section: {
    marginTop: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
  },
  sectionTitle: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  preview: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    backgroundColor: '#0f172a',
  },
  uriText: {
    color: '#64748b',
    fontSize: 10,
    marginTop: 6,
  },

  noResult: { color: '#f87171', fontSize: 14 },
  studentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  check: { color: '#22c55e', fontSize: 16, marginRight: 8 },
  studentName: { color: '#f1f5f9', fontSize: 14 },

  logBox: {
    marginTop: 20,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
  },
  logLine: {
    color: '#a3e635',
    fontSize: 11,
    fontFamily: 'monospace',
    marginBottom: 4,
  },

  permissionBox: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  permissionText: { color: '#94a3b8', textAlign: 'center', fontSize: 15, marginBottom: 24 },
  btn: { backgroundColor: '#3b82f6', borderRadius: 12, padding: 16, alignItems: 'center', width: '100%' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
