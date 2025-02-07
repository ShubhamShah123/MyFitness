import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Appearance } from 'react-native';
import { Colors } from '@/constants/Colors';
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === 'dark' ? Colors.dark : Colors.light;
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  /* 
    the name in stack.screen should be same as the file name. if the file name is session, name has to session not Session or startSession or startsession.
  */
  return (
      <Stack screenOptions={{headerShown: false, headerStyle: { backgroundColor: theme.headerBackground}, headerTintColor: theme.text, headerShadowVisible: false}}>
        <Stack.Screen name="index" options={{title: 'Home'}}/>
        <Stack.Screen name="workout" options={{headerShown: true, title: 'Workout', headerTitle: 'Workout Schedule'}}/>
        <Stack.Screen name="/exercise/[id]" />
        <Stack.Screen name="/nutr/[id]" />
        <Stack.Screen name="/historyDetails//[id]" />
        <Stack.Screen name="/session/[id]" />
        <Stack.Screen name="startSession" options={{headerShown: true, title: 'Session', headerTitle: 'Session'}}/>
        <Stack.Screen name="history" options={{headerShown: false, title: 'History', headerTitle: 'History'}}/>
        <Stack.Screen name="nutrition" options={{headerShown: true, title: 'Nutrition', headerTitle: 'Nutrition'}}/>
        <Stack.Screen name="weightMeasure" options={{headerShown: false, title: 'Weight', headerTitle: 'Weight'}}/>
        <Stack.Screen name="+not-found" options={{headerShown: false}}/>

      </Stack>
  );
}