import React from 'react';
import { View, Text, StyleSheet, Image, Button, Alert, Share } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const MissingScreen = () => {
  const handleComment = () => {
    Alert.alert('Comment button pressed');
  };

  const handleShare = async () => {
    try {
      const result = await Share.share({
        message: 'Help find this missing person! Here are the details...',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://example.com/missing-person.jpg' }}
        style={styles.image}
      />
      <Text style={styles.description}>
        John Doe, 34 years old, last seen on July 4th, 2024. Please contact authorities if you have any information.
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Comment" onPress={handleComment} />
        <FontAwesome.Button name="share" backgroundColor="#3b5998" onPress={handleShare}>
          Share
        </FontAwesome.Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default MissingScreen;
