import React from 'react';
import { View, Image, Dimensions, StyleSheet } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const data = [
  { id: 1, img: 'https://res.cloudinary.com/dpvcu9q88/image/upload/v1746838071/Beige_and_Photo-centric_with_Minimalist_Playful_Style_Photo_Collage_Memorie_20250510_084339_0000_j53nin.png' },
  { id: 2, img: 'https://res.cloudinary.com/dpvcu9q88/image/upload/v1746838072/Beige_and_Photo-centric_with_Minimalist_Playful_Style_Photo_Collage_Memorie_20250510_084339_0001_dguqqx.png' },
  { id: 3, img: 'https://res.cloudinary.com/dpvcu9q88/image/upload/v1746838119/Beige_and_Photo-centric_with_Minimalist_Playful_Style_Photo_Collage_Memorie_20250510_084339_0002_vhscze.png' },
  { id: 4, img: 'https://res.cloudinary.com/dpvcu9q88/image/upload/v1746838071/Beige_and_Photo-centric_with_Minimalist_Playful_Style_Photo_Collage_Memorie_20250510_084339_0004_zcbold.png' },
  { id: 5, img: 'https://res.cloudinary.com/dpvcu9q88/image/upload/v1746838071/Beige_and_Photo-centric_with_Minimalist_Playful_Style_Photo_Collage_Memorie_20250510_084339_0005_azmkcw.png' },
  { id: 6, img: 'https://res.cloudinary.com/dpvcu9q88/image/upload/v1746838071/Beige_and_Photo-centric_with_Minimalist_Playful_Style_Photo_Collage_Memorie_20250510_084339_0003_jcfukl.png' },
  { id: 7, img: 'https://res.cloudinary.com/dpvcu9q88/image/upload/v1746843530/Beige_and_Photo-centric_with_Minimalist_Playful_Style_Photo_Collage_Memorie_20250510_101643_0000_uht9hw.png' },
];

export default function CanvaLayout() {
  return (
    <View style={styles.container}>
      <Carousel
        loop
        width={width}
        height={height}
        autoPlay={true}
        autoPlayInterval={6000}
        scrollAnimationDuration={1000}
        data={data}
        renderItem={({ item, animationValue }) => {
          // Animated style yang mengontrol transisi
          const animatedStyle = useAnimatedStyle(() => {
            const scale = interpolate(
              animationValue.value,
              [-1, 0, 1],
              [0.85, 1, 0.85],
              Extrapolate.CLAMP
            );
            const opacity = interpolate(
              animationValue.value,
              [-1, 0, 1],
              [0.5, 1, 0.5],
              Extrapolate.CLAMP
            );
            return {
              transform: [{ scale }],
              opacity,
            };
          });

          return (
            <Animated.View style={[styles.slide, animatedStyle]}>
              <Image
                source={{ uri: item.img }}
                style={styles.image}
                resizeMode="contain"
              />
            </Animated.View>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ede7e1',
  },
  slide: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
