import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.logoText}>Anivone</Text>
          <Text style={styles.greeting}>Hai, Muh Ariel</Text>
        </View>
        <View style={styles.iconRow}>
          <Ionicons name="notifications-outline" size={24} color="#fff" style={styles.icon} />
          <MaterialCommunityIcons name="headset" size={24} color="#fff" />
        </View>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Total Waktu Bersama</Text>
        <Text style={styles.infoValue}>1 Tahun 3 Bulan 7 Hari</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: 'pink',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  greeting: {
    color: '#fff',
    fontSize: 16,
    marginTop: 4,
  },
  iconRow: {
    flexDirection: 'row',
  },
  icon: {
    marginRight: 10,
  },
  infoCard: {
    backgroundColor: '#ffffff20',
    marginTop: 20,
    borderRadius: 15,
    padding: 16,
  },
  infoLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 4,
  },
  infoValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Header;