// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from '@react-navigation/stack';
// import LoginScreen from './components/Login';
// import Nav from "./components/Nav";

// const Stack = createStackNavigator();

// export default function App() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Home" component={Nav} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Nav from './components/Nav'

export default function App() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionFlex}>
      <Nav />
      <StatusBar style="light" />
      </View>
    </View>
  );
}

const StatusBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  section: {
    paddingTop: StatusBarHeight,
    height: '100%',
    width: '100%',
    backgroundColor: 'pink',
  },
  
  sectionFlex: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
