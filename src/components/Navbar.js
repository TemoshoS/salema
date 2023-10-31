import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = () => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();            //return to previous screen
  };

  return (
    <View style={styles.container}>

      <TouchableOpacity onPress={handleBackPress}>
      
        <Text style={styles.backButton}>            
        {' < '} 
        {"Back"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.title}>name of screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 40,
    backgroundColor: '#f8f8f8',
    justifyContent: "space-around", //space evenly
    alignItems: "center",
    flexDirection: "row",
    // flex: 1,
    width: "100%",
  },
  backButton: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#6ECC5E',
    marginLeft: 0,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default Navbar;