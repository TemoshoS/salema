import React, { useState } from "react";
import { View, StyleSheet, Image, Pressable } from "react-native";
import InactiveImg from "../../assets/Inactive.png";           
import ActivatingImg from "../../assets/Activating.png";       
import ActiveImg from "../../assets/Vector.png";               

const ShakeFeedback = () => {
  const [isTouched, setIsTouched] = useState(false);

  const handleTouch = () => {
    setIsTouched(!isTouched);
  };

  return (
    <Pressable onPress={handleTouch}>
      <View style={styles.container}>
        <Image
          source={isTouched ? ActiveImg : InactiveImg} // Corrected source objects
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#ff4a4a",
    borderRadius: 100,
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
  },
});

export default ShakeFeedback;
