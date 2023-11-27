import React, { useState } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";

export default function InputText({
  value,
  onChangeText,
  placeholder,
  // placeholderTextColor,
  label,
  secureTextEntry,
}) {
  // check if the user is placing input
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
        ]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder={placeholder}
          placeholderTextColor="#ffffff4d"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    maxWidth: 340,
    display: "flex",
    minHeight: 40,
    borderBottomWidth: 1,
    borderColor: "white",
    color: "white",
    fontSize: 15,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: 320,
    borderBottomWidth: 0.8,
    borderColor: "white",
    // backgroundColor: "#ffffff4d", // Adjust the opacity here
    color: "#f2f2f2",
    marginBottom: 8,
  },
  inputFocused: {
    borderColor: "transparent",
  },
  label: {
    color: "white",
    fontSize: 12,
    marginBottom: 4,
  },
});
