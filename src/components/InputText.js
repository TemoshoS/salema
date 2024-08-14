import React, { useState, forwardRef } from "react";
import { StyleSheet, TextInput, View, Text } from "react-native";

const InputText = forwardRef(({
  value,
  onChangeText,
  placeholder,
  label,
  secureTextEntry,
  onSubmitEditing,
  returnKeyType,
}, ref) => {
  // Check if the user is focusing on input
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
          ref={ref}
          value={value}
          onChangeText={onChangeText}
          style={[styles.input, isFocused && styles.inputFocused]}
          placeholder={placeholder}
          placeholderTextColor="#ffffff4d"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={secureTextEntry}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
        />
      </View>
    </View>
  );
});

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

export default InputText;
