import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Navbar = ({ navigation, route }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    navigation.goBack();            //return to previous screen
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={handleBackPress}>
        <Image source={require("../../assets/Arrow_Left.png")} style={styles.icon} />
      </TouchableOpacity>
      <Text style={styles.text}>{route.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1", // Adjust as needed
    backgroundColor: "#ffffff", // Adjust as needed
  },
  icon: {
    width: 45,
    height: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default Navbar;