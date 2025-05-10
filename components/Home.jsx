import React, { useEffect, useState } from 'react';
import {
  ScrollView, StyleSheet, Text, View,
  Modal, TextInput, TouchableOpacity
} from 'react-native';
import { Card, FAB } from 'react-native-paper';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import Header from './headerBox';
import { db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export default function HomeScreen() {
  const [timeDiff, setTimeDiff] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState(null);
  const [laporanText, setLaporanText] = useState('');
  const [currentLaporan, setCurrentLaporan] = useState('');
  const [currentKeadaan, setCurrentKeadaan] = useState('');
  const startDate = dayjs('2022-10-01T00:00:00');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = dayjs();
      const diff = getDateDiff(startDate, now);
      setTimeDiff(diff);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchLaporan();
    fetchKeadaan();
  }, []);

  const getDateDiff = (start, end) => {
    let years = end.diff(start, 'year');
    start = start.add(years, 'year');

    let months = end.diff(start, 'month');
    start = start.add(months, 'month');

    let days = end.diff(start, 'day');
    start = start.add(days, 'day');

    let hours = end.diff(start, 'hour');
    start = start.add(hours, 'hour');

    let minutes = end.diff(start, 'minute');
    start = start.add(minutes, 'minute');

    let seconds = end.diff(start, 'second');

    return { years, months, days, hours, minutes, seconds };
  };

  const handleSendLaporan = async () => {
    await setDoc(doc(db, 'laporan', 'laporan_utama'), {
      isi: laporanText,
      waktu: new Date()
    });
    setCurrentLaporan(laporanText);
    setLaporanText('');
    closeModal();
  };

  const handleUpdateKeadaan = async (status) => {
    await setDoc(doc(db, 'keadaan', 'keadaan_terakhir'), {
      kondisi: status,
      waktu: new Date()
    });
    setCurrentKeadaan(status);
    closeModal();
  };

  const fetchLaporan = async () => {
    const ref = doc(db, 'laporan', 'laporan_utama');
    const snap = await getDoc(ref);
    if (snap.exists()) setCurrentLaporan(snap.data().isi);
  };

  const fetchKeadaan = async () => {
    const ref = doc(db, 'keadaan', 'keadaan_terakhir');
    const snap = await getDoc(ref);
    if (snap.exists()) setCurrentKeadaan(snap.data().kondisi);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalMode(null);
  };

  const renderTimeBox = (label, value) => (
    <View style={styles.timeBox} key={label}>
      <Text style={styles.timeLabel}>{label}</Text>
      <View style={styles.timeValueBox}>
        <Text style={styles.timeValue}>
          {String(value ?? 0).padStart(2, '0')}
        </Text>
      </View>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Header />
      <View style={{ padding: 16 }}>
        <Card style={styles.card}>
          <Card.Title title="Waktu Bersama" />
          <Card.Content>
            <View style={styles.timerRow}>
              {renderTimeBox('Tahun', timeDiff.years)}
              {renderTimeBox('Bulan', timeDiff.months)}
              {renderTimeBox('Hari', timeDiff.days)}
              {renderTimeBox('Jam', timeDiff.hours)}
              {renderTimeBox('Menit', timeDiff.minutes)}
              {renderTimeBox('Detik', timeDiff.seconds)}
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Laporan Pasangan" />
          <Card.Content>
            <Text style={styles.text}>
              {currentLaporan || 'Belum ada laporan'}
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Keadaan Pasangan" />
          <Card.Content>
            <Text style={styles.text}>
              {currentKeadaan || 'Belum ada keadaan'}
            </Text>
          </Card.Content>
        </Card>
      </View>

      <FAB
        icon="pencil"
        label="Lapor"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            {!modalMode && (
              <>
                <Text style={styles.modalTitle}>Pilih Aksi</Text>
                <TouchableOpacity onPress={() => setModalMode('laporan')}>
                  <Text style={styles.modalOption}>Laporkan Sesuatu</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalMode('keadaan')}>
                  <Text style={styles.modalOption}>Update Keadaan</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeModal}>
                  <Text style={styles.modalCancel}>Batal</Text>
                </TouchableOpacity>
              </>
            )}

            {modalMode === 'laporan' && (
              <>
                <Text style={styles.modalTitle}>Tulis Laporan</Text>
                <TextInput
                  placeholder="Tulis sesuatu..."
                  style={styles.input}
                  multiline
                  value={laporanText}
                  onChangeText={setLaporanText}
                />
                <TouchableOpacity onPress={handleSendLaporan}>
                  <Text style={styles.modalOption}>Kirim</Text>
                </TouchableOpacity>
              </>
            )}

            {modalMode === 'keadaan' && (
              <>
                <Text style={styles.modalTitle}>Pilih Keadaan</Text>
                {['Lapar', 'Marah', 'Senang', 'Sedih', 'Rindu'].map((k) => (
                  <TouchableOpacity key={k} onPress={() => handleUpdateKeadaan(k)}>
                    <Text style={styles.modalOption}>{k}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff0f5',
    paddingBottom: 100,
    flex: 1,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    elevation: 4,
  },
  text: {
    fontSize: 16,
    color: '#444',
  },
  timerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
  timeBox: {
    alignItems: 'center',
    margin: 4,
  },
  timeLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  timeValueBox: {
    backgroundColor: '#f5a8c6',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    minWidth: 50,
    alignItems: 'center',
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 20,
    backgroundColor: '#f5a8c6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '80%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#d36c94',
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
    color: '#d36c94',
  },
  modalCancel: {
    fontSize: 14,
    paddingTop: 10,
    textAlign: 'center',
    color: '#999',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    textAlignVertical: 'top',
    minHeight: 80,
  },
});