import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, Image, Button, TouchableOpacity, Modal, ScrollView, TextInput } from "react-native";
import ChipButton from "../components/ChipButton";
import { getContacts, addContact, updateContact, removeContact } from "../services/homeServices";
import { getAuth, onAuthStateChanged } from "@firebase/auth";



const HomeScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddContactModalVisible, setAddContactModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newContactData, setNewContactData] = useState({
    name: '',
    phoneNumber: '',
    relationship: '',
  })
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedContactData, setUpdatedContactData] = useState({
    name: "",
    phoneNumber: "",
    relationship: '',
  });

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);

      } else {
        setCurrentUser(null);
        setContacts([]);
      }
    })



    fetchContacts();
    return unsubscribe;
  }, [currentUser]);

  const fetchContacts = async () => {
    try {
      if (currentUser) {
        const data = await getContacts();
        setContacts(data);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  }



  const filteredContacts = contacts.filter((contact) => contact.userId === currentUser);


  const showContactDetails = (contact) => {
    setSelectedContact(contact);
    setUpdatedContactData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
    });
    setConfirmationVisible(true);
  };

  //function to add new contact

  const showAddContactModal = () => {
    setNewContactData({
      name: '',
      phoneNumber: '',
      relationship: '',
    });

    setAddContactModalVisible(true);
  }

  const hideAddContactModal = () => {
    setAddContactModalVisible(false);
  };


  const handleAddContact = async () => {
    try {
      if (!currentUser) {
        console.error('No user is signed in. Cannot add contact without a user.');
        return;
      }

      const contactWithUserId = { ...newContactData, userId: currentUser };

      await addContact(contactWithUserId);
      fetchContacts();
      hideAddContactModal();
    } catch (error) {
      console.error('Error adding contact: ', error);
    }
  };


  //function to update contact
  const showUpdateModal = () => {
    setUpdateModalVisible(true);
  }

  const hideUpdateModal = () => {
    setUpdateModalVisible(false);
  }

  const handleUpdateContact = async () => {
    try {
      if (!selectedContact) {
        console.error('No contact selected for update');
        return;
      }

      if (!selectedContact.id) {
        console.error('Selected contact has no valid ID');
        return;
      }

      if (!updatedContactData) {
        console.error('No updated data provided');
        return;
      }

      await updateContact(selectedContact.id, updatedContactData);
      fetchContacts();
      hideUpdateModal();
      setConfirmationVisible(false);

    } catch (error) {
      console.error('Error updating contact: ', error);
    }
  };


  const selectContactForUpdate = (contact) => {
    setUpdatedContactData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
    });
    setIsEditing(true);
  };

  //Function to remove contact
  const handleRemoveContact = async (contactId) => {
    try {
      await removeContact(contactId);
      fetchContacts();
      hideConfirmation();
    } catch (error) {
      console.error("Error removing contact: ", error);
    }
  };


  // Function to hide the confirmation modal
  const hideConfirmation = () => {
    setConfirmationVisible(false);
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("/assets/Union.png")}
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
            {filteredContacts ? (
              filteredContacts.map((contact, index) => (
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
          <Button title="Add Contact" onPress={showAddContactModal} />

        </View>
      </View>

      {/* Add contact modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isAddContactModalVisible}
        onRequestClose={hideAddContactModal}
      >
        <View style={styles.addContactModal}>
          <Text>Add New Contact</Text>
          <TextInput
            placeholder="Name"
            value={newContactData.name}
            onChangeText={(text) => setNewContactData({ ...newContactData, name: text })}

          />

          <TextInput
            placeholder="Phone Number"
            value={newContactData.phoneNumber}
            onChangeText={(text) =>
              setNewContactData({ ...newContactData, phoneNumber: text })
            }

          />

          <TextInput
            placeholder="Relationship"
            value={newContactData.relationship}
            onChangeText={(text) =>
              setNewContactData({ ...newContactData, relationship: text })
            }
          />
          <Button
            title="Add Contact"
            onPress={handleAddContact}
          />
          <Button
            title="Cancel"
            onPress={hideAddContactModal}
          />

        </View>


      </Modal>


      {/* Display modal */}

      <Modal
        animationType="slide"
        transparent={false}
        visible={isConfirmationVisible}
        onRequestClose={hideConfirmation}
      >
        <View style={styles.confirmationModal}>
          {selectedContact ? (
            <View>
              <Text>Trusted Contacts</Text>
              <Text style={styles.confirmTxt}>{selectedContact.name}</Text>
              <Text style={styles.confirmTxt}>{selectedContact.phoneNumber}</Text>

              <TouchableOpacity onPress={showUpdateModal}
              >
                <Text>Update contact</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => handleRemoveContact(selectedContact.id)}>
                <Text>Remove contact</Text>
              </TouchableOpacity>

            </View>
          ) : (
            <Text>No contact selected</Text>
          )}
          <TouchableOpacity onPress={hideConfirmation}>
            <Text style={styles.confirmTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Update Modal*/}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isUpdateModalVisible}
        onRequestClose={hideUpdateModal}
      >
        <View style={styles.confirmationModal}>


          {selectedContact && (
            <View>
              <TextInput
                placeholder="Name"
                value={updatedContactData.name}
                onChangeText={(text) =>
                  setUpdatedContactData({ ...updatedContactData, name: text })
                }
              />

              <TextInput
                placeholder="Phone Number"
                value={updatedContactData.phoneNumber}
                onChangeText={(text) =>
                  setUpdatedContactData({ ...updatedContactData, phoneNumber: text })
                }
              />

              <TextInput
                placeholder="Relationship"
                value={updatedContactData.relationship}
                onChangeText={(text) =>
                  setUpdatedContactData({ ...updatedContactData, relationship: text })
                }
              />
              <ScrollView style={{ maxHeight: 200, marginBottom: 10 }}>
                {filteredContacts ? (
                  filteredContacts.map((contact, index) => (
                    <TouchableOpacity
                      key={index}

                    >
                      <View>
                        <ChipButton
                          key={index}
                          title={contact.name}
                          onPress={() => selectContactForUpdate(contact)}
                          style={{
                            backgroundColor:
                              selectedContact?.id === contact.id ? 'lightgray' : 'transparent',
                          }}
                        />
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text>No contacts available</Text>
                )}
              </ScrollView>

              <Button title="Update" onPress={handleUpdateContact} />
              <Button title="Cancel" onPress={hideUpdateModal} />
            </View>
          )}
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
    //above screen contents
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
