import { StatusBar, StyleSheet, Text, View } from 'react-native';
import HeaderBox from './components/headerBox';

export default function App() {
  return (
    <View style={styles.section}>
      <View style={styles.sectionFlex}>
      <HeaderBox />
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
