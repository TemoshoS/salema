import React, {useEffect, useState} from "react";
import { View, StyleSheet, Text, Image, Button, TouchableOpacity,Modal, ScrollView } from "react-native";
import ChipButton from "../components/Chip";
import { getContacts, updateContact, removeContact } from "../services/homeServices";



 

const HomeScreen = () => {

  const [contacts, setContacts] = useState([]);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    async function fetchContacts() {
      try {
        const data = await getContacts();
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    }

    fetchContacts();
  }, []);

  const showContactDetails = (contact) => {
    setSelectedContact(contact);
    setConfirmationVisible(true);
  };
  
   // Function to hide the confirmation modal
   const hideConfimation = () => {
    setConfirmationVisible(false);
  };

  return (
    <ScrollView contentContainerStyle ={styles.container}>
      <Image
        source={require("/assets/union.png")}
        style={styles.logoImg}
        accessibilityLabel="logo image"
      />
      <Text>Your safety is just a shake away</Text>
      {/* Staus image */}

      <View style={styles.textContent}>
        <Image
          source={require("/assets/Vector.png")}
          style={styles.signalImg}
          accessibilityLabel="status signalimage"
        />
        <Text style={styles.title}>"Shake to Alert"</Text>
        <Text style={styles.text}>
          In an emergency, every second counts, just give your phone a quick
          shake to send out an alert to your chosen contacts
        </Text>
      </View>

      {/* Backkground Image */}
      <Image
        source={require("/assets/undraw_different_love_a-3-rg 1.png")}
        style={styles.BgImage}
        accessibilityLabel="status signalimage"
      />

      {/* CONTACT LIST CARD */}
      <View style={styles.cardContainer}>
        <Text style={styles.title}>Trusted Contacts</Text>
        <View style={styles.contactCard}>
          <View style={styles.contactList}>
          {contacts ? (
          contacts.map((contact, index) => (
            <View key={index}>
            <ChipButton
              key={index}
              title={contact.name}
              onPress={() => showContactDetails(contact)}
            />
            </View>
          ))
        ) : (
          <Text>No contacts available</Text>
        )}
          </View>
          <Button title="Add Contact" onPress={() => {}} />
        </View>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={isConfirmationVisible}
        onRequestClose={hideConfimation}
      >
        <View style={styles.confirmationModal}>
          {selectedContact ? (
            <View>
              <Text style={styles.confirmTxt}>Name: {selectedContact.name}</Text>
              <Text style={styles.confirmTxt}>Phone Number: {selectedContact.phoneNumber}</Text>
            </View>
          ) : (
            <Text>No contact selected</Text>
          )}
          <TouchableOpacity onPress={hideConfimation}>
            <Text style={styles.confirmTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
     
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    flexDirection: "column",
    padding: 8,
  },
  bottom: {
    bottom: 0,
    // backgroundColor: "#062817",
  },
  logoImg: {
    // flex: 1,
    width: 100,
    height: 24,
    marginTop: 24,
    resizeMode: "contain",
    // marginVertical: 20,
  },
  BgImage: {
    width: 180,
    height: 200,
    // marginTop: -140,
    resizeMode: "cover",
    // marginVertical: 20,
  },
  signalImg: {
    width: 80,
    height: 80,
    resizeMode: "cover",
    // marging: 16,
    marginVertical: 20,
  },
  bottomTab: {
    bottom: 0,
    justifyContent: "flex-end",
  },
  textContent: {
    paddingHorizontal: 0,
    wordWrap: "break-word",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    columnGap: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    // color: "#f2f2f2",
  },
  text: {
    // fontSize: 14,
    fontWeight: "normal",
    marginVertical: 5,
    textAlign: "center",
    paddingHorizontal: 12,
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // position: "absolute",
    bottom: -20,
    // marginHorizontal: 8,
  },
  contactCard: {
    width: "100%",
    position: "absolute",
    flexDirection: "column",
    flexWrap: "wrap",
    // justifyContent: "space-between",
    zIndex: 1, //above screen contents
    borderRadius: 20,
    // backgroundColor: '#fff',
    backgroundColor: "#055a2b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    //
    gap: 16,
  },
  contactList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  confirmationModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'green',
    height: '20%',
    width: '90%',
  },
  confirmTxt: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
});

export default HomeScreen;
