import React from "react";
import { Text, View, StyleSheet, Pressable } from "react-native";
import { Chip } from "@rneui/themed"; //using react native elements

const ChipButton = ({ title, onPress, altText }) => {
  return (
    <View style={styles.container}>
      <>
      
        <Chip
          style={styles.chip}
          title={
            <Text
              style={styles.chipText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
            
              {title}                   
            </Text>
          }
          onPress={onPress}
          type="outline"                    // currently our our default style (outline)
          accessibilityLabel={altText}      //for accessibility purposes (screen reader)
        />
      </>
    </View>
  );
};

// Button styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 12,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 28,
    borderRadius: 25,
    backgroundColor: "transparent",
    borderWidth: 2,

    // Any Text inside Chip
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  chip: {
    width: 120,
    height: "auto",
  },
  chipText: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    // color: "white",
  },
});

export default ChipButton;
