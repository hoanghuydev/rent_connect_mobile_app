import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import "./App.css"
const App: React.FC = () => {
  const classNames = [];

  classNames.push("font-bold");
  classNames.push("italic");
  classNames.push("line-through text-red-400");

  return (
    <View style={styles.container}>
      <Text className={classNames.join(" ")}>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
