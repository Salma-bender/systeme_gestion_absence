import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="(main)/subjects" />
        <Stack.Screen name="(main)/session-code" />
        <Stack.Screen name="(main)/scan" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}
