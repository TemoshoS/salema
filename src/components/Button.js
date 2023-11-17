import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

export default function Button({ title, onPress, altText, color }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed ? "#709b7b" : "#C8FFD7",
          },
        ]}
        onPress={onPress}
        accessibilityLabel={altText}
      >
        <Text style={styles.buttonText}>{title}</Text>
      </Pressable>
    </View>
  );
}

// Button styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginHorizontal: 6,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 100,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: 48,
    marginVertical: 16,
  },
  buttonText: {
    color: "#00240a",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  
});
