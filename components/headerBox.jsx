import { StyleSheet, Text, View } from 'react-native';

const HeaderBox = () => {
    return (
      <View style={styles.headerContainer}>
        <View style={styles.headerFlex}>
          <View style={styles.helloContainer}>
            <View style={styles.helloFlex}>
                <Text style={styles.helloTextH}>Hi,</Text>
                <Text style={styles.helloTextP}>Mira</Text>
            </View>
          </View>
          <View style={styles.helloContainer}>
            <View style={styles.helloFlex}>
                <Text style={styles.helloTextH}>I Love,</Text>
                <Text style={styles.helloTextP}>Mira</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'blue',
        width: '100%',
        height: 100,
    },

    headerFlex:{
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
    },

    helloContainer: {
        backgroundColor: 'red',
        height: 80,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },

    helloFlex: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
    },

    helloTextH: {
        fontSize: 30,
        fontWeight: 'bold',
    },

    helloTextP: {
        fontSize: 20,
        fontWeight: 'bold',
    },
  });

  export default HeaderBox;