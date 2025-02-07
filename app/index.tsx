import React from 'react';
import { View, Text, StyleSheet, Pressable, BackHandler } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const handleExit = () => {
	BackHandler.exitApp()
}

const buttons = [
  { title: 'Workout Schedule', icon: 'dumbbell', link: '/workout' },
  { title: 'Nutrition', icon: 'utensils', link: '/nutrition' },
  { title: 'Weight Measure', icon: 'weight', link: '/weightMeasure' },
  { title: 'Start Session', icon: 'stopwatch', link: '/startSession' },
  { title: 'History', icon: 'history', link: '/history' },
  { title: 'Exit', icon: 'sign-out-alt', link: '/', onPressFunc: handleExit },
];

const App = () => {
  return (
    <View style={styles.container}>
			<StatusBar style="light" />
      {buttons.map((item, index) => (
        <View key={index} style={styles.buttonWrapper}>
          <Link href={item.link} asChild>
            <Pressable style={styles.button} onPress={item.onPressFunc}>
              <Icon name={item.icon} size={40} color="white" />
              <Text style={styles.buttonText}>{item.title}</Text>
            </Pressable>
          </Link>
        </View>
      ))}
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    paddingVertical: 50,
  },
  buttonWrapper: {
    width: '50%', // Ensures proper alignment
    aspectRatio: 0.85, // Keeps buttons square
		padding: 10
  },
  button: {
    flex: 1, // Ensures Pressable fills the container
    backgroundColor: '#111',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    marginTop: 10,
  },
});
