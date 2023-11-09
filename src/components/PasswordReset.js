import React, { useState } from "react";
import { View, Text, TextInput, Button } from 'react-native';
import { auth } from '../services/firebaseService';
import { sendPasswordResetEmail } from 'firebase/auth';

const PasswordReset = () => {
    // State to store the user's email and a message to display to the user
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    // Function to send a password reset email
    const resetPassword = () => {
        sendPasswordResetEmail(auth, email)
            .then(() => {
                // If the email was sent successfully, set a success message
                setMessage('Password reset email sent. Check your email.');
            })
            .catch((error) => {
                // Handle different error cases
                if (error.code === 'auth/user-not-found') {
                    setMessage('User with this email does not exist.');
                } else {
                    setMessage('An error occurred. Please try again later.');
                }
            });
    };

  return (
    <View>
      <Text>Password Reset</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      <Button title="Reset Password" onPress={resetPassword} />
      {message && <Text>{message}</Text>}
    </View>
  );
};

export default PasswordReset;
