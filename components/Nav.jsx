// AppNavigator.js
import React from 'react';
import { View, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Gallery from './GalleryList'
import Memories from './Memories'

const Tab = createBottomTabNavigator();

const HomeScreen = () => <View style={{ flex: 1, backgroundColor: '#fff' }} />;
const TodoScreen = () => <View style={{ flex: 1, backgroundColor: '#fff' }} ><Memories/></View>;
const GalleryScreen = () => <View style={{ flex: 1, backgroundColor: '#fff'}}><Gallery/></View>;
const CoupleScreen = () => <View style={{ flex: 1, backgroundColor: '#fff' }} />;
const ProfileScreen = () => <View style={{ flex: 1, backgroundColor: '#fff' }} />;

export default function Nav() {
  return (
    <View style={{ flex: 1, width: '100%'}}>
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarButton: (props) => (
            <TouchableWithoutFeedback onPress={props.onPress}>
              <View style={props.style}>{props.children}</View>
            </TouchableWithoutFeedback>
           ),
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === 'Gallery') {
              return (
                <View style={styles.centerButton}>
                  <View style={styles.qrisButton}>
                    <Ionicons name='images' size={30} color={color} />
                  </View>
                </View>
              );
            }

            let iconName = 'home';
            if (route.name === 'Dump') iconName = 'earth';
            else if (route.name === 'Couple') iconName = 'heart';
            else if (route.name === 'Profile') iconName = 'id-card';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarShowLabel: true,
          tabBarActiveTintColor: route.name !== 'Gallery' ? 'pink' : 'white',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            height: 70,
            paddingBottom: 5,
            paddingTop: 5,
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Dump" component={TodoScreen} />
        <Tab.Screen
          name="Gallery"
          component={GalleryScreen}
          options={{
            tabBarLabel: '',
          }}
        />
        <Tab.Screen name="Couple" component={CoupleScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  centerButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrisButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'pink',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
});