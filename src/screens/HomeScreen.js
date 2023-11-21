import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import ChipButton from "../components/ChipButton";
import {
  getContacts,
  addContact,
  updateContact,
  removeContact,
} from "../services/homeServices";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import ShakeTrigger from "../services/ShakeTrigger";
<<<<<<< HEAD

//import {ShakeTrigger} from '../services/ShakeTrigger';
=======
>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d
import TextField from "../components/TextField";
import Button from "../components/Button";
import Button2 from "../components/Button2";
import ShakeFeedback from "../components/ShakeFeedback";
import InputText from "../components/InputText";
<<<<<<< HEAD
import {
  requestForegroundPermissionsAsync,
  getCurrentPositionAsync,
} from "expo-location";
import { Linking } from "react-native";
import { Divider } from "@rneui/base";
=======



>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d

const HomeScreen = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [userLocationMessage, setUserLocationMessage] = useState("");
  const [contacts, setContacts] = useState([]);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddContactModalVisible, setAddContactModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [relationshipError, setRelationshipError] = useState(null);
  const [isShakeDetected, setIsShakeDetected] = useState(false);

  const [newContactData, setNewContactData] = useState({
    name: "",
    phoneNumber: "",
    relationship: "",
  });
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [updatedContactData, setUpdatedContactData] = useState({
    name: "",
    phoneNumber: "",
    relationship: "",
  });


  useEffect(() => {
<<<<<<< HEAD
    const getLocationPermission = async () => {
      const { status } = await requestForegroundPermissionsAsync();
      if (status === "granted") {
        const location = await getCurrentPositionAsync({});
        setUserLocation(location.coords);
        const message = `https://www.google.com/maps/?q=${location.coords.latitude},${location.coords.longitude}`;
        setUserLocationMessage(message);
      }
    };
=======
>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d

    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user.uid);
        getLocationPermission();
      } else {
        setCurrentUser(null);
        setContacts([]);
      }
    });

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
  };

  const filteredContacts = contacts.filter(
    (contact) => contact.userId === currentUser
  );

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
      name: "",
      phoneNumber: "",
      relationship: "",
    });

    setAddContactModalVisible(true);
  };

  const hideAddContactModal = () => {
    setAddContactModalVisible(false);
  };

  const handleAddContact = async () => {
    try {
      if (!currentUser) {
        // Alert user to sign in or create an acoount to see contact list
        Alert.alert(
          "Not Signed In",
          "Please sign in or register to add a contact.",
          [
            {
              text: "OK",
              onPress: () => {
                // Time the warning message before redirecting the user
                setTimeout(() => {
                  navigation.navigate("Splash"); //navigate to the screen where they can sign in
                }, 2000); // Delay for 2 seconds (2k is in mili sec)
              },
            },
          ]
        );

        return;
      }

      if (!newContactData.name) {
        setNameError("Please enter Name");
        return;
      } else {
        setNameError(null);
      }

      if (!newContactData.phoneNumber) {
        setPhoneError("Please enter Phone number");
        return;
      } else {
        setPhoneError(null);
      }
      if (!newContactData.relationship) {
        setRelationshipError("Please enter Relationship");
        return;
      } else {
        setRelationshipError(null);
      }

      const contactWithUserId = { ...newContactData, userId: currentUser };

      await addContact(contactWithUserId);
      fetchContacts();
      hideAddContactModal();
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };

  //function to update contact
  const showUpdateModal = () => {
    setUpdateModalVisible(true);
  };

  const hideUpdateModal = () => {
    setUpdateModalVisible(false);
  };

  const handleUpdateContact = async () => {
    try {
      if (!selectedContact) {
        console.error("No contact selected for update");
        return;
      }

      if (!selectedContact.id) {
        console.error("Selected contact has no valid ID");
        return;
      }

      if (!updatedContactData) {
        console.error("No updated data provided");
        return;
      }

      await updateContact(selectedContact.id, updatedContactData);
      fetchContacts();
      hideUpdateModal();
      setConfirmationVisible(false);
    } catch (error) {
      console.error("Error updating contact: ", error);
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
<<<<<<< HEAD

  //
  const handleShake = (shakeDetected) => {
    setIsShakeDetected(shakeDetected);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
=======


  return (
    <ScrollView contentContainerStyle={styles.container}>

>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d
      <Image
        source={require("../../assets/Union.png")}
        style={styles.logoImg}
        accessibilityLabel="logo image"
      />
      <Text>Your safety is just a shake away</Text>
      {/* Staus image */}
      {/* <ShakeTrigger onShake={(isShakeDetected)=>setIsShakeDetected(isShakeDetected)}/> */}
      <View style={styles.textContent}>
        <ShakeFeedback />
        {/* Display user's location */}
<<<<<<< HEAD
        {userLocation && (
          <View style={styles.userLocationContainer}>
            <Text style={styles.userLocationText}>Your Current Location:</Text>
            <Text style={styles.userLocationText}>
              Latitude: {userLocation.latitude}
            </Text>
            <Text style={styles.userLocationText}>
              Longitude: {userLocation.longitude}
            </Text>

            <TouchableOpacity
              onPress={() => Linking.openURL(userLocationMessage)}
            >
              <Text style={styles.linkText}>{userLocationMessage}</Text>
            </TouchableOpacity>
          </View>
        )}
=======
       
>>>>>>> 08fa1f66249ae1f9062deed5c55ed170310de87d

        <Text style={styles.title}>"Shake to Alert"</Text>
        <Text style={styles.text}>
          In an emergency, every second counts, just give your phone a quick
          shake to send out an alert to your chosen contacts
        </Text>
      </View>

      {/* Backkground Image */}
      <Image
        source={require("../../assets/undraw.png")}
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
          <Button
            title={"Add Contact"}
            onPress={showAddContactModal}
            altText={"Add Contact"}
          />
        </View>
      </View>

      {/* Add New Contact modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isAddContactModalVisible}
        onRequestClose={hideAddContactModal}
      >
        {/* must be converted to ra relevant component */}
        <View style={styles.overlay}></View>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Add New Contact</Text>

          <InputText
            style={styles.input}
            placeholder="Name"
            value={newContactData.name}
            onChangeText={(text) =>
              setNewContactData({ ...newContactData, name: text })
            }
          />

          {nameError && <Text style={styles.errorText}>{nameError}</Text>}
          <InputText
            style={styles.input}
            placeholder="Phone Number"
            value={newContactData.phoneNumber}
            onChangeText={(text) =>
              setNewContactData({ ...newContactData, phoneNumber: text })
            }
          />
          {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
          <InputText
            style={styles.input}
            placeholder="Relationship"
            value={newContactData.relationship}
            onChangeText={(text) =>
              setNewContactData({ ...newContactData, relationship: text })
            }
          />
          {relationshipError && (
            <Text style={styles.errorText}>{relationshipError}</Text>
          )}
          <View style={styles.buttonGroup}>
            <Button
              title="Add Contact"
              onPress={handleAddContact}
              altText="Add Contact"
            />
            {/* <Button2
              title="Add Contact"
              onPress={handleAddContact}
              altText="Add Contact"
            />
            <Button2
            style={styles.cancelBtn}
              title="Cancel"
              onPress={hideAddContactModal}
              altText="Cancel"
            /> */}
          </View>
        </View>
      </Modal>

      {/* Display Contacts Modal */}

      <Modal
        animationType="slide"
        transparent={false}
        visible={isConfirmationVisible}
        onRequestClose={hideConfirmation}
      >
        <View style={styles.modalCard}>
          {selectedContact ? (
            <View style={styles.textContent}>
              {/* <Text style={styles.title}>Trusted Contacts</Text> */}
              <Text style={styles.title}>{selectedContact.name}</Text>
              <Text style={styles.text}>{selectedContact.phoneNumber}</Text>
              <br></br>
              <View style={styles.buttonGroup}>
                <Button2
                  title="Update Contact"
                  onPress={showUpdateModal}
                  altText="Update Contact"
                  textColor={"#f2f2f2"}
                />
                <Button2
                  title="Remove Contact"
                  onPress={() => handleRemoveContact(selectedContact.id)}
                  altText="Remove Contact"
                  textColor={"#ff2323"}
                />
              </View>
            </View>
          ) : (
            <Text style={{ color: "#ff2323", textAlign: "left" }}>
              No contact selected
            </Text>
          )}
          {/* <TouchableOpacity onPress={hideConfirmation}>
            <Text style={styles.confirmTxt}>Close</Text>
          </TouchableOpacity> */}
        </View>
      </Modal>

      {/* Edit/Update Contacts Modal*/}
      <Modal
        animationType="slide"
        transparent={false}
        visible={isUpdateModalVisible}
        onRequestClose={hideUpdateModal}
      >
        <View style={styles.overlay}></View>
        <View style={styles.modalCard}>
          <Text style={styles.title}>Edit Contact</Text>
          {selectedContact && (
            <View style={styles.textContent}>
              <InputText
                style={styles.input}
                placeholder="Name"
                value={updatedContactData.name}
                onChangeText={(text) =>
                  setUpdatedContactData({ ...updatedContactData, name: text })
                }
              />
              <br />
              <InputText
                style={styles.input}
                placeholder="Phone Number"
                value={updatedContactData.phoneNumber}
                onChangeText={(text) =>
                  setUpdatedContactData({
                    ...updatedContactData,
                    phoneNumber: text,
                  })
                }
              />
              <br />
              <InputText
                style={styles.input}
                placeholder="Relationship"
                value={updatedContactData.relationship}
                onChangeText={(text) =>
                  setUpdatedContactData({
                    ...updatedContactData,
                    relationship: text,
                  })
                }
              />

              <br />
              {/* list available contacts */}
              <ScrollView>
                <View style={styles.contactList}>
                  {filteredContacts ? (
                    filteredContacts.map((contact, index) => (
                      <TouchableOpacity key={index}>
                        <ChipButton
                          key={index}
                          title={contact.name}
                          onPress={() => selectContactForUpdate(contact)}
                          style={{
                            backgroundColor:
                              selectedContact?.id === contact.id
                                ? "lightgray"
                                : "transparent",
                          }}
                        />
                      </TouchableOpacity>
                    ))
                  ) : (
                    <Text>No contacts available</Text>
                  )}
                </View>
              </ScrollView>

              <View style={styles.buttonGroup}>
                <Button
                  title="Update"
                  onPress={handleUpdateContact}
                  altText="Update Edit"
                />
              </View>
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
    paddingHorizontal: 8,
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
    width: 60,
    height: 100,
    resizeMode: "cover",
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
    // justifyContent: "flex-end",
  },
  textContent: {
    paddingHorizontal: 0,
    wordWrap: "break-word",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    columnGap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    //marginBottom: 5,
    color: "#f2f2f2",
    textAlign: "center",
    textTransform: "capitalize",
  },
  text: {
    fontSize: 14,
    fontWeight: "normal",
    marginVertical: 5,
    textAlign: "center",
    paddingHorizontal: 16,
    color: "#f2f2f2",
    letterSpacing: 0.5,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  cardContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  contactCard: {
    width: "100%",
    position: "absolute",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "stretch",
    //above screen contents
    borderRadius: 20,
    // backgroundColor: '#fff',
    color: "#f2f2f2",
    backgroundColor: "#055a2b",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2.5 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 180,
    // gap: 24,
  },
  modalCard: {
    padding: 30,
    borderRadius: 16,
    backgroundColor: "#002E15",
    alignItems: "center",
    justifyContent: "center",
    // bottom: 210,
    gap: 20,
    color: "white",
    textColor: "white",
    display: "flex",
    flexDirection: "column",
    alignSelf: "stretch",
    // top: 200,
    position: "relative",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.601)",
  },
  contactList: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 4,
    rowGap: 6,
    justifyContent: "left",
    
  },
  confirmationModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "green",
    height: "20%",
    width: "100%",
    color: "#f2f2f2",
  },
  confirmTxt: {
    color: "white",
    fontSize: 16,
    fontWeight: "normal",
    letterSpacing: 1,
    marginTop: 16,
  },
  buttonGroup: {
    width: "100%",
    flexDirection: "column",
    // flexWrap: "wrap",
    alignItems: "left",
    gap: 8,
    justifyContent: "flex-end",
    color: "#f2f2f2",
    marginTop: 24,
  },
  card: {
    backgroundColor: "#002E15",
    flex: 1,
  },
  formConntent: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 20,
  },
  userLocationContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#002E15",
    borderRadius: 10,
  },
  userLocationText: {
    color: "white",
    fontSize: 16,
  },
  linkText: {
    color: "#14ad00f00",
    textDecorationLine: "underline",
    marginTop: 5,
  },

  // New contact card
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: "#ff1f1f",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "left,",
    minHeight: 52,
    backgroundColor: "#712626",
    width: "100%",
  },
});

export default HomeScreen;
