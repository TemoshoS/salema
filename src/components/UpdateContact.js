import React from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import Button from './Button';
const UpdateContact = () => {
  const handleButtonPress = (text) => {
    // Define your button press logic here
    console.log(`Button pressed: ${text}`);
  };
  return (
    <View style={styles.container}>
      <Image
        source={require('/assets/Union.png')}
        style={styles.logoImg}
        accessibilityLabel="logo image"
      />
      <Text style={styles.textContent}>Your safety is just a shake away</Text>
      <Image
  source={require('/assets/main_icon.png')}
  style={styles.mainIcon}
  accessibilityLabel="main icon image"
/>
      <View style={styles.card}>
        <Text style={styles.cardText}>Edit Contact</Text>
        <TextInput
          style={styles.input}
          placeholder="Name"
        />
        <TextInput
          style={styles.input}
          placeholder="Number"
        />
        {/* REPLACE HARDCODED CONTACTS WITH REALTIME CONTACTS FROM DB (CHIPS) */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress("Sipho Nkosi")}>
            <Text style={styles.buttonText}>Sipho Nkosi</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress("Thandiswe Ndlamini")}>
            <Text style={styles.buttonText}>Thandiswe Ndlamini</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress("Kgosi Moshele")}>
            <Text style={styles.buttonText}>Kgosi Moshele</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.mainButton} onPress={() => handleButtonPress("UPDATE")}>
          <Text style={styles.mainButtonText}>UPDATE</Text>
        </TouchableOpacity>
      </View>
      {/* Add more separation */}
      <View style={{ height: 10 }} />

      {/* Second card */}
      <View style={styles.card}>
        <Text style={styles.cardText2}>Trusted Contacts</Text>
        <View style={styles.buttonContainer2}>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress("Button 1")}>
            <Text style={styles.buttonText}>Nomvula Mabaso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => handleButtonPress("Button 2")}>
            <Text style={styles.buttonText}>Sipho Nkosi</Text>
          </TouchableOpacity>
       {/* --------------------------------------------------------------------------------- */}
        </View>
        {/* uPDATED bUTTON WITH COMPONENT BTN */}
        <Button title={"Update"} onPress={handleButtonPress} altText={"Update Info"} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImg: {
    width: 100,
    height: 30,
    marginTop: 20,
  },
  mainIcon: {
    width: 60,
    height: 50,
    marginTop: 10,
  },
  textContent: {
    fontWeight: 'bold',
  },
  card: {
    width: 373,
    height: 327,
    padding: 30,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#002E15',
  },
  cardText: {
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
  },
  cardText2:{
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: 'center',
    color: 'white',
    fontSize: 30,
    marginTop: -50,
  },
  input: {
    width: 350,
    height: 40,
    borderBottomWidth: 1,
    borderColor: 'white',
    color: 'white',
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  buttonContainer2: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    backgroundColor:'#125127'
  },
  button: {
    backgroundColor: '#002E15',
    padding: 10,
    borderRadius: 10,
    borderColor: 'white',
    borderWidth: 1,
  },
  buttonText: {
    color: 'white',
  },
  mainButton: {
    width: 333,
    height: 42,
    padding: 8,
    paddingHorizontal: 22,
    borderRadius: 40,
    backgroundColor: '#C8FFD7',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'black',
    marginTop: 15,
  },
  mainButtonText: {
    color: 'black',
  },
});
export default UpdateContact;