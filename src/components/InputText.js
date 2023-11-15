import { StyleSheet, TextInput,View } from "react-native";
import React, {useState} from "react";

export default function InputText({ value, onChangeText, placeholder, placeholderTextColor }) {
  // check if user is placing input
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={[styles.input, isFocused && styles.inputFocused]}
        placeholder={placeholder}
        placeholderTextColor={placeholderTextColor}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    width: 350,
    height: 40,
    borderBottomWidth: 1,
    borderColor: "white",
    color: "white",
    bottomBorderColor: "white",
    fontSize: 15,
  },
  inputFocused: {
    borderColor: "transparent",
  },
});
