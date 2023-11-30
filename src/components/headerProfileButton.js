//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,TouchableOpacity,Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// create a component
const HeaderProfileButton = ({navigation}) => {

    return (
        <TouchableOpacity
        style={styles.avatar}
        onPress={() => navigation.navigate("ProfileScreen")}
      >
        <Image
          source={require("../../assets/profile.png")}
          style={styles.profileicon}
        />
      </TouchableOpacity>
    );
};

// define your styles
const styles = StyleSheet.create({
    
    avatar:{
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
    }
    
});

//make this component available to the app
export default HeaderProfileButton;
