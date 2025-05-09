import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  {
    id: 1,
    uri: 'https://picsum.photos/seed/1/200/300',
    width: width * 0.45,
    height: width * 0.6,
    top: 10,
    left: 10,
    rotate: '-6deg',
  },
  {
    id: 2,
    uri: 'https://picsum.photos/seed/2/200/300',
    width: width * 0.45,
    height: width * 0.6,
    top: 10,
    right: 10,
    rotate: '6deg',
  },
  {
    id: 3,
    uri: 'https://picsum.photos/seed/3/200/300',
    width: width * 0.45,
    height: width * 0.6,
    top: 150,
    left: 10,
    rotate: '-4deg',
  },
  {
    id: 4,
    uri: 'https://picsum.photos/seed/4/200/300',
    width: width * 0.45,
    height: width * 0.6,
    top: 140,
    left: width * 0.55,
    rotate: '7deg',
  },
  {
    id: 5,
    uri: 'https://picsum.photos/seed/5/200/300',
    width: width * 0.45,
    height: width * 0.6,
    top: 310,
    left: 10,
    rotate: '-7deg',
  },
  {
    id: 6,
    uri: 'https://picsum.photos/seed/6/200/300',
    width: width * 0.45,
    height: width * 0.6,
    top: 300,
    left: width * 0.5,
    rotate: '5deg',
  },
  {
    id: 7,
    uri: 'https://picsum.photos/seed/7/200/300',
    width: width * 0.45,
    height: width * 0.6,
    top: 460,
    left: 10,
    rotate: '-5deg',
  },
  {
    id: 8,
    uri: 'https://picsum.photos/seed/8/200/300',
    width: width * 0.45,
    height: width * 0.6,
    top: 460,
    left: width * 0.5,
    rotate: '4deg',
  },
];

// Link gambar bunga PNG transparan
const flowerLeft = 'https://i.ibb.co/SNRhmkV/flower-left.png';
const flowerRight = 'https://i.ibb.co/vvPJXH8/flower-right.png';

export default function CanvaLayout() {
  return (
    <View style={styles.container}>
      {/* Bunga Dekoratif */}
      <Image source={{ uri: flowerLeft }} style={styles.flowerLeft} />
      <Image source={{ uri: flowerRight }} style={styles.flowerRight} />

      {/* Kolase Foto */}
      {images.map((img) => (
      <View
        key={img.id}
          source={{ uri: img.uri }}
          style={
            styles.image,
            {
              width: img.width,
              lenght: img.lenght
              top: img.top,
              ...(img.id % 2 !== 0
              ? { left: img.left }
              : { right: img.right }),
              transform: [{ rotate: img.rotate }],
            },
          ]}
        <Image/>
      </View>
      ))}

      {/* Teks Tengah */}
      <View style={styles.centerTextContainer}>
        <Text style={styles.title}>Memories Collection</Text>
        <Text style={styles.year}>2024</Text>
        <Text style={styles.caption}>
          A Collection of Memories That Capture the Joy of Every Moment
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f6ef',
  },
  image: {
    position: 'absolute',
    width: width * 0.45,
    height: width * 0.6,
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  centerTextContainer: {
    position: 'absolute',
    top: 230,
    left: width * 0.15,
    width: width * 0.7,
    backgroundColor: '#f9f6ef',
    paddingVertical: 10,
    paddingHorizontal: 5,
    alignItems: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 2,
  },
  year: {
    fontSize: 20,
    marginBottom: 4,
  },
  caption: {
    fontSize: 12,
    textAlign: 'center',
    color: '#444',
  },
  flowerLeft: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    zIndex: 5,
  },
  flowerRight: {
    position: 'absolute',
    width: 100,
    height: 100,
    top: 0,
    right: 0,
    zIndex: 5,
  },
});