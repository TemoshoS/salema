import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Card = ({ title, title2, content, imageUri }) => {
  return (
    <View style={styles.card}>
      {/* <Image source={image} style={styles.image} resizeMode="cover" /> */}
      <Image uri={imageUri} style={styles.image} resizeMode="cover" />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.title2}>{title2}</Text>
        <Text style={styles.contentText}>{content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    // backgroundColor: '#fff',
    backgroundColor: '#002E15',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    
  },
  image: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  content: {
    padding: 12,
    // Text color
    color: "#f2f2f2",
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 5,
    color: "#f2f2f2",
  },
  title2: {
    fontSize: 20,
    marginBottom: 5,
    color: "#f2f2f2",
  },
  contentText: {
    fontSize: 12,
    color: "#f2f2f2",
  },
});

export default Card;
