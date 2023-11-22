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
          type="outline" // currently our our default style (outline)
          accessibilityLabel={altText} //for accessibility purposes (screen reader)
        />
      </>
    </View>
  );
};

// Button styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    // marginHorizontal: 8,     // will use gap instead
    position: "relative",
    alignItems: "stretch",
    
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 25,
    backgroundColor: "transparent",
    borderWidth: 2,
    position: "relative",
    // Any Text inside Chip
    fontSize: 12,
    // lineHeight: 16,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  chip: {
    display: "flex",
    // width: 140,
    height: "auto",
    position: "relative",
    borderColor: "#f2f2f2",
  },
  chipText: {
    fontSize: 12,
    // lineHeight: 16,
    fontWeight: "normal",
    letterSpacing: 0.25,
    color: "white",
    textTransform: "capitalize",    //capitalize first letter of the name
  },
});

export default ChipButton;
