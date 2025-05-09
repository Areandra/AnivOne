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
  { id: 1, img: require('../assets/m1q2.png') },
  { id: 2, img: require('../assets/m1q2.png') },
  { id: 3, img: require('../assets/m1q2.png') },
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
                source={item.img}
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
    backgroundColor: '#fff',
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
