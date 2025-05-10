import React, { useEffect, useState } from 'react';
import { Dimensions, View, Text, FlatList, Image, StyleSheet, TouchableOpacity,
  Modal, ActivityIndicator, TextInput, ScrollView, Button, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { db, storage } from '../firebaseConfig';
import { sha1 } from 'js-sha1';
import DateTimePicker from '@react-native-community/datetimepicker';

const CLOUD_NAME = 'dpvcu9q88';
const UPLOAD_PRESET = 'anivone';
const API_KEY = '558516275557451';
const API_SECRET = '8Xn1fh91OnG3-hEc3h_kRkTsJ8k';

export default function GalleryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [tempPublicId, setTempPublicId] = useState(null);
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
  setLoading(true);
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
        return {
          url: data.secure_url,
          public_id: data.public_id,
        };
      } else {
        alert('Upload gagal: ' + JSON.stringify(data));
        return null;
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Terjadi kesalahan saat upload.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return null;
};

const deleteImageFromCloudinary = async (publicId) => {
  setLoading(true);
  const timestamp = Math.floor(Date.now() / 1000);
  const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
  const signature = sha1(stringToSign);

  const formData = new FormData();
  formData.append('public_id', publicId);
  formData.append('api_key', API_KEY);
  formData.append('timestamp', timestamp);
  formData.append('signature', signature);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`, {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    console.log('Delete result:', data);
    return data.result === 'ok';
  } catch (err) {
    console.error('Delete error:', err);
    return false;
  } finally {
    setLoading(false);
  }
};

  const handleAdd = async () => {
    if (!formData.name || !formData.date || !formData.location || !formData.image) {
      alert('Mohon isi semua field dan upload gambar.');
      return;
    }
    try {
      const docRef = await addDoc(collection(db, 'gallery'), formData);
      setCategories(prev => [...prev, { id: docRef.id, ...formData }]);
      setTempPublicId(null);
      setAddModalVisible(false);
      setFormData({ name: '', date: '', location: '', image: '', description: '' });
    } catch (error) {
      console.error('Gagal menambahkan item:', error);
    } 
  };

  const handleDelete = async (id) => {
  try {
    const item = categories.find(c => c.id === id);
    if (item?.public_id) {
      await deleteImageFromCloudinary(item.public_id);
    }
    await deleteDoc(doc(db, 'gallery', id));
    setCategories(prev => prev.filter(item => item.id !== id));
    setSelectedItem(null);
  } catch (error) {
    console.error('Gagal menghapus item:', error);
    }
  }

  const sortedData = categories.sort((a, b) => new Date(b.date) - new Date(a.date));

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => setSelectedItem(item)}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.name}</Text>
        <Text style={styles.subtitle}>{item.date}, {item.location}</Text>
      </View>
    </TouchableOpacity>
  );
  
  const cancelAddModal = async () => {
    if (tempPublicId) {
      await deleteImageFromCloudinary(tempPublicId);
      setTempPublicId(null);
    }
    setFormData({ name: '', date: '', location: '', image: '', description: '', public_id: '' });
    setAddModalVisible(false);
  };

  const DateInput = () => {
    const [showPicker, setShowPicker] = useState(false);

    const handleDateChange = (event, selectedDate) => {
      if (selectedDate) {
        const formattedDate = selectedDate.toISOString().split('T')[0]; // YYYY-MM-DD
        setFormData({ ...formData, date: formattedDate });
      }
      setShowPicker(false); // Tutup picker setelah dipilih
    };

    return (
      <View>
        <TextInput
          placeholder="Tanggal"
          placeholderTextColor='pink'
          style={styles.input}
          value={formData.date}
          onTouchStart={() => setShowPicker(true)}
        />
        {showPicker && (
          <DateTimePicker
            value={formData.date ? new Date(formData.date) : new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}
      </View>
    );
  };
  
  const AutoSizedImage = ({ uri, style }) => {
    const [dimensions, setDimensions] = useState(null);
    
    useEffect(() => {
      Image.getSize(uri, (width, height) => {
        const screenHeight = Dimensions.get('window').height;
        console.log(screenHeight)
        let imageHeight = (height * 0.445) * (screenHeight / 1000);
        if (imageHeight > (screenHeight * 0.75)) {
          imageHeight = imageHeight * 0.65;
        }
        
        setDimensions(imageHeight)
      },
      (error) => console.error('Gagal dapat ukuran:', error)
      );
    }, [uri]);

    if (!dimensions) return null; // atau bisa tampilkan loader
    
    return (
      <Image
        source={{ uri }}
        style={[{ height: dimensions, borderRadius: 10 }, style]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Modal
      visible={loading}
      transparent
      animationType="none"
      >
        <View style={styles.modalBackground}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </Modal>
      <Text style={styles.header}>Kenangan</Text>
      <FlatList
        data={sortedData}
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
        animationType="fade"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            {selectedItem && (
              <>
                <AutoSizedImage uri={selectedItem.image} style={styles.modalImage} />
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
        animationType="fade"
        transparent={true}
        onRequestClose={cancelAddModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={[styles.title, {marginBottom:16}]}>Tambah Kenangan</Text>

            <TextInput
              placeholder="Nama"
              placeholderTextColor='pink'
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            
            <DateInput/>
            
            <TextInput
              placeholder="Lokasi"
              placeholderTextColor='pink'
              style={styles.input}
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
            <TextInput
              placeholder="Deskripsi"
              placeholderTextColor='pink'
              style={styles.input}
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: '#C71585' }]}
              onPress={async () => {
                if (tempPublicId) {
                  await deleteImageFromCloudinary(tempPublicId);
                  setTempPublicId(null);
                }
                const result = await pickAndUploadImage();
                if (result) {
                  setTempPublicId(result.public_id);
                  setFormData({...formData, image: result.url, public_id: result.public_id,
                  });
                }
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
                onPress={cancelAddModal}
              >
                <Text style={styles.buttonText}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingHorizontal: 16,
    backgroundColor: '#ede7e1',
    flex: 1,
    width: '100%'
  },
  header: {
    marginTop: 0,
    paddingTop: 0,
    justifyContent:'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'pink',
  },
  list: {
    paddingBottom: 100,
  },
  card: {
    backgroundColor: 'pink',
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
    padding: 10,
  },
  title: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    marginTop: 2,
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
    backgroundColor: 'pink',
    borderRadius: 12,
    padding: 20,
  },
  modalImage: {
    width: 'auto',
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
    borderColor: '#C71585',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    color: 'pink',
  },
});