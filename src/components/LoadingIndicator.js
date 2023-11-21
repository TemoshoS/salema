import React, { useState, useEffect } from "react";
import { View, Image, Text, StyleSheet, Animated } from "react-native";

const LoadingIndicator = ({ text }) => {
  const [rotation] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1000,
        easing: Animated.Easing.linear,
      })
    ).start();
  }, []);
  // ANIMATION Rotation style
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View style={styles.container}>
      {/* Image indicator eg. loading Icon or salema logo */}
      <Animated.Image
        source={require("../../assets/main_icon.png")}
        style={{
          width: 100,
          height: 100,
          transform: [{ rotate: spin }],
        }}
      />
      {/* Text indicator eg. fetching Contacs List */}
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    marginTop: 20,
  },
});

export default LoadingIndicator;
