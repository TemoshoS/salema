import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';

export default function Button({ title, onPress, altText, color }) {
  return (
    <View style={styles.container}>
      <Pressable
        color={color}
        title={title} //prop title for button title
        onPress={onPress} //prop function for onPress
        accessibilityLabel={altText} //for accessibility purposes (screen reader)
      />
    </View>
  );
}

// Button styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  button: {
    
  }
});
