import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import { useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { detectStudents, saveAttendances } from '../services/api';
import { Colors } from '../constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAM_W = SCREEN_WIDTH - 48;
const CAM_H = CAM_W * 1.9;
const CAPTURE_INTERVAL_MS = 1500;

export default function CameraScreen() {
  const router = useRouter();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  const [scanning, setScanning]             = useState(false);
  const [processing, setProcessing]         = useState(false);
  const [saved, setSaved]                   = useState(false);
  const [frameCount, setFrameCount]         = useState(0);
  const [processedCount, setProcessedCount] = useState(0);
  const [detectedCount, setDetectedCount]   = useState<number | null>(null);

  const cameraRef      = useRef<Camera>(null);
  const intervalRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const capturedPhotos = useRef<string[]>([]);
  const isCapturing    = useRef(false);
  const scanningRef    = useRef(false);

  // Animation trait de scan
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const scanAnimRef  = useRef<Animated.CompositeAnimation | null>(null);

  const startScanAnim = () => {
    scanLineAnim.setValue(0);
    scanAnimRef.current = Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
      ])
    );
    scanAnimRef.current.start();
  };

  const stopScanAnim = () => {
    scanAnimRef.current?.stop();
    scanLineAnim.setValue(0);
  };

  useEffect(() => {
    if (!hasPermission) requestPermission();
    return () => stopInterval();
  }, []);

  const stopInterval = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // ✅ takeSnapshot — capture instantanée SANS freeze du flux vidéo
  const captureBackground = async () => {
    if (!cameraRef.current || isCapturing.current || !scanningRef.current) return;
    isCapturing.current = true;
    try {
      const photo = await cameraRef.current.takeSnapshot({
        quality: 30,          // ✅ qualité basse = ultra rapide
      });
      capturedPhotos.current.push(`file://${photo.path}`);
      setFrameCount(prev => prev + 1);
    } catch (_) {
      // silencieux
    } finally {
      isCapturing.current = false;
    }
  };

  const handleStart = () => {
    capturedPhotos.current = [];
    scanningRef.current = true;
    setScanning(true);
    setSaved(false);
    setDetectedCount(null);
    setFrameCount(0);
    setProcessedCount(0);
    startScanAnim();
    captureBackground();
    intervalRef.current = setInterval(captureBackground, CAPTURE_INTERVAL_MS);
  };

  const handleStop = async () => {
    stopInterval();
    stopScanAnim();
    scanningRef.current = false;
    setScanning(false);
    setProcessing(true);

    const photos = [...capturedPhotos.current];
    if (photos.length === 0) {
      Alert.alert('Aucune photo', 'Aucune frame capturée.');
      setProcessing(false);
      return;
    }

    try {
      const seenIds = new Set<number>();
      const BATCH_SIZE = 3; // ✅ 3 photos à la fois

      for (let i = 0; i < photos.length; i += BATCH_SIZE) {
        const batch = photos.slice(i, i + BATCH_SIZE);
        const results = await Promise.allSettled(
          batch.map(uri => detectStudents(uri))
        );
        for (const r of results) {
          if (r.status === 'fulfilled') {
            for (const s of r.value) seenIds.add(s.id);
          }
        }
        setProcessedCount(i + batch.length);
      }

      setDetectedCount(seenIds.size);

      if (seenIds.size > 0) {
        await saveAttendances(Array.from(seenIds));
        setSaved(true);
      } else {
        Alert.alert('Aucun étudiant', 'Aucun étudiant reconnu.');
      }
    } catch (e: any) {
      Alert.alert('Erreur', e.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setDetectedCount(null);
    setSaved(false);
    setFrameCount(0);
    setProcessedCount(0);
    capturedPhotos.current = [];
  };

  if (!hasPermission || !device) {
    return (
      <SafeAreaView style={s.container}>
        <View style={s.center}>
          <Text style={s.permText}>Accès caméra requis.</Text>
          <TouchableOpacity style={s.btnBlue} onPress={requestPermission}>
            <Text style={s.btnTxt}>Autoriser</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>

      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => { stopInterval(); router.back(); }}>
          <Text style={s.back}>‹ Retour</Text>
        </TouchableOpacity>
        <Text style={s.title}>Scan de présence</Text>
      </View>

      {/* ✅ Caméra — flux 100% continu, takeSnapshot en arrière-plan */}
      <View style={s.cameraWrapper}>
        <Camera
          ref={cameraRef}
          style={s.camera}
          device={device}
          isActive={true}
          photo={true}        // ✅ activer les snapshots
        />

        {/* Coins décoratifs */}
        <View style={[s.corner, s.topLeft]} />
        <View style={[s.corner, s.topRight]} />
        <View style={[s.corner, s.bottomLeft]} />
        <View style={[s.corner, s.bottomRight]} />

        {/* Trait de scan animé */}
        {scanning && (
          <Animated.View
            style={[s.scanLine, {
              transform: [{
                translateY: scanLineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, CAM_H - 4],
                }),
              }],
            }]}
          />
        )}

        {/* Badge discret */}
        {scanning && (
          <View style={s.scanBadge}>
            <View style={s.dot} />
            <Text style={s.scanBadgeTxt}>Scan • {frameCount} frames</Text>
          </View>
        )}
      </View>

      {/* Bouton */}
      <View style={s.actionBar}>
        {detectedCount !== null ? (
          <TouchableOpacity style={s.btnNew} onPress={handleReset}>
            <Text style={s.btnTxt}>🔄  Nouveau scan</Text>
          </TouchableOpacity>
        ) : !scanning ? (
          <TouchableOpacity style={s.btnStart} onPress={handleStart}>
            <Text style={s.btnTxt}>▶  Démarrer le scan</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.btnStop} onPress={handleStop}>
            <Text style={s.btnTxt}>⏹  Arrêter et analyser</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Résultat en bas */}
      <View style={s.resultBar}>
        {processing ? (
          <View style={s.resultRow}>
            <ActivityIndicator color="#94a3b8" size="small" />
            <Text style={s.resultTxt}>
              Analyse... {processedCount}/{frameCount}
            </Text>
          </View>
        ) : detectedCount !== null ? (
          <View style={s.resultRow}>
            <Text style={s.resultDot}>●</Text>
            <Text style={s.resultTxt}>
              {detectedCount} étudiant{detectedCount > 1 ? 's' : ''} présent{detectedCount > 1 ? 's' : ''}
              {saved ? '  ' : ''}
            </Text>
          </View>
        ) : (
          <Text style={s.resultPlaceholder}>
            {scanning ? 'Scan en cours...' : 'Aucun scan effectué'}
          </Text>
        )}
      </View>

    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container:         { flex: 1, backgroundColor: Colors.white, paddingHorizontal: 24, paddingBottom: 24, gap: 16 },
  header:            { flexDirection: 'row', alignItems: 'center', paddingTop: 12, gap: 12 },
  back:              { color: Colors.brown, fontSize: 16 },
  title:             { color: Colors.brownDark, fontSize: 16, fontWeight: '700' },
  cameraWrapper:     { width: CAM_W, height: CAM_H, alignSelf: 'center', borderRadius: 16, overflow: 'hidden', position: 'relative' },
  camera:            { flex: 1 },
  scanLine:          { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: Colors.gold, shadowColor: Colors.gold, shadowOpacity: 0.9, shadowRadius: 6, elevation: 4 },
  corner:            { position: 'absolute', width: 20, height: 20, borderColor: Colors.gold, borderWidth: 3 },
  topLeft:           { top: 0,    left: 0,    borderRightWidth: 0,  borderBottomWidth: 0, borderTopLeftRadius: 16 },
  topRight:          { top: 0,    right: 0,   borderLeftWidth: 0,   borderBottomWidth: 0, borderTopRightRadius: 16 },
  bottomLeft:        { bottom: 0, left: 0,    borderRightWidth: 0,  borderTopWidth: 0,    borderBottomLeftRadius: 16 },
  bottomRight:       { bottom: 0, right: 0,   borderLeftWidth: 0,   borderTopWidth: 0,    borderBottomRightRadius: 16 },
  scanBadge:         { position: 'absolute', top: 12, right: 12, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5, gap: 6 },
  dot:               { width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444' },
  scanBadgeTxt:      { color: Colors.white, fontSize: 11, fontWeight: '600' },
  actionBar:         {},
  btnStart:          { backgroundColor: Colors.brown, borderRadius: 14, paddingVertical: 16, alignItems: 'center', borderWidth: 2, borderColor: Colors.gold },
  btnStop:           { backgroundColor: '#ef4444', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnNew:            { backgroundColor: '#3b82f6', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  btnBlue:           { backgroundColor: Colors.brown, borderRadius: 12, padding: 16, alignItems: 'center', width: '100%' },
  btnTxt:            { color: Colors.white, fontWeight: '700', fontSize: 16 },
  resultBar:         { backgroundColor: '#f1f5f9', borderRadius: 12, paddingVertical: 14, paddingHorizontal: 16, minHeight: 48, justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  resultRow:         { flexDirection: 'row', alignItems: 'center', gap: 8 },
  resultDot:         { color: '#22c55e', fontSize: 10 },
  resultTxt:         { color: Colors.text, fontSize: 14, fontWeight: '500' },
  resultPlaceholder: { color: Colors.textLight, fontSize: 14, textAlign: 'center' },
  center:            { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 16 },
  permText:          { color: Colors.creamDark, textAlign: 'center', fontSize: 15 },
});