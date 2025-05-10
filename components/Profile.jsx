import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profil Kamu</Text>
      </View>

      <View style={styles.profileBox}>
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=3' }} // bisa diganti ke foto couple
          style={styles.avatar}
        />
        <Text style={styles.name}>Muh Ariel</Text>
        <Text style={styles.subtitle}>Lovebird ID: #123456</Text>
      </View>

      <View style={styles.menuList}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="heart-circle-outline" size={22} color="#f06292" />
          <Text style={styles.menuText}>Moment Spesial</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="settings" size={22} color="#f06292" />
          <Text style={styles.menuText}>Pengaturan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Feather name="log-out" size={22} color="#f06292" />
          <Text style={styles.menuText}>Keluar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#f8bbd0',
    alignItems: 'center',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#880e4f',
  },
  profileBox: {
    alignItems: 'center',
    marginTop: -40,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#f8bbd0',
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    color: '#999',
    fontSize: 13,
    marginTop: 4,
  },
  menuList: {
    marginTop: 30,
    paddingHorizontal: 30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  menuText: {
    marginLeft: 14,
    fontSize: 16,
    color: '#444',
  },
});