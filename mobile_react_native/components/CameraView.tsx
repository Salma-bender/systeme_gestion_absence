import { CameraView as ExpoCameraView } from 'expo-camera';
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Props {
  cameraRef: React.RefObject<ExpoCameraView>;
}

/**
 * Composant caméra arrière avec cadre de scan.
 * Utilisé par CameraScreen pour le scan automatique de classe.
 */
export default function CameraViewComponent({ cameraRef }: Props) {
  return (
    <View style={styles.wrapper}>
      <ExpoCameraView ref={cameraRef} style={styles.camera} facing="back">
        {/* Coins de cadrage */}
        <View style={[styles.corner, styles.topLeft]} />
        <View style={[styles.corner, styles.topRight]} />
        <View style={[styles.corner, styles.bottomLeft]} />
        <View style={[styles.corner, styles.bottomRight]} />
      </ExpoCameraView>
    </View>
  );
}

const SIZE = SCREEN_WIDTH - 48;

const styles = StyleSheet.create({
  wrapper: {
    width: SIZE,
    height: SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  camera: { flex: 1 },
  corner: { position: 'absolute', width: 28, height: 28, borderColor: '#fff' },
  topLeft:     { top: 12,    left: 12,    borderTopWidth: 3,    borderLeftWidth: 3 },
  topRight:    { top: 12,    right: 12,   borderTopWidth: 3,    borderRightWidth: 3 },
  bottomLeft:  { bottom: 12, left: 12,    borderBottomWidth: 3, borderLeftWidth: 3 },
  bottomRight: { bottom: 12, right: 12,   borderBottomWidth: 3, borderRightWidth: 3 },
});
