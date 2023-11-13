import React from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

const TextField = ({ style, placeholder, value, onChange }) => {
    return (
      <TextInput
        style={[styles.input, style]}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  };
  
  const styles = StyleSheet.create({
    input: {
      height: 40,
    //   borderColor: 'green',
      paddingLeft: 10,
      margin: 10,
      borderBottomWidth: 2,
      borderBottomColor: '#e5e5e5',
      color: '#f2f2f2',
      borderStyle: 'solid',
      // outline: 'none',
    },
  });

export default TextField;
