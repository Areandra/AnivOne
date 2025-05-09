import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, Image, StyleSheet, TouchableOpacity,
  Modal, ActivityIndicator, TextInput, ScrollView
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebaseConfig';

export default function GalleryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    location: '',
    image: '',
    description: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'gallery'));
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setCategories(items);
      } catch (error) {
        console.error('Error fetching gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const CLOUD_NAME = 'dpvcu9q88';
  const UPLOAD_PRESET = 'anivone';

  const pickAndUploadImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;

      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'upload.jpg',
      });
      formData.append('upload_preset', UPLOAD_PRESET);

      try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.secure_url) {
        alert('URL gambar yang di-upload: ' + data.secure_url);
        return data.secure_url;
      } else {
        alert('Upload gagal: ' + JSON.stringify(data));
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Terjadi kesalahan saat upload.');
      return null;
    }
  }

  return null;
};

  const handleAdd = async () => {
    if (!formData.name || !formData.date || !formData.location || !formData.image) {
      alert('Mohon isi semua field dan upload gambar.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'gallery'), formData);
      setCategories(prev => [...prev, { id: docRef.id, ...formData }]);
      setAddModalVisible(false);
      setFormData({ name: '', date: '', location: '', image: '', description: '' });
    } catch (error) {
      console.error('Gagal menambahkan item:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'gallery', id));
      setCategories(prev => prev.filter(item => item.id !== id));
      setSelectedItem(null);
    } catch (error) {
      console.error('Gagal menghapus item:', error);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedItem(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.date}, {item.location}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Memories</Text>
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.list}
      />

      <TouchableOpacity style={styles.fab} onPress={() => setAddModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Modal Detail */}
      <Modal
        visible={!!selectedItem}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <Image source={{ uri: selectedItem.image }} style={styles.modalImage} />
                <Text style={styles.title}>{selectedItem.name}</Text>
                <Text style={styles.subtitle}>{selectedItem.date}, {selectedItem.location}</Text>
                <Text style={{ marginTop: 8 }}>{selectedItem.description || 'No description.'}</Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: 'red' }]}
                    onPress={() => handleDelete(selectedItem.id)}
                  >
                    <Text style={styles.buttonText}>Hapus</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#ccc' }]}
                    onPress={() => setSelectedItem(null)}
                  >
                    <Text style={styles.buttonText}>Tutup</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal Tambah */}
      <Modal
        visible={addModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <ScrollView style={styles.modalContent}>
            <Text style={styles.title}>Tambah Item</Text>

            <TextInput
              placeholder="Nama"
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <TextInput
              placeholder="Tanggal"
              style={styles.input}
              value={formData.date}
              onChangeText={(text) => setFormData({ ...formData, date: text })}
            />
            <TextInput
              placeholder="Lokasi"
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
            <TextInput
              placeholder="Deskripsi"
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#007bff' }]}
              onPress={async () => {
                const url = await pickAndUploadImage();
                if (url) setFormData({ ...formData, image: url });
              }}
            >
              <Text style={styles.buttonText}>
                {formData.image ? 'Gambar Dipilih' : 'Pilih & Upload Gambar'}
              </Text>
            </TouchableOpacity>

            <View style={[styles.modalButtons, { marginTop: 16 }]}>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: 'green' }]}
                onPress={handleAdd}
              >
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, { backgroundColor: '#ccc' }]}
                onPress={() => setAddModalVisible(false)}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    flex: 1,
    width: '100%'
  },
  header: {
    marginTop: 0,
    justifyContent:'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    margin: 8,
    flex: 1,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    backgroundColor: 'pink',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
    justifyContent: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});