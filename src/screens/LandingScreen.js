import React, { useEffect, useState, useRef } from "react";

// from home script
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Alert,
  Vibration,
  Keyboard,
} from "react-native";
import ChipButton from "../components/ChipButton";
import {
  getContacts,
  addContact,
  updateContact,
  removeContact,
  initializeAuthState,
} from "../services/homeServices";
import { getAuth, onAuthStateChanged } from "@firebase/auth";
import { NavigationContainer } from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import { ShakeEventExpo } from "../services/ShakeTrigger";
import getLocationPermission from "../services/geolocation";
import { Linking } from "react-native";
import * as Notifications from "expo-notifications";

import Button from "../components/Button";
import Button2 from "../components/Button2";
import ShakeFeedback from "../components/ShakeFeedback";
import InputText from "../components/InputText";

//
import { Platform } from "react-native";
import LoginScreen from "./LoginScreen";
import RegistrationScreen from "./RegistrationScreen";
import ForgotPassword from "./ForgotPassword";

const LandingScreen = ({ navigation, visible }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [updatedContact, setUpdatedContact] = useState("");
  const [removedContact, setRemovedContact] = useState("");
  // from home scrip[t]
  const [currentUser, setCurrentUser] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [isAddContactModalVisible, setAddContactModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nameError, setNameError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [relationshipError, setRelationshipError] = useState(null);
  const [isShakeDetected, setIsShakeDetected] = useState(false);
  const [statusImageSource, setStatusImageSource] = useState(
    require("../../assets/Inactive.png")
  );
  const [noSignedInUserErr, setNoSignedInUserErr] = useState(false);
  const [location, setLocation] = useState(null);
  const [locationModalVisible, setLocationModalVisible] = useState(false);
  const [shakeStatusModalVisible, setShakeStatusModalVisible] = useState(false);
  const [isShakeHandled, setIsShakeHandled] = useState(false);

  const [enablePanDownToClose, setEnablePanDownToClose] = useState(true);

  const [newContactData, setNewContactData] = useState({
    name: "",
    phoneNumber: "",
    relationship: "",
  });
  const [updatedContactData, setUpdatedContactData] = useState({
    name: "",
    phoneNumber: "",
    relationship: "",
  });
  // Modal Management
  const [isUpdateModalVisible, setUpdateModalVisible] = useState(false);
  const [isViewContactModalVisible, setIsViewContactModalVisible] =
    useState(false);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isSignupModalVisible, setSignupModalVisible] = useState(false);
  const [isForgotPassModalVisible, setForgotPassModalVisible] = useState(false);
  const [isNotificationModalVisible, setNotificationModalVisible] =
    useState(false);

  // useEffect(() => {
  //   const auth = getAuth()

  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     if (user) {
  //       setCurrentUser(user.uid)
  //       getLocationPermission()
  //     } else {
  //       setCurrentUser(null)
  //       setContacts([])
  //     }
  //   })

  //   fetchContacts()
  //   return unsubscribe
  // }, [currentUser])

  useEffect(() => {
    console.log(currentUser);
    const initializeAuth = async () => {
      const user = await initializeAuthState();
      if (user) {
      setCurrentUser(user);

        fetchContacts();
      } else {
        setContacts([]);
      }
    };
    initializeAuth();

    const shakeHandler = async () => {
      console.log("Shake detected!");
      const permissionResult = await getLocationPermission();

      if (permissionResult) {
        const newLocation = permissionResult.userLocation;
        setLocation(newLocation);
        setShakeStatusModalVisible(true);
        handleShake(true);
      }
    };

    ShakeEventExpo.addListener(shakeHandler);

    return () => {
      ShakeEventExpo.removeListener(shakeHandler);
    };
  }, [isShakeHandled]);

  // const fetchContacts = async () => {
  //   try {
  //     if (currentUser) {
  //       const data = await getContacts()
  //       setContacts(data)
  //     }
  //   } catch (error) {
  //     console.error('Error fetching contacts:', error)
  //   }
  // }

  // const filteredContacts = contacts.filter(
  //   (contact) => contact.userId === currentUser,
  // )

  // Fetch user's contacts from db
  const fetchContacts = async () => {
    await getContacts(currentUser).then((data) => {
      setContacts(data);
    });
  };

  const showViewContactSheet = (contact) => {
    // setSelectedContact(contact);
    console.log(contact);

    setUpdatedContactData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
    });
    // Show ViewContactModa BottomSheet2
    setIsViewContactModalVisible(true);
  };

  const showUpdateModal = () => {
    setUpdateModalVisible(true);
  };

  // from home
  const showAddContactModal = () => {
    setNewContactData({
      name: "",
      phoneNumber: "",
      relationship: "",
    });
    setAddContactModalVisible(true);
  };
  // disable ADD CONTACT modal
  const hideAddContactModal = () => {
    setAddContactModalVisible(false);
  };
  // Manage user who can add contacts
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
      } else {
        setNoSignedInUserErr(null);
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
      // limit contacts to add
      const existingContacts = await getContacts(currentUser);
      if (existingContacts.length >= 5) {
        console.error("You can only add 5 contacts");
      }

      const contactWithUserId = { ...newContactData, userId: currentUser };
      // record & add contact
      await addContact(contactWithUserId);
      fetchContacts();
      hideAddContactModal();
    } catch (error) {
      console.error("Error adding contact: ", error);
    }
  };
  //Show selected contact info
  const selectContactForUpdate = (contact) => {
    setUpdatedContactData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      relationship: contact.relationship,
    });
    setIsEditing(true);
  };

  // default open modal (do not use)
  const openModal = () => {
    setModalVisible(true);
  };
  //default close modal
  const closeModal = () => {
    setModalVisible(false);
  };
  // UPDATE CONTACT
  const handleUpdateContact = () => {
    // Handle logic for updating contact with the value in updatedContact
    console.log(`Updating contact: ${updatedContact}`);
  };
  // REMOVE CONTACT
  const handleRemoveContact = () => {
    console.log(`Removing contact: ${removedContact}`);
  };

  // Hide the confirmation modal
  const hideConfirmation = () => {
    setConfirmationVisible(false);
  };
  // Hide the Update/Edit modal
  const hideUpdateModal = () => {
    setUpdateModalVisible(false);
  };
  // Hide Login Modal
  const hideLoginModal = () => {
    setLoginModalVisible(false);
  };
  // Hide  Signin Modal
  const hideSignupModal = () => {
    setSignupModalVisible(false);
  };
  // Hide  Forgot/Reset Password  Modal
  const hideForgotPassModal = () => {
    setForgotPassModalVisible(false);
  };
  // Hide  Contact Modal
  const hideViewContactModal = () => {
    setIsViewContactModalVisible(false);
  };
  const hideNotificationModal = () => {
    setIsViewContactModalVisible(false);
  };

  const showLoginModal = () => {
    hideSignupModal();
    setLoginModalVisible(true);
    hideForgotPassModal();
  };

  const showSignupModal = () => {
    hideLoginModal();
    setSignupModalVisible(true);

    hideForgotPassModal();
  };
  const showForgotPassModal = () => {
    hideLoginModal();
    setForgotPassModalVisible(true);

    hideSignupModal();
  };

  // bottom sheet stuff
  // modal  controls
  const handleModalPress = (event) => {
    // Check if the touch event is within the modal content
    if (event.target === event.currentTarget) {
      onClose(); // Close the modal only if the user clicked outside the content
    }
  };

  // Shake and Notification Stuff
  const handleShake = async (shakeDetected) => {
    if (!isShakeHandled) {
      setIsShakeHandled(true); // Set to true to indicate that shake is handled

      if (shakeDetected) {
        // Show location modal
        // setLocationModalVisible(true);
        setNotificationModalVisible(true);

        sendNotification();

        // Set status image to main_icon.png for 5 seconds
        setStatusImageSource(require("../../assets/main_icon.png"));

        // Reset shake detection after 5 seconds
        setTimeout(() => {
          setIsShakeHandled(false); // Reset shake detection
          setStatusImageSource(require("../../assets/Inactive.png"));
          // setLocationModalVisible(false);
          setNotificationModalVisible(false);
        }, 5000);
      } else {
        setStatusImageSource(require("../../assets/Inactive.png"));
        // setLocationModalVisible(false);
        setNotificationModalVisible;
      }
    }
  };

  const sendNotification = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();

      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: "Emergency Alert",
          body: "This is an emergency alert",
        },
        trigger: null,
      });

      console.log("Notification scheduled: ", notificationId);
    } catch (error) {
      console.error("Error sending notification: ", error);
    }
  };

  // RENDER
  return (
    <View style={styles.container}>
      {/* Backhground image */}
      <Image
        source={require("../../assets/Union.png")}
        style={styles.logoImg}
        accessibilityLabel="logo"
      />
      <Text>Your safety is just a shake away</Text>
      {/* Staus image */}
      <TouchableOpacity style={{position:'absolute',top:0,right:0}} onPress={() => navigation.navigate("ProfileScreen")}>
        <Text>Profile</Text>
      </TouchableOpacity>
      <View style={styles.textContent}>
        {/* HERE IS THE STATUS OF THE SHAKE APP {IN USE OR NOT} */}
        <ShakeFeedback />

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
      {/* Buttons are now move to WelcomeScreen */}
      {currentUser == null ?
        <View style={styles.buttonSection}>
        <Button
          style={styles.bgGreen}
          title={"Signup"}
          onPress={showSignupModal}
          altText={"register"}
          color={"#055a2b"}
        />
        <Button
          style={styles.bgGreen}
          title={"Log in"}
          onPress={showLoginModal}
          altText={"Login"}
          color={"#055a2b"}
        /> 

     
      </View>
      :
      <View style={styles.bottomSheet}>
        <View>
          <Text style={styles.trustedContact}>Trusted Contact</Text>
          <br />
          <View style={styles.contactCard}>
            <View style={styles.contactList}>
              {contacts.length > 0 ? (
                contacts.map((contact, index) => (
                  <View key={index}>
                    <ChipButton
                      key={index}
                      title={contact.name}
                      onPress={showViewContactSheet}
                    />
                  </View>
                ))
              ) : (
                <View style={styles.container}>
                  <View style={styles.textContent}>
                    {/* Add new user component */}
                    <Text style={styles.textContent}>
                      YOUR EMERGENCY CONTACTS WILL APPEAR HERE.
                    </Text>
                    <Text style={styles.textContent}>
                      You currently do not have any emergency contact. Import
                      contacts or add new contacts.
                    </Text>
                  </View>
                </View>
              )}
            </View>
            <br />
            <Button
              title={"Add Contact"}
              onPress={showAddContactModal}
              altText={"Add Contact"}
            />
          </View>
        </View>
      </View>       
      }
       

      {/* Main Activity contents Modals/screens/sheets | Outside the main content frame */}

      {/* view contact bottomsheet */}
    

      {/* Secondary Bottom Sheet  */}
      {/* <View style={styles.content}>
        <View style={styles.modalCard}>
          {selectedContact ? (
            <View style={styles.textContent}>
              <Text style={styles.title}>Trusted Contacts</Text>
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
        </View>
      </View> */}

      {/* Update Contact Modal */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View>
            {/* Modal Content */}
            <Text style={styles.modalText}>Update or Remove Contact</Text>

            {/* Input for Updating Contact */}
            <TextInput
              style={styles.input}
              placeholder="Enter updated contact"
              placeholderTextColor="#FFFFFF"
              onChangeText={(text) => setUpdatedContact(text)}
            />

            {/* Input for Removing Contact */}
            <TextInput
              style={styles.input}
              placeholder="Enter contact to remove"
              placeholderTextColor="#FFFFFF"
              onChangeText={(text) => setRemovedContact(text)}
            />

            {/* Update and Remove Contact Buttons */}
            <TouchableOpacity
              style={styles.updateButton}
              onPress={handleUpdateContact}
            >
              <Text style={styles.buttonText}>UPDATE CONTACT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.removeButton}
              onPress={handleRemoveContact}
            >
              <Text style={styles.buttonText}>REMOVE CONTACT</Text>
            </TouchableOpacity>

            {/* Close Modal Button */}
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>CLOSE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Login Form Modal */}
      <Modal
        transparent={true}
        visible={isLoginModalVisible}
        animationType="slide"
        onRequestClose={hideLoginModal}
      >
        <View style={styles.overlay} />
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <LoginScreen
              modalVisible={isLoginModalVisible}
              closeModal={() => hideLoginModal()}
              onRegister={showSignupModal}
              onForgotPass={showForgotPassModal}
            />
          </View>
        </View>
      </Modal>

      {/* Registration Form Modal */}
      <Modal
        transparent={true}
        visible={isSignupModalVisible}
        animationType="slide"
        onRequestClose={hideSignupModal}
      >
        <View style={styles.overlay}></View>
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <RegistrationScreen onLogin={showLoginModal} />
          </View>
        </View>
      </Modal>

      {/* Reset Password Form Modal */}
      <Modal
        transparent={true}
        visible={isForgotPassModalVisible}
        animationType="slide"
        onRequestClose={hideForgotPassModal}
      >
        <View style={styles.overlay}></View>
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <ForgotPassword />
            {/* Function to submit email for reset: Lucky H */}
          </View>
        </View>
      </Modal>

      {/* Edit/ Update Contacts Modal */}
      <Modal
        transparent={true}
        visible={isUpdateModalVisible}
        animationType="slide"
        onRequestClose={hideUpdateModal}
      >
        <View style={styles.overlay}></View>
        <View style={styles.modalContainer}>
          <View style={styles.card}>
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
                <View>
                  <View style={styles.contactList}>
                    {filteredContacts ? (
                      filteredContacts.map((contact, index) => (
                        <TouchableOpacity key={index}>
                          <ChipButton
                            key={index}
                            title={contact.name}
                            // onPress={() => selectContactForUpdate(contact)}
                            onPress={showViewContactSheet}
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
                </View>

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
        </View>
      </Modal>

      {/* Add Contact Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isAddContactModalVisible}
        onRequestClose={hideAddContactModal}
      >
        <View style={styles.overlay} />
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <Text style={styles.trustedContact}>Add New Contact</Text>

            <InputText
              label={"Name"}
              placeholder="Name"
              value={newContactData.name}
              onChangeText={(text) =>
                setNewContactData({ ...newContactData, name: text })
              }
            />

            {nameError && <Text style={styles.errorText}>{nameError}</Text>}
            <InputText
              label={"Number"}
              placeholder="Phone Number"
              value={newContactData.phoneNumber}
              onChangeText={(text) =>
                setNewContactData({ ...newContactData, phoneNumber: text })
              }
            />
            {phoneError && <Text style={styles.errorText}>{phoneError}</Text>}
            <InputText
              label={"Relationship"}
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
            </View>
          </View>
        </View>
      </Modal>

      {/* View Contacts Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isViewContactModalVisible}
        onRequestClose={hideViewContactModal}
      >
        <View style={styles.bottomSheet2}>
          <View style={styles.container}>
            <View style={styles.contactList}>
              {selectedContact ? (
                <View style={styles.textContent}>
                  <Text style={styles.textContent}>{selectedContact.name}</Text>
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
                <Text style={styles.errorMessage}>
                  No contact selected
                </Text>
              )}
            </View>
            <br />
          </View>
        </View>
      </Modal>

      {/* SHAKE ALERT NOTIFICATION MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isNotificationModalVisible}
        onRequestClose={hideNotificationModal}
      >
        <View style={styles.modalContainer}>
          <Text>
            Emergency! My current location:{" "}
            <Text
              style={styles.linkText}
              onPress={() => {
                const url = `https://www.google.com/maps/?q=${location.latitude},${location.longitude}`;
                Linking.openURL(url);
              }}
            >
              Open Google Maps
            </Text>
          </Text>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSheet: {
    display: "flex",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 30,
    borderRadius: 25,
    gap: 20,
    backgroundColor: "#125127",
    // alignItems: "flex-start",
    justifyContent: "center",
    textAlign: "center",
    // for the shadows at the top
    shadowColor: "#0000005a",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 4,
  },
  bottomSheet2: {
    zIndex: 1,
    display: "flex",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 30,
    borderRadius: 25,
    gap: 20,
    backgroundColor: "#002E15",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    textAlign: "center",
    bottom: 0,
    position: "absolute",
    height: "25%",
    width: "100%",
    // for the shadows at the top
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 4,
  },
  contactList: {
    width: "100%",
    display: "flex",
    alignSelf: "stretch",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 4,
    rowGap: 6,
    gap: 10,
    justifyContent: "left",
  },
  card: {
    display: "flex",
    alignSelf: "stretch",
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 30,
    borderRadius: 20,
    gap: 20,
    backgroundColor: "#002E15",
    // alignItems: "flex-start",
    justifyContent: "center",
    textAlign: "center",
  },
  trustedContact: {
    fontFamily: "Plus Jakarta Sans",
    fontSize: 20,
    fontWeight: "700",
    lineHeight: 25,
    letterSpacing: 0,
    textAlign: "center",
    color: "#FFFFFF", // White text color
  },
  additionalText: {
    fontFamily: "Roboto",
    fontSize: 13,
    fontStyle: "italic",
    fontWeight: "400",
    lineHeight: 18,
    letterSpacing: 0.16,
    textAlign: "center",
    marginTop: -20,
    color: "#FFFFFF", // White text color
  },
  paragraph: {
    fontFamily: "Roboto",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
    letterSpacing: 0.16,
    textAlign: "center",
    color: "#FFFFFF",
  },
  addButton: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 5,
      },
    }),
    width: "100%",
    height: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#C8FFD7",
    marginTop: -10,
  },
  addButtonText: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.46,
    textAlign: "center",
    color: "#000000",
    // marginTop: -10,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgb#00000061",
    paddingHorizontal: 10,
  },
  modalCard: {
    width: "100%", // Fill (393px)
    padding: 30,
    borderRadius: 20,
    gap: 20,
    backgroundColor: "#002E15",
    marginBottom: 20,
    justifyContent: "center",
    textAlign: "center",
  },
  modalText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  errorMessage: {
    color: "red",
    fontSize: 18,
    textAlign: "center",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
  },
  showSignupModal: {
    width: "100%",
    // position: "absolute",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
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
    marginBottom: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 200,
    display: "flex",
    // gap: 24,
  },
  //   This will be the background overlay of our modals
  overlay: {
    zIndex: -1,
    // display: "flex",
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000000a1",
    paddingHorizontal: 10,
  },
  input: {
    height: 40,
    borderColor: "#FFFFFF",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#FFFFFF",
    marginBottom: 20,
  },
  updateButton: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 5,
      },
    }),
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#C8FFD7",
    marginBottom: 10,
  },
  removeButton: {
    ...Platform.select({
      ios: {
        shadowColor: "rgba(0, 0, 0, 0.1)",
        shadowOpacity: 1,
        shadowRadius: 3,
        shadowOffset: {
          height: 1,
          width: 1,
        },
      },
      android: {
        elevation: 5,
      },
    }),
    width: "100%",
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#FF4040",
    marginBottom: 10,
  },
  buttonText: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.46,
    textAlign: "center",
    color: "#000000",
  },
  closeButton: {
    width: "100%",
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#C8FFD7",
    marginTop: 10,
  },
  closeButtonText: {
    fontFamily: "Roboto",
    fontSize: 15,
    fontWeight: "500",
    lineHeight: 26,
    letterSpacing: 0.46,
    textAlign: "center",
    color: "#000000",
  },

  // imported styles from Splash
  linkText: {
    color: "#fff",
    textDecorationLine: "underline",
    marginTop: 5,
  },
  container: {
    display: "flex",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "column",
    // paddingHorizontal: 10,
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
    color: "#f2f2f2",
    // gap: 20,
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
  buttonSection: {
    width: "100%",
    height: "auto",
    position: "relative",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  bgGreen: {
    backgroundColor: "green",
  },
});

export default LandingScreen;
